// functions for Admin tasks e.g. fetchMembers, etc.

import * as grpc from "@grpc/grpc-js";
import GrpcClient from "./grpcClient";

export function fetchMembers(payload:any) {
    return new Promise((resolve, reject) => {
        GrpcClient.getInstance().fetch_members(
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
