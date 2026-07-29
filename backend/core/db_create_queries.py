import db_pb2
from datetime import datetime, timezone
from google.protobuf.json_format import MessageToDict

class QueryBuilder():
    def _build_fetch_authors_query(self, author:db_pb2.Author):
        print("QueryBuilder _build_fetch_authors_query called.")
        try:
            query = "SELECT author_id, first_name, last_name FROM authors"
            if len(author.ListFields()) >= 1:
                query += " WHERE " + " AND ".join([f"{key} = '{val}'" for (key, val) in MessageToDict(author, preserving_proto_field_name=True).items()])
            query += ";"
            return query
        except Exception as e:
            print("_build_fetch_authors_query Exception: {repr(e)}")
            return None

    def _build_insert_authors_query(self, authors:db_pb2.Authors):
        try:
            lst = authors.authors
            query = f"INSERT INTO authors (first_name, last_name) VALUES ('{lst[0].first_name.capitalize()}', '{lst[0].last_name.capitalize()}')"

            for index in range(1, len(lst)):
                line = f", ('{lst[index].first_name.capitalize()}', '{lst[index].last_name.capitalize()}')"
                query += line
                
            query += (
                f" ON CONFLICT (first_name, last_name)"
                f" DO UPDATE"
                f" SET first_name = EXCLUDED.first_name"
                f""" RETURNING
                    author_id,
                    first_name,
                    last_name,
                    (xmax = 0) AS inserted;"""
            )
            return query
        except Exception as e:
            print(f"_build_insert_authors_query exception: {repr(e)}")
            return None

    def _build_book_authors_query(self, book_ids, author_ids):
        try:
            query = "INSERT INTO book_authors (book_id, author_id) VALUES "
            values = [f"('{book_id}', '{author_id}')"
                      for book_id, author_id in zip(book_ids, author_ids)]

            query += ", ".join(values)
            query += (
                f" ON CONFLICT (book_id, author_id)"
                f" DO UPDATE"
                f" SET book_id = EXCLUDED.book_id"
                f" RETURNING (book_id, author_id);"
            )
            return query
        except Exception as e:
            print(f"_build_book_record_object Exception: {repr(e)}")
            return None

    def _build_fetch_members_query(self, member:db_pb2.Member):
        print("_build_fetch_members_query called.")
        try:
            query = "SELECT * from members"
            if len(member.ListFields()) >= 1:
                query += " WHERE " + " AND ".join([f"{key} = '{val}'" for (key, val) in MessageToDict(member, preserving_proto_field_name=True).items()])
            query += ";"
            return query
        except Exception as e:
            print("_build_fetch_members_query Exception: {repr(e)}")
            return None

    def _build_insert_book_query(self, book:db_pb2.Book):
        try:
            query = f"""
                INSERT INTO books (title, fine_per_day)
                VALUES ('{book.title}', {book.fine_per_day})
                ON CONFLICT (title)
                DO UPDATE
                SET title = EXCLUDED.title
                RETURNING book_id;
            """
            return query
        except Exception as e:
            print(f"_build_insert_book_query exception: {repr(e)}")
            return None

    def _build_insert_books_query(self, books:db_pb2.Books):
        try:
            lst = books.books
            query = (
                f"INSERT INTO books (title, isbn, genere, publisher, publication_date, fine_per_day) VALUES"
                f" ('{lst[0].title.capitalize()}', '{lst[0].isbn}', '{lst[0].genere.capitalize()}', '{lst[0].publisher.capitalize()}', '{lst[0].publication_date.ToDatetime().date()}', '{lst[0].fine_per_day}')"
            )

            for index in range(1, len(lst)):
                line = f", ('{lst[index].title.capitalize()}', '{lst[index].isbn}', '{lst[index].genere.capitalize()}', '{lst[index].publisher.capitalize()}', '{lst[index].publication_date.ToDatetime().date()}', '{lst[index].fine_per_day}')"
                query += line
                
            query += (
                f" ON CONFLICT (title)"
                f" DO UPDATE"
                f" SET title = EXCLUDED.title"
                f" RETURNING book_id;"
            )
            return query
        except Exception as e:
            print(f"_build_insert_books_query exception: {repr(e)}")
            return None

    def _build_update_book_query(self, book:db_pb2.Book):
        try:
            query = f"""
                UPDATE books
                SET
                    {", ".join(
                            [
                                f"{key} = {val}" if isinstance(val, int)
                                else f"{key} = '{val}'"
                                for key, val in MessageToDict(book, preserving_proto_field_name=True).items()
                                if key != "book_id"
                            ]
                        )
                    }
                WHERE book_id = {book.book_id}
                RETURNING book_id;
            """
            return query
        except Exception as e:
            print(f"_build_update_member_query Exception: {repr(e)}")
            return None

    def _build_insert_member_query(self, members: db_pb2.Members):
        try:
            values = [
                f"({member.branch_id}, "
                f"'{member.first_name.capitalize()}', "
                f"'{member.last_name.capitalize()}', "
                f"'{member.mobile_number}')"
                for member in members.members
            ]

            query = f"""
            INSERT INTO members
            (
                branch_id,
                first_name,
                last_name,
                mobile_number
            )
            VALUES
            {", ".join(values)}
            ON CONFLICT (first_name, last_name, mobile_number)
            DO UPDATE
            SET first_name = EXCLUDED.first_name
            RETURNING
                member_id,
                first_name,
                last_name,
                mobile_number,
                (xmax = 0) AS inserted;
            """

            return query

        except Exception as e:
            print(f"_build_insert_member_query Exception: {repr(e)}")
            return None

    def _build_update_member_query(self, member:db_pb2.Member):
        try:
            query = f"""
                UPDATE members
                SET
                    {", ".join(
                            [
                                f"{key} = {val}" if isinstance(val, int)
                                else f"{key} = '{val}'"
                                for key, val in MessageToDict(member, preserving_proto_field_name=True).items()
                                if key != "member_id"
                            ]
                        )
                    }
                WHERE member_id = {member.member_id}
                RETURNING member_id;
            """
            return query
        except Exception as e:
            print(f"_build_update_member_query Exception: {repr(e)}")
            return None

    def _build_insert_transaction_query(self):#, transaction:db_pb2.Transaction):
        try:
            query = f"""
                INSERT INTO transactions (
                    book_id,
                    member_id,
                    issued_branch_id,
                    issue_date
                ) VALUES
                (
                    :book_id,
                    :member_id,
                    :issued_branch_id,
                    CURRENT_TIMESTAMP
                )
                ON CONFLICT (book_id, member_id)
                DO UPDATE
                SET book_id = EXCLUDED.book_id
                RETURNING
                    transaction_id,
                    book_id,
                    member_id,
                    issued_branch_id,
                    issue_date,
                    (xmax = 0) AS inserted;
            """
            return query
        except Exception as e:
            print(f"_build_insert_transaction_query Exception: {repr(e)}")
            return None

    def _build_fetch_transactions_query(self, transaction:db_pb2.Transaction):
        try:
            query = f"""SELECT
                            transaction_id,
                            book_id,
                            member_id,
                            issued_branch_id,
                            issue_date,
                            return_date,
                            fine
                        FROM transactions
                    """
            if transaction.ListFields():
                query += f"""
                            WHERE
                            {" AND ".join([
                                            f"{key} = {val}" if isinstance(val, int) else f"{key} = '{val}'"
                                            for (key, val) in MessageToDict(transaction, preserving_proto_field_name=True).items()
                                        ])
                            }
                        """
            query += ";"
            return query
        except Exception as e:
            print(f"_build_fetch_transactions_query Exception: {repr(e)}")
            return None

    def _build_update_transactions_query(self, transaction:db_pb2.Transaction):
        try:
            query = f"""
                        UPDATE transactions t
                        SET
                            return_date = CURRENT_TIMESTAMP,
                            fine = GREATEST(
                                (
                                    (CURRENT_DATE - t.issue_date::date) - 7
                                ),
                                0
                            ) * b.fine_per_day
                        FROM books b
                        WHERE t.transaction_id = {transaction.transaction_id}
                            AND t.book_id = b.book_id
                            AND t.return_date IS NULL
                        RETURNING t.transaction_id, t.fine;
                        ;
                    """
            return query
        except Exception as e:
            print(f"_build_fetch_transactions_query Exception: {repr(e)}")
            return None