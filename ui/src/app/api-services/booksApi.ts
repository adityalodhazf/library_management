// call API from this file and 
// return the data from it to the compinent

// call the gRPC methods from this file

import * as grpc from "@grpc/grpc-js";
import GrpcClient from "./grpcClient";

export const getBooks = (
    req_payload: any
): Promise<any> => {
    // console.log("getBooks req_payload = ", req_payload);
    type Payload = {
        books: {
            title: string;
        }[];
        authors: Record<string, string>[];
    };


    let payload: Payload = {
        books: [],
        authors: []
    };

    switch (req_payload.filter) {
        case "title":
            if (req_payload.title != "") {
                payload.books.push({
                    title: req_payload.title
                });
            } else {

            }

            break;

        case "author":
            let author: Record<string, string> = {};
            if (req_payload.author_first_name != "") {
                author['first_name'] = req_payload.author_first_name;
            }

            if (req_payload.author_last_name != "") {
                author['last_name'] = req_payload.author_last_name;
            }

            if (Object.keys(author).length > 0) {
                payload.authors.push(author);
            }
            break;

        case "all":
        default:
            break;
    }

    // console.log("fetch_books payload =", payload);

    return new Promise((resolve, reject) => {
        GrpcClient.getInstance().fetch_books(
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


export const updateBook = (
    req_payload: any
): Promise<any> => {
    type Payload = {
        book_id?: number;
        title?: string;
        fine_per_day?: number;
    };

    console.log("booksAPI,book_id = ", req_payload.book_id)
    let payload: Payload = {
        book_id: Number(req_payload.book_id),
    };

    if (req_payload.title != "") {
        payload.title = req_payload.title;
    };

    if (req_payload.fine_per_day != "") {
        payload.fine_per_day = Number(req_payload.fine_per_day);
    };

    console.log("update book payload = ", payload)
    return new Promise((resolve, reject) => {
        GrpcClient.getInstance().update_book(
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
    // return null
};

import { Books } from "./db";

export const add_book = (req_payload: any) => {
    console.log("update book req_payload = ", req_payload)
    // const payload = {
    //     books: [
    //         {
    //             title: req_payload.title,
    //             fine_per_day: req_payload.fine_per_day,
    //             authors: [
    //                 {
    //                     first_name: req_payload.author_first_name,
    //                     last_name: req_payload.author_last_name
    //                 },
    //             ],
    //         },
    //     ],
    // };
    const payload = {
        title: req_payload.title,
        fine_per_day: req_payload.fine_per_day,
        authors: {
            authors: [
                {
                    first_name: req_payload.author_first_name,
                    last_name: req_payload.author_last_name
                },
            ],
        }
    };

    console.log("add book payload = ", payload)
    return new Promise((resolve, reject) => {
        GrpcClient.getInstance().insert_book(
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