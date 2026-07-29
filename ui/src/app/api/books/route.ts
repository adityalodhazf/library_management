// src/app/api/books/route.ts

import { NextResponse } from "next/server";
import { getBooks, updateBook, add_book } from "@/app/api-services/booksApi";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        let payload = {}
        if (searchParams.get('filter')) {
            payload['filter'] = searchParams.get('filter')
        }
        if (searchParams.get('title')) {
            payload['title'] = searchParams.get('title')
        }
        if (searchParams.get('author_first_name')) {
            payload['author_first_name'] = searchParams.get('author_first_name')
        }
        if (searchParams.get('author_last_name')) {
            payload['author_last_name'] = searchParams.get('author_last_name')
        }

        const books = await getBooks(
            payload
        );

        return NextResponse.json(books);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch books" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("books api route.ts POST body.formData = ", body.formData);
        const books = await add_book(
            body.formData
        );

        return NextResponse.json(books);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch books" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        console.log("book update route PUT, body = ", body)
        const res = await updateBook(
            body.formData
        );

        return NextResponse.json(res);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to udpate book" },
            { status: 500 }
        );
    }
}