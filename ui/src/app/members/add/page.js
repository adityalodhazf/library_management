"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMemberPage() {
    // update the book
    // issue/book the book

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        branch_id: 1,
        // is_active: "",
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
        const res = await fetch("/api/members", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                formData
            }),
        });
        const data = await res.json()
        console.log("Add member - data = ", data);
        router.push(`/members`);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Add Member
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Member Add Inputs */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Details to add
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required={true}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />

                            <input
                                type="text"
                                name="mobile_number"
                                placeholder="Mobile Number"
                                value={formData.mobile_number}
                                onChange={handleChange}
                                required={true}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
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
