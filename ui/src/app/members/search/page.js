"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MembersPage() {
    const [formData, setFormData] = useState({
        member_id: "",
        branch_id: "",
        first_name: "",
        last_name: "",
        mobile_number: "",
        is_active: "",
        filter: "all",
    });

    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);

    const router = useRouter();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let url = "/api/members";

        if (formData.mobile_number !== "") {
            url += `?mobile_number=${formData.mobile_number}`;
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        setMembers(data.members || []);
    };

    const handleUpdateMember = (e) => {
        e.preventDefault();

        if (!selectedMember) return;

        router.push(`/members/${selectedMember.member_id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-10 px-4 md:px-10">
            {/* Search Card */}
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
                <h2 className="text-4xl font-extrabold text-center text-slate-800 tracking-tight mb-8">
                    👥 Search Members
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Search Type
                        </label>

                        <div className="flex flex-col sm:flex-row gap-5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="filter"
                                    value="all"
                                    checked={formData.filter === "all"}
                                    onChange={handleChange}
                                    className="text-blue-600"
                                />
                                <span className="font-medium">
                                    All Members
                                </span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="filter"
                                    value="mobile_number"
                                    checked={
                                        formData.filter === "mobile_number"
                                    }
                                    onChange={handleChange}
                                    className="text-blue-600"
                                />
                                <span className="font-medium">
                                    Mobile Number
                                </span>
                            </label>
                        </div>
                    </div>

                    {formData.filter === "mobile_number" && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Mobile Number
                            </label>

                            <input
                                type="text"
                                name="mobile_number"
                                placeholder="Enter Mobile Number"
                                value={formData.mobile_number}
                                onChange={handleChange}
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-3
                                    shadow-sm
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                    focus:border-blue-500
                                    transition-all
                                "
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="
                            w-full
                            bg-gradient-to-r
                            from-blue-600
                            to-indigo-600
                            text-white
                            py-3
                            rounded-2xl
                            font-semibold
                            shadow-lg
                            hover:shadow-xl
                            hover:scale-[1.01]
                            transition-all
                            duration-200
                        "
                    >
                        Search Members
                    </button>
                </form>
            </div>

            {/* Members Table */}
            {members.length > 0 && (
                <div className="mt-10 bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 overflow-x-auto">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">
                        Members
                    </h3>

                    <table className="min-w-full overflow-hidden rounded-2xl">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                                <th className="px-4 py-4 text-left font-semibold">
                                    Member ID
                                </th>
                                <th className="px-4 py-4 text-left font-semibold">
                                    First Name
                                </th>
                                <th className="px-4 py-4 text-left font-semibold">
                                    Last Name
                                </th>
                                <th className="px-4 py-4 text-left font-semibold">
                                    Mobile Number
                                </th>
                                <th className="px-4 py-4 text-left font-semibold">
                                    Status
                                </th>
                                <th className="px-4 py-4 text-left font-semibold">
                                    Branch ID
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {members.map((member) => (
                                <tr
                                    key={member.member_id}
                                    onClick={() => setSelectedMember(member)}
                                    className={`
                                        cursor-pointer
                                        border-b
                                        border-slate-100
                                        hover:bg-blue-50
                                        hover:shadow-sm
                                        transition-all
                                        duration-200
                                        ${
                                            selectedMember?.member_id ===
                                            member.member_id
                                                ? "bg-blue-100"
                                                : ""
                                        }
                                    `}
                                >
                                    <td className="px-4 py-4">
                                        {member.member_id}
                                    </td>

                                    <td className="px-4 py-4">
                                        {member.first_name}
                                    </td>

                                    <td className="px-4 py-4">
                                        {member.last_name}
                                    </td>

                                    <td className="px-4 py-4">
                                        {member.mobile_number}
                                    </td>

                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                                member.is_active
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {member.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4">
                                        {member.branch_id}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Selected Member */}
            {selectedMember && (
                <div className="mt-10 bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
                    <h4 className="text-2xl font-bold text-slate-800 mb-6">
                        👤 Selected Member
                    </h4>

                    <div className="grid md:grid-cols-2 gap-5 text-slate-700">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <strong>ID:</strong>{" "}
                            {selectedMember.member_id}
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4">
                            <strong>Branch ID:</strong>{" "}
                            {selectedMember.branch_id}
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4">
                            <strong>First Name:</strong>{" "}
                            {selectedMember.first_name}
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4">
                            <strong>Last Name:</strong>{" "}
                            {selectedMember.last_name}
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4">
                            <strong>Mobile Number:</strong>{" "}
                            {selectedMember.mobile_number}
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4">
                            <strong>Status:</strong>
                            <span
                                className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                    selectedMember.is_active
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {selectedMember.is_active
                                    ? "Active"
                                    : "Inactive"}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handleUpdateMember}
                            className="
                                px-8
                                py-3
                                bg-gradient-to-r
                                from-green-600
                                to-emerald-600
                                text-white
                                font-semibold
                                rounded-2xl
                                shadow-lg
                                hover:shadow-xl
                                hover:scale-[1.02]
                                transition-all
                                duration-200
                            "
                        >
                            Update Member
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
