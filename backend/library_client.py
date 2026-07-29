import db_pb2
import db_pb2_grpc

from datetime import datetime
from google.protobuf.empty_pb2 import Empty
from google.protobuf.timestamp_pb2 import Timestamp

import grpc


def build_single_book_request():
    publication_date = Timestamp()
    publication_date.FromDatetime(datetime(2020, 1, 15, 10, 0, 0))

    book = db_pb2.Book(
        title="The Hobbit",
        isbn="9780547928227",
        genere="Fantasy",
        publisher="Houghton Mifflin",
        publication_date=publication_date,
        fine_per_day=50,
    )
    return db_pb2.Books(books=[book])


def fetch_authors(stub):
    first_name = input("do you know the author's first_name: ")
    last_name = input("Do you know the author;'s last_name: ")
    author = db_pb2.Author()
    if first_name:
        author.first_name = first_name.capitalize()
    if last_name:
        author.last_name = last_name.capitalize()
    result = stub.fetch_authors(author)
    for author in result.authors:
        print(
            f"id: {author.author_id}"
            f", first_name: {author.first_name}"
            f", last_name: {author.last_name}"
        )


def insert_author(stub):
    print("Inserting author")
    first_name = input("First Name: ")
    last_name = input("Last name: ")

    authors = []
    author = db_pb2.Author(
        first_name = first_name,
        last_name = last_name
    )
    authors.append(author)
    success_message = stub.insert_authors(db_pb2.Authors(authors=authors))
    print(success_message)


def myexit(stub):
    exit()


def create_tables(stub):
    print("create all tables")
    success_message = stub.create_tables(Empty())
    print(success_message)


def insert_books_bulk(stub):
    print("insert books called.")
    with open("books.csv", "rb") as f:
        content = f.read()

    req = db_pb2.CsvRequest(
        filename = "books.csv",
        content = content
    )
    success_message = stub.insert_books_bulk(req)
    print(success_message)


def member_input():
    branch_id = input("Enter branch id: ")
    first_name = input("Enter user's first_name: ")
    last_name = input("Enter user's last_name: ")
    mobile_number = input("Enter 10 digit mobile number: ")
    member = db_pb2.Member()
    if branch_id:
        member.branch_id = int(branch_id)
    if first_name:
        member.first_name = first_name.capitalize()
    if last_name:
        member.last_name = last_name.capitalize()
    if mobile_number:
        member.mobile_number = mobile_number

    return member


def book_input():
    title = input("Enter book title: ")
    fine_per_day = input("Enter fine_per_day: ")
    author_first_name = input("Author first name: ")
    author_last_name = input("Author last name: ")
    book = db_pb2.Book()
    if title:
        book.title = title
    if fine_per_day:
        book.fine_per_day = int(fine_per_day)
    # author = db_pb2.Author()
    author = book.authors.authors.add()
    if author_first_name:
        author.first_name = author_first_name
    if author_last_name:
        author.last_name = author_last_name
    # book.authors = [author]
    
    return book


def insert_member(stub):
    print("insert_member")
    member = member_input()
    success_message = stub.insert_members(db_pb2.Members(members = [member]))
    print(success_message)


def update_author(stub):
    print("update_author called")
    author_id = int(input("Enter author id: "))
    first_name = input("udpate first name (no input, no update): ")
    last_name = input("udpate last name (no input, no update): ")

def fetch_members(stub):
    member = member_input()
    result = stub.fetch_members(member)
    if result.ListFields():
        print(result)
    else:
        print("No members found.")

def update_member(stub):
    print("update_member called.")
    mobile_number = input("Member's mobile number: ")
    result = stub.fetch_members(db_pb2.Member(mobile_number = mobile_number))
    if not result.ListFields():
        print("Member not found.")
        return
    print("Enter values which you want to udpate. keep other inputs blank.")
    member = member_input()
    member.member_id = result.members[0].member_id
    result = stub.update_member(member) if member.ListFields() else "No data to update."
    print(result)


