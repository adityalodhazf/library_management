"use client";

import React, { useState } from "react";
import { convertTimestampToDate } from "@/helpers/helper";

export default function TransactionsPage() {
    const [formData, setFormData] = useState({
        transaction_id: "",
        member_id: "",
        filter: "all",
    });

    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        const params = new URLSearchParams();
        if (formData.filter) {
            params.append("filter", formData.filter);
        }
        if (formData.member_id) {
            params.append("member_id", formData.member_id);
        }

        const url = `/api/transactions?${params.toString()}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        setTransactions(data.transactions || []);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!selectedTransaction) return;

        const res = await fetch("/api/transactions", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                selectedTransaction,
            }),
        });

        const data = await res.json();
        console.log("transactions page.js update transaction data =", data);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
            {/* Search Panel */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    📚 Transactions
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Radio Buttons */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Search Type
                        </label>

                        <div className="flex gap-8 bg-gray-50 p-4 rounded-xl">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="filter"
                                    value="all"
                                    checked={formData.filter === "all"}
                                    onChange={handleChange}
                                    className="text-blue-600"
                                />
                                <span>All Transactions</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="filter"
                                    value="member"
                                    checked={formData.filter === "member"}
                                    onChange={handleChange}
                                    className="text-blue-600"
                                />
                                <span>Member ID</span>
                            </label>
                        </div>
                    </div>

                    {/* Member ID Filter */}
                    {formData.filter === "member" && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Member ID
                            </label>

                            <input
                                type="text"
                                name="member_id"
                                placeholder="Enter Member ID"
                                value={formData.member_id}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                    >
                        Search Transactions
                    </button>
                </form>
            </div>

            {/* Transactions Table */}
            {transactions.length > 0 && (
                <div className="mt-10 bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        Transaction Results
                    </h3>

                    <table className="min-w-full border-collapse overflow-hidden rounded-xl">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="px-4 py-3 text-left font-semibold">
                                    Transaction ID
                                </th>
                                <th className="px-4 py-3 text-left font-semibold">
                                    Book ID
                                </th>
                                <th className="px-4 py-3 text-left font-semibold">
                                    Member ID
                                </th>
                                <th className="px-4 py-3 text-left font-semibold">
                                    Issued Branch
                                </th>
                                <th className="px-4 py-3 text-left font-semibold">
                                    Issue Date
                                </th>
                                <th className="px-4 py-3 text-left font-semibold">
                                    Return Date
                                </th>
                                <th className="px-4 py-3 text-left font-semibold">
                                    Fine
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.map((transaction) => (
                                <tr
                                    key={transaction.transaction_id}
                                    onClick={() =>
                                        setSelectedTransaction(transaction)
                                    }
                                    className={`cursor-pointer border-b hover:bg-blue-50 transition-colors duration-150 ${
                                        selectedTransaction?.transaction_id ===
                                        transaction.transaction_id
                                            ? "bg-blue-100"
                                            : ""
                                    }`}
                                >
                                    <td className="px-4 py-3">
                                        {transaction.transaction_id}
                                    </td>

                                    <td className="px-4 py-3">
                                        {transaction.book_id}
                                    </td>

                                    <td className="px-4 py-3">
                                        {transaction.member_id}
                                    </td>

                                    <td className="px-4 py-3">
                                        {transaction.issued_branch_id}
                                    </td>

                                    <td className="px-4 py-3">
                                        {convertTimestampToDate(
                                            transaction.issue_date
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        {convertTimestampToDate(
                                            transaction.return_date
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        ₹{transaction.fine || 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Selected Transaction */}
            {selectedTransaction && (
                <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-5">
                        Selected Transaction
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                        <p>
                            <strong>Transaction ID:</strong>{" "}
                            {selectedTransaction.transaction_id}
                        </p>

                        <p>
                            <strong>Book ID:</strong>{" "}
                            {selectedTransaction.book_id}
                        </p>

                        <p>
                            <strong>Member ID:</strong>{" "}
                            {selectedTransaction.member_id}
                        </p>

                        <p>
                            <strong>Issued Branch ID:</strong>{" "}
                            {selectedTransaction.issued_branch_id}
                        </p>

                        <p>
                            <strong>Issue Date:</strong>{" "}
                            {convertTimestampToDate(
                                selectedTransaction.issue_date
                            )}
                        </p>

                        <p>
                            <strong>Return Date:</strong>{" "}
                            {convertTimestampToDate(
                                selectedTransaction.return_date
                            )}
                        </p>

                        <p>
                            <strong>Fine:</strong> ₹
                            {selectedTransaction.fine || 0}
                        </p>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleUpdate}
                            disabled={
                                !!selectedTransaction.return_date?.seconds
                            }
                            className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                                selectedTransaction.return_date?.seconds
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
                            }`}
                        >
                            Return Book
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
