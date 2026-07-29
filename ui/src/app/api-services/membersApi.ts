// call API from this file and 
// return the data from it to the compinent

// call the gRPC methods from this file

import * as grpc from "@grpc/grpc-js";
import GrpcClient from "./grpcClient";

export const insert_members = (req_payload:any) => {
    console.log("transactionsApi, insert_members req_payload = ", req_payload);
    let payload = {
        members: [req_payload]
    };

    return new Promise((resolve, reject) => {
        GrpcClient.getInstance().insert_members(
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
};

export const update_member = (req_payload:any) => {
    console.log("membersApi, update_member req_payload = ", req_payload);

    let payload = {
        member_id: req_payload.member_id,
    };
    if (req_payload.first_name != "") {
        payload['first_name'] = req_payload.first_name;
    }
    if (req_payload.last_name != "") {
        payload['last_name'] = req_payload.last_name;
    }
    if (req_payload.mobile_number != "") {
        payload['mobile_number'] = req_payload.mobile_number;
    }

    console.log("membersApi, PUT, payload = ", payload);
    return new Promise((resolve, reject) => {
        GrpcClient.getInstance().update_member(
            payload,
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

export const fetch_members = (req_payload:any) => {
    console.log("transactionsApi, fetch_members req_payload = ", req_payload);

    return new Promise((resolve, reject) => {
        GrpcClient.getInstance().fetch_members(
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
