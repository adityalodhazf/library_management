// functions for books transactions e.g. issue/borrow, return, fetch, etc.
import * as grpc from "@grpc/grpc-js";
import GrpcClient from "./grpcClient";

export function issueBook(payload:any) {
    return new Promise((resolve, reject) => {
        GrpcClient.getInstance().insert_transaction(
            payload,
            (err: grpc.ServiceError | null, response: any) => {
                if (err) {
                    console.error("gRPC Error:", err);
                    reject(err);
                    return;
                }

                // console.log("fetch_books response =", response);
                resolve(response);
            }
        );
    });
}


export function returnBook(payload:any) {
    return new Promise((resolve, reject) => {
        GrpcClient.getInstance().update_transaction(
            payload,
            (err: grpc.ServiceError | null, response: any) => {
                if (err) {
                    console.error("gRPC Error:", err);
                    reject(err);
                    return;
                }

                // console.log("fetch_books response =", response);
                resolve(response);
            }
        );
    });
}


export function fetchTransactions(payload:any) {
    // let payload:any = {
    //     // book_id: 5,
    //     // member_id: 1,
    //     // issued_branch: 1
    // }

    return new Promise((resolve, reject) => {
        GrpcClient.getInstance().fetch_transactions(
            payload,
            (err: grpc.ServiceError | null, response: any) => {
                if (err) {
                    console.error("gRPC Error:", err);
                    reject(err);
                    return;
                }

                // console.log("fetch_books response =", response);
                resolve(response);
            }
        );
    });
}
