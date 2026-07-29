"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BookActionPage() {
    // update the book
    // issue/book the book

    const { book_id } = useParams();
    // console.log("BookActionPage, book_id = ", book_id)

    const [formData, setFormData] = useState({
        book_id: Number(book_id),
        title: "",
        fine_per_day: ""
    });

    const handleChange = async (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/books", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                formData
            }),
        });
        router.push(`/books/search`);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Update Book
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Book Update Inputs */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Details to update
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                name="title"
                                placeholder="Book Title"
                                value={formData.title}
                                onChange={handleChange}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />

                            <input
                                type="text"
                                name="fine_per_day"
                                placeholder="Fine Per Day"
                                value={formData.fine_per_day}
                                onChange={handleChange}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}