import { NextResponse } from "next/server";
import { insert_transaction, update_transaction, fetch_transactions } from "@/app/api-services/transactionsApi";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const transaction = await insert_transaction(
            body.transactionData
        );

        return NextResponse.json(transaction);
        // return NextResponse.json({message: "todo"});
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch transaction" },
            { status: 500 }
        );
    }
};

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        // console.log("transactions route.js body = ", body);
        const transaction = await update_transaction(
            body.selectedTransaction
        );

        return NextResponse.json(transaction);
        // return NextResponse.json({message: "todo"});
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch transaction" },
            { status: 500 }
        );
    }
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    let payload = {};
    if (searchParams.get('filter')) {
        payload['filter'] = searchParams.get('filter')
    }
    if (searchParams.get('member_id')) {
        payload['member_id'] = searchParams.get('member_id')
    }
    // return NextResponse.json({"message":"todo"});
    try {
        const transaction = await fetch_transactions(payload);
        let data = await transaction
        // console.log("transactions route GET, data = ", data)
        return NextResponse.json(transaction);
        // return NextResponse.json({ message: "todo" });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch transaction" },
            { status: 500 }
        );
    }
};