def fetch_books(stub):
    print("fetch_books called.")
    print("Enter deatils to search the book")
    choice = int(input("(1) Search by Book title  (2) Search by Author (3) Fetch all - Enter choice (1/2/3): "))
    fetch_book_payload = db_pb2.FetchBooksPayload()
    if choice == 1: # search by book name
        book_title = input("Enter book title: ")
        if book_title:
            book = db_pb2.Book(
                title = book_title
            )
        else:
            print("No book title provided")
            return
        fetch_book_payload.books.extend([book])
    elif choice == 2: # search by author name
        author_first_name = input("Enter author's first name: ")
        author_last_name = input("Enter author's last name: ")
        author = db_pb2.Author()
        if author_first_name:
            author.first_name = author_first_name
        if author_last_name:
            author.last_name = author_last_name
        
        if not author_first_name and not author_last_name:
            print("No author details provided.")
            return
        fetch_book_payload.authors.extend([author])
    elif choice == 3:
        # fetch all books
        pass
    else:
        print("fetch_books Invalid input option.")
        return
    
    res = stub.fetch_books(fetch_book_payload)
    print(res)

def update_book(stub):
    print("update_book called.")
    book_id = input("Enter book id: ")
    # result = stub.fetch_book_by_id(int(book_id))
    # if not result.ListFields():
    #     print("book not found.")
    #     return
    print("Enter values which you want to udpate. keep other inputs blank.")
    book = book_input()
    book.book_id = int(book_id)
    result = stub.update_book(book) if book.ListFields() else "No data to update."
    print(result)

def transaction_input():
    try:
        book_id = int(input("Enter book_id: "))
        member_id = int(input("Enter member_id: "))
        # issued_branch_id = int(input("Enter issued_branch_id: "))

        return db_pb2.Transaction(
            book_id = book_id,
            member_id = member_id,
            issued_branch_id = 1
        )
    except Exception as e:
        print(f"transaction_input Exception: {repr(e)}")
        return None

def insert_transaction(stub):
    try:
        transaction = transaction_input()
        if transaction:
            res = stub.insert_transaction(transaction)
            print(res)
        else:
            print("Invalid input.")
    except Exception as e:
        print(f"insert_transaction Exception: {repr(e)}")
        return

def insert_book(stub):
    try:
        book = book_input()
        if book:
            res = stub.insert_book(book)
            print (res)
    except Exception as e:
        print(f"client insert_book Exception: {repr(e)}")
        return

def fetch_transaction(stub):
    try:
        member_id = input("Enter member_id: ")
        branch_id = input("Enter branch id: ")
        transaction = db_pb2.Transaction()
        if member_id:
            transaction.member_id = int(member_id)
        if branch_id:
            transaction.branch_id = int(branch_id)
        res = stub.fetch_transactions(transaction)
        print(res)
    except Exception as e:
        print(f"insert_transaction Exception: {repr(e)}")
        return

def update_transaction(stub):
    try:
        transaction_id = input("Enter transaction id: ")
        if not transaction_id:
            print("NO transaction id provided. Exiting.")
            return
        transaction = db_pb2.Transaction(
            transaction_id = int(transaction_id)
        )
        res = stub.update_transaction(transaction)
        print(res)
    except Exception as e:
        print(f"insert_transaction Exception: {repr(e)}")
        return


def run():
    actions = {
        1: "Exit",
        2: "Create DB Tables",
        3: "Insert books bulk",
        4: "Insert author",
        5: "Fetch authors",
        6: "Update author",
        7: "Insert member",
        8: "Fetch members",
        9: "Update member",
        10: "Fetch books",
        11: "Update book",
        12: "Insert transaction",
        13: "Fetch transaction",
        14: "Update transaction",
        15: "Insert books"
    }

    functions = {
        1: myexit,
        2: create_tables,
        3: insert_books_bulk,
        4: insert_author,
        5: fetch_authors,
        6: update_author,
        7: insert_member,
        8: fetch_members,
        9: update_member,
        10: fetch_books,
        11: update_book,
        12: insert_transaction,
        13: fetch_transaction,
        14: update_transaction,
        15: insert_book
    }

    print(actions)
    with grpc.insecure_channel("localhost:50051") as channel:
        stub = db_pb2_grpc.LibraryManagementStub(channel)
        rpc_call = input(f"Which rpc call do you want to make (1-{len(actions)}): ")
        if not rpc_call:
            print("Please enter a number.")
            return
        rpc_call = int(rpc_call)
        if rpc_call not in range(len(actions) + 1):
            print("Invalid action.")
        else:
            functions[rpc_call](stub=stub)


if __name__ == "__main__":
    print("Starting Library Management Test Client")
    while True:
        run()
