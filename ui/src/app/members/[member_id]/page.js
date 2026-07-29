"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function MemberUpdatePage() {
    // update the book
    // issue/book the book

    const { member_id } = useParams();
    // console.log("BookActionPage, member_id = ", member_id)

    const [formData, setFormData] = useState({
        member_id: Number(member_id),
        first_name: "",
        last_name: "",
        mobile_number: "",
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
        e.preventDefault();

        console.log("member_id page.js handleSubmit formData = ", formData)
        const res = await fetch("/api/members", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                formData
            }),
        });
        router.push(`/members`);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Update Member
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Member Update Inputs */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            Details to Update
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder="Enter First Name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    placeholder="Enter Last Name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Mobile Number */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mobile Number
                                </label>
                                <input
                                    type="text"
                                    name="mobile_number"
                                    placeholder="Enter Mobile Number"
                                    value={formData.mobile_number}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

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