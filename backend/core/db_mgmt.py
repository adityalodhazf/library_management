import csv
import io
import os
import sys
import threading
from pathlib import Path

from core.db_create_queries import QueryBuilder as qb

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, scoped_session

from google.protobuf.timestamp_pb2 import Timestamp

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import db_pb2

load_dotenv()

class DBManager():
    _instance = None
    _lock = threading.Lock() #ensured thread safety during initialization
    _database_url = os.getenv("DATABASE_URL")

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            with cls._lock:
                if not cls._instance:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):#, database_url: str):
        if self._initialized:
            return

        # 1. Create a single engine with a built-in QueuePool
        self.engine = create_engine(
            self._database_url,
            pool_size=10,         # Maximum persistent connections
            max_overflow=20,      # Transient connections allowed under heavy load
            pool_recycle=3600,    # Recycle connections after 1 hour
            pool_pre_ping=True    # Check connection health before checkout
        )
        
        # 2. Bind a thread-local scoped session factory
        self.session_factory = scoped_session(
            sessionmaker(bind=self.engine)
        )
        self._initialized = True

    def get_session(self):
        """Returns a thread-safe scoped session."""
        return self.session_factory()


class DB():
    def __init__(self):
        super().__init__()

    def _execute(self, query, params={}):
        res = None
        try:
            db = DBManager()
            session = db.get_session()
            if params:
                res = session.execute(text(query), params)
            else:
                res = session.execute(text(query))
            session.commit()
        except Exception as e:
            print(f"_execute Exception: {repr(e)}")
            res = repr(e)
        finally:
            db.session_factory.remove()
        
        return res


    def fetch_authors(self, author:db_pb2.Author):
        """
        returns all authors from the table
        """
        print("fetching all authors")
        rows = []
        try:
            res = self._execute(qb()._build_fetch_authors_query(author=author))
            if not res:
                raise Exception(f"fetch_all_authors, _execute Exception: {repr(e)}")

            return db_pb2.Authors(
                authors = [
                    db_pb2.Author(
                        author_id=row[0],
                        first_name=row[1],
                        last_name=row[2]
                    )
                    for row in res
                ]
            )
        except Exception as e:
            print(f"fetch_all_authors Exception: {repr(e)}")

    def insert_authors(self, authors:db_pb2.Authors):
        results = None
        try:
            res = self._execute(query=qb()._build_insert_authors_query(authors=authors))
            return res
        except Exception as e:
            print(f"db_mdmg insert authors exception: {repr(e)}")

        return results

    def _build_author_record_object(self, row):
        try:
            return db_pb2.Author(
                first_name = row.get('author_first_name'),
                last_name = row.get('author_last_name')
            )
        except Exception as e:
            print(f"_build_author_record_object Exception: {repr(e)}")

    def _build_book_record_object(self, row):
        try:
            return db_pb2.Book(
                title = row.get('title'),
                isbn = row.get('isbn'),
                genere = row.get('genre'),
                publisher = row.get('publisher'),
                publication_date = Timestamp(
                    seconds = int(row.get('publication_date_seconds')),
                    nanos = int(row.get('publication_date_nanos')) or 0
                ),
                fine_per_day = 10
            )
        except Exception as e:
            print(f"_build_book_record_object Exception: {repr(e)}")

    def insert_book(self, book:db_pb2.Book):
        print("DB() insert_book called")
        try:
            # insert book
            book_ids = self._execute(qb()._build_insert_book_query(book=book)).scalars().all()

            # insert author
            authors = db_pb2.Authors()
            #     authors = db_pb2.Author (
            #         first_name = book.authors.first_name,
            #         last_name = book.authors.last_name
            #     )
            # )
            breakpoint()
            # for book in book.books:
            authors.authors.extend(book.authors.authors)
            author_ids = self.insert_authors(authors).scalars().all()

            # insert book_authors
            res = self._execute(query=qb()._build_book_authors_query(book_ids, author_ids))

            rows = res.fetchall()
            if rows:
                return "Book added successfully"
        except Exception as e:
            print(f"DB() insert_book Exception: {repr(e)}")

    def insert_books_bulk(self, content):
        try:
            # csv_content = content.decode('utf-8')
            # reader = csv.DictReader(io.StringIO(csv_content))
            # rows = list(reader)
            rows = list(csv.DictReader(io.StringIO(content.decode('utf-8'))))

            authors = []
            books = []
            for row in rows:
                authors.append(self._build_author_record_object(row=row))
                books.append(self._build_book_record_object(row=row))
                
            # insert authors
            author_ids = self.insert_authors(db_pb2.Authors(authors=authors)).scalars().all()

            # insert books
            book_ids = self._execute(query=qb()._build_insert_books_query(db_pb2.Books(books = books))).scalars().all()

            # insert book_authors entries
            res = self._execute(query=qb()._build_book_authors_query(book_ids, author_ids))

            return "book records updated" if res else "insert_books_bulk work in progress."
        except Exception as e:
            print(f"insert_books_bulk Excpetion: {repr(e)}")

        return "insert book failed."
    

    def insert_members(self, members:db_pb2.Members):
        print(f"insert_member called")
        try:
            res = self._execute(qb()._build_insert_member_query(members=members))
            if res and not isinstance(res, str):
                res = res.fetchall()
                if res:
                    return "Member addedd successfully." if res[0][-1] else "Member already exists."
            elif isinstance(res, str):
                return res
            else:
                return "Member onboarding failed."
        except Exception as e:
            print(f"insert_members Exception: {repr(e)}")
            return "DB insert_members Exception"
    
    def fetch_members(self, member:db_pb2.Member):
        print("DB fetch_members called.")
        res = None
        try:
            res = self._execute(qb()._build_fetch_members_query(member=member))
            if res:
                return db_pb2.Members(
                    members = [
                        db_pb2.Member(
                            member_id = row[0],
                            branch_id = row[1],
                            first_name = row[2],
                            last_name = row[3],
                            mobile_number = row[7],
                            is_active = row[10]
                        )
                        for row in res
                    ]
                )

            return res
        except Exception as e:
            print(f"DB fetch_members Exception: {repr(e)}")
            # return "DB fetch_members Exception"
    
    def _fetch_book_details_from_book_name(self, book: db_pb2.Book):
        print(f"DB() _fetch_book_details_from_book_name called for book: {book}")
        try:
            query = f"SELECT book_id, title, genere FROM books where title = '{book.title}';"
            return self._execute(query=query)
        except Exception as e:
            print(f"DB() _get_book_id_from_book_name Exception: {repr(e)}")
            return None

    def _fetch_book_details_from_book_ids(self, book_ids:list):
        print(f"DB() _fetch_book_details_from_book_id called for book_id: {book_ids}")
        try:
            query = f"SELECT book_id, title, genere FROM books where book_id = ANY(ARRAY{book_ids});"
            return self._execute(query=query)
        except Exception as e:
            print(f"DB() _fetch_book_details_from_book_id Exception: {repr(e)}")
            return None

    def _fetch_author_id_from_book_authors_table(self, book_id: int):
        print(f"DB() _fetch_author_id_from_book_authors_table called.")
        try:
            query = f"SELECT author_id FROM book_authors WHERE book_id = {book_id};"
            return self._execute(query=query)
        except Exception as e:
            print(f"DB() _fetch_author_id_from_book_authors_table Exception: {repr(e)}")
            return None

    def _fetch_authors_using_ids(self, author_ids:list):
        print(f"DB() _fetch_authors_using_ids called with author_ids: {author_ids}")
        try:
            query = f"SELECT author_id, first_name, last_name FROM authors WHERE author_id = ANY(ARRAY{author_ids});"
            return self._execute(query=query)
        except Exception as e:
            print(f"DB() _fetch_authors_using_ids Exception: {repr(e)}")
            return None

    def _fetch_author_id_from_author_name(self, author:db_pb2.Author):
        print(f"DB() _fetch_author_id_from_author_name called.")
        try:
            query = qb()._build_fetch_authors_query(author=author)
            return self._execute(query=query)
        except Exception as e:
            print(f"DB() _fetch_author_id_from_author_name Exception: {repr(e)}")
            return None

    def _fetch_book_ids_from_book_authors_table(self, author_id:int):
        print(f"DB() _fetch_book_ids_from_book_authors_table called.")
        try:
            query = f"SELECT book_id FROM book_authors WHERE author_id = {author_id};"
            return self._execute(query=query)
        except Exception as e:
            print(f"DB() _fetch_book_ids_from_book_authors_table Exception: {repr(e)}")
            return None

    def _fetch_all_books(self, book_id:int = None):
            print(f"DB() _fetch_book_ids_from_book_authors_table called.")
            try:
                query = f"SELECT book_id, title, genere FROM books"
                if book_id:
                    query += f""" WHERE book_id = {book_id}"""
                query += ";"
                return self._execute(query=query)
            except Exception as e:
                print(f"DB() _fetch_all_books Exception: {repr(e)}")
                return None

    def fetch_books(self, fetch_books_payload:db_pb2.FetchBooksPayload):
        print("DB() fetch_books called.")
        print(fetch_books_payload)
        try:
            books = []
            authors = []
            # case 1: book name is provided
            if fetch_books_payload.books:
                #   1. find book id
                books = self._fetch_book_details_from_book_name(fetch_books_payload.books[0]).fetchall()
                if books:
                    book_id = books[0].book_id
                    #   2. fetch author ids using book id from book_authors table
                    author_ids = [record[0] for record in self._fetch_author_id_from_book_authors_table(book_id=book_id).fetchall()]
                    #   3. fetch author names for the author_ids returned from book_authors
                    authors = self._fetch_authors_using_ids(author_ids=author_ids).fetchall()
            elif fetch_books_payload.authors:
                # case 2: author name is provided
                #   1. find author id
                authors = self._fetch_author_id_from_author_name(author=fetch_books_payload.authors[0]).fetchall()
                if authors:
                    author_id = authors[0].author_id
                    #   2. fetch book ids using author_id from book_authors table
                    book_ids = [record[0] for record in self._fetch_book_ids_from_book_authors_table(author_id=author_id).fetchall()]
                    #   3. fetch book names for the author_ids returned from book_authors
                    books = self._fetch_book_details_from_book_ids(book_ids=book_ids).fetchall()
            else:
                # case 3: no author or book details provided
                # return all the books
                books = self._fetch_all_books()

            
            # build final payload to return (book_id, book_name)(s), (author_id, author_name)(s)
            fetch_books_payload = db_pb2.FetchBooksPayload(
                books = [
                        db_pb2.Book(
                            book_id = book.book_id,
                            title = book.title
                        )
                        for book in books
                    ],

                authors = [
                        db_pb2.Author(
                            author_id = author.author_id,
                            first_name = author.first_name,
                            last_name = author.last_name
                        )
                        for author in authors
                    ]
            )

            # fetch_books_payload = db_pb2.FetchBooksPayload()
            # fetch_books_payload.books.extend(books)
            # fetch_books_payload.authors.extend(authors)
        except Exception as e:
            print(f"DB() fetch_books Exception: {repr(e)}")
            return None
        return fetch_books_payload

    def update_book(self, book:db_pb2.Book):
        print(f"DB() update_member called. with book = {book}")
        try:
            res = self._execute(qb()._build_update_book_query(book=book))
            return db_pb2.SuccessMessage(
                message = "Successfully updated Book details" if res.rowcount else "Book details update failed."
            )
        except Exception as e:
            print(f"DB update_book Exception: {repr(e)}")
            return db_pb2.SuccessMessage(
                message = repr(e)
            )


    def update_member(self, member: db_pb2.Member):
        print(f"DB() update_member called. with member = {member}")
        try:
            if member.HasField('mobile_number'):
                temp_member = db_pb2.Member(
                    mobile_number = member.mobile_number
                )
                res = self.fetch_members(member=temp_member)
                if res.ListFields():
                    return db_pb2.SuccessMessage(
                        message = "Mobile number exists."
                    )
            res = self._execute(qb()._build_update_member_query(member=member))
            return db_pb2.SuccessMessage(
                message = "Successfully updated Member details" if res.rowcount else "Member details update failed."
            )
        except Exception as e:
            print(f"DB update_member Exception: {repr(e)}")
            return db_pb2.SuccessMessage(
                message = repr(e)
            )
        
    def insert_transaction(self, transaction: db_pb2.Transaction):
        print(f"DB() insert_transaction called with transaction: {transaction}")
        try:
            res = self._execute(
                    qb()._build_insert_transaction_query(),
                    {
                        "book_id": transaction.book_id,
                        "member_id": transaction.member_id,
                        "issued_branch_id": transaction.issued_branch_id
                    }
                )
            if res:
                row = res.fetchall()
            return f"successful transaction id = {row[0][0]}" if row[0][-1] else f"transaction exists with id = {row[0][0]}"
        except Exception as e:
            print(f"DB() insert_transaction Exception: {repr(e)}")
            return repr(e)

    def fetch_transactions(self, transaction: db_pb2.Transactions):
        print(f"DB() fetch_transactions called with transaction: {transaction}")
        try:
            query = qb()._build_fetch_transactions_query(transaction=transaction)
            res = self._execute(query=query)
            rows = res.fetchall()
            transactions = []
            if rows:
                for row in rows:
                    ts = Timestamp()
                    ts.FromDatetime(row.issue_date)
                    issue_date = ts
                    return_date = None
                    if row.return_date:
                        ts = Timestamp()
                        ts.FromDatetime(row.return_date)
                        return_date = ts
                    transaction = db_pb2.Transaction(
                                    transaction_id = row.transaction_id,
                                    book_id = row.book_id,
                                    member_id = row.member_id,
                                    issued_branch_id = row.issued_branch_id,
                                    issue_date = issue_date,
                                    return_date = return_date,
                                    fine = row.fine
                                )
                    transactions.append(transaction)
        except Exception as e:
            print(f"DB() fetch_transactions Exception: {repr(e)}")
        
        return db_pb2.Transactions(transactions = transactions)
    
    def update_transaction(self, transaction: db_pb2.Transaction):
        print(f"DB() update_transaction called with transaction: {transaction}")
        try:
            query = qb()._build_update_transactions_query(transaction=transaction)
            res = self._execute(query=query)
            if res:
                rows = res.fetchall()
                message = ""
                if len(rows):
                    messages = []
                    for row in rows:
                        messages.append(f"transaction_id = {row[0]}, Fine = {row[1]}")
                    message = "Success." + " ,".join(messages)
                else:
                    message = "Transaction already closed."
                return db_pb2.SuccessMessage(
                    message = message
                )
        except Exception as e:
            print(f"DB() update_transaction Exception: {repr(e)}")
        return db_pb2.SuccessMessage(
            message = "Failed to update the transaction."
        )


def test():
    # --- Usage Example ---
    # DATABASE_URL = "postgresql://admin:password12345@localhost:5432/library_mgmt"
    DATABASE_URL = os.getenv("DATABASE_URL")

    # Both calls yield the exact same instance and share the same pool
    db1 = DBManager()
    # db2 = DBManager(DATABASE_URL)
    # print(db1 is db2)  # True

    # Execute queries safely using context managers
    session = db1.get_session()
    try:
        result = session.execute(text("SELECT * FROM authors;"))
        rows = result.fetchall()
        # rows = db1.fetch_all_authors()
        if not rows:
            print("Table is empty.")
        else:
            # for row in rows:
                print(rows)
        session.commit()
    except Exception as e:
        print(f"Query execution failed: {repr(e)}")
    finally:
        db1.session_factory.remove()  # Clean up and return connection to pool


if __name__ == "__main__":
    print("Test function for sqlalchemy connection pool")
    test()