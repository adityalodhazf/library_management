// call API from this file and 
// return the data from it to the compinent

// call the gRPC methods from this file

import * as grpc from "@grpc/grpc-js";
import GrpcClient from "./grpcClient";

export const insert_transaction = (req_payload:any) => {
    console.log("transactionsApi, insert_transaction req_payload = ", req_payload);

    return new Promise((resolve, reject) => {
        GrpcClient.getInstance().insert_transaction(
            req_payload,
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
};

export const update_transaction = (req_payload:any) => {
    console.log("transactionsApi, insertTransaction req_payload = ", req_payload);

    return new Promise((resolve, reject) => {
        GrpcClient.getInstance().update_transaction(
            req_payload,
            (err: grpc.ServiceError | null, response: any) => {
                if (err) {
                    console.error("gRPC Error:", err);
                    reject(err);
                    return;
                }

                console.log("fetch_books response =", response);
                resolve(response);
            }
        );
    });
}

export const fetch_transactions = (req_payload:any) => {
    console.log("transactionsApi, fetch_transactions req_payload = ", req_payload);

    return new Promise((resolve, reject) => {
        GrpcClient.getInstance().fetch_transactions(
            req_payload,
            (err: grpc.ServiceError | null, response: any) => {
                if (err) {
                    console.error("gRPC Error:", err);
                    reject(err);
                    return;
                }

                // console.log("fetch_transactions response =", response);
                resolve(response);
            }
        );
    });
}
