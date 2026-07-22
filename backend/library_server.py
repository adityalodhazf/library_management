from concurrent import futures

import grpc
import db_pb2
import db_pb2_grpc

from core.db_mgmt import DB
from core.db_create_tables import CreateDBTables

class LibraryManagementService(db_pb2_grpc.LibraryManagementServicer):
    # def __init__(self):
    #     self.count = 0

    def create_tables(self, request, context):
        print("Insert books request mande.")
        print(request)
        success_message = db_pb2.SuccessMessage()

        try:
            obj = CreateDBTables()
            obj.drop_all_tables()
            res = obj.create_all_tables()
            success_message.message = res
        except Exception as e:
            print(f"Exception while creating DB tables: {repr(e)}")
            success_message.message = "DB Table creation failed."
        
        return success_message

    def insert_books(self, request, context):
        print("insert_books reqeust made.")
        print(request)

        success_message = db_pb2.SuccessMessage()
        try:
            success_message.message = "insert_books not implemented yet."
        except Exception as e:
            print(f"insert_books Exception: {repr(e)}")
            success_message.message = "insert_books Exception."
        
        return success_message

    def insert_books_bulk(self, request, context):
        print("insert_books_bulk request mande.")
        print(request)

        success_message = db_pb2.SuccessMessage()
        try:
            success_message.message = DB().insert_books_bulk(request.content)
        except Exception as e:
            print(f"Insert books excpetion: {repr(e)}")
            success_message.message = "Insert books failed"

        return success_message

    def insert_authors(self, request, context):
        print("Insert Authors request mande.")
        print(type(request))
        success_message = db_pb2.SuccessMessage()
        try:
            DB().insert_authors(request)
            success_message.message = "Author inserted successfully"
        except Exception as e:
            print(f"Exception in inserting author: {repr(e)}")        
            success_message.message = "Insert authors failed"

        return success_message
    
    def insert_members(self, request, context):
        print("Insert Members request mande.")
        print(request)

        try:
            success_message = db_pb2.SuccessMessage()
            res = DB().insert_members(request)
            success_message.message = res
        except Exception as e:
            print(f"insert_members Exception: {repr(e)}")
            success_message.message = "Insert members exeption"
        return success_message

    def fetch_authors(self, request, context):
        print("DB().fetch_authors is called")
        print(request)
        return DB().fetch_authors(request)

    def fetch_members(self, reqeust, context):
        print("server fetch_members called.")
        print(reqeust)
        return DB().fetch_members(reqeust)

    def update_member(self, request, context):
        print("server update_member called.")
        print(request)
        return DB().update_member(request)

    def fetch_books(self, request, context):
        print("server fetch_books called.")
        print(request)
        return DB().fetch_books(fetch_books_payload=request)

    def insert_transaction(self, request, context):
        print("server insert_transaction called.")
        print(request)
        return db_pb2.SuccessMessage(
            message = DB().insert_transaction(request)
        )

    def fetch_transactions(self, request, context):
        print("server fetch_transactions called.")
        print(request)
        return DB().fetch_transactions(request)

    def update_transaction(self, request, context):
        print("server update_transaction called.")
        print(request)
        return DB().update_transaction(request)


def serve():
    print("Strating Library Management Server")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    db_pb2_grpc.add_LibraryManagementServicer_to_server(LibraryManagementService(), server)
    server.add_insecure_port("localhost:50051")
    server.start()
    print("Library Management Server started on port 50051")
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
