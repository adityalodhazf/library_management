import { NextResponse } from "next/server";
import { insert_members, update_member, fetch_members } from "@/app/api-services/membersApi";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const transaction = await insert_members(
            body.formData
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
        console.log("transactions route.js body.formData = ", body.formData);
        const transaction = await update_member(
            body.formData
        );

        // let transaction = {"message": "todo"};
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
    const mobile_number = searchParams.get('mobile_number');
    let payload = {}
    if (mobile_number) {
        payload['mobile_number'] = mobile_number;
    }
    // return NextResponse.json({"message":"todo"});
    try {
        const members = await fetch_members(payload);
        let data = await members
        // console.log("transactions route GET, data = ", data)
        return NextResponse.json(data);
        // return NextResponse.json({ message: "todo" });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch members" },
            { status: 500 }
        );
    }
};
