"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBookPage() {
    // update the book
    // issue/book the book

    const [formData, setFormData] = useState({
        title: "",
        fine_per_day: 0,
        author_first_name: "",
        author_last_name: "",
    });

    const handleChange = async (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const router = useRouter();
    const handleSubmit = async (e) => {
        console.log("Add member called.")
        e.preventDefault();

        console.log("member_id page.js handleSubmit formData = ", formData)
        const res = await fetch("/api/books", {
            method: "POST",
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
                    Add Book
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Book Add Inputs */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Book Details
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Enter book title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Fine Per Day */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fine Per Day
                                </label>
                                <input
                                    type="number"
                                    name="fine_per_day"
                                    placeholder="Enter fine amount"
                                    value={formData.fine_per_day}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Author First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Author First Name *
                                </label>
                                <input
                                    type="text"
                                    name="author_first_name"
                                    placeholder="Enter first name"
                                    value={formData.author_first_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Author Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Author Last Name *
                                </label>
                                <input
                                    type="text"
                                    name="author_last_name"
                                    placeholder="Enter last name"
                                    value={formData.author_last_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Add
                    </button>
                </form>
            </div>
        </div>
    );
}
