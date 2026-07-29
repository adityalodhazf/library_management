// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function BooksPage() {
//     const [formData, setFormData] = useState({
//         title: "",
//         author_first_name: "",
//         author_last_name: "",
//         filter: "all",
//     });

//     const [books, setBooks] = useState([]);
//     const [selectedBook, setSelectedBook] = useState(null);

//     // const [response, setResponse] = useState(null);

//     const handleChange = async (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const params = new URLSearchParams();

//         if (formData.filter) {
//             params.append("filter", formData.filter);
//         }

//         if (formData.title) {
//             params.append("title", formData.title);
//         }

//         if (formData.author_first_name) {
//             params.append("author_first_name", formData.author_first_name);
//         }

//         if (formData.author_last_name) {
//             params.append("author_last_name", formData.author_last_name);
//         }

//         const url = `/api/books?${params.toString()}`;
//         const res = await fetch(url, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });

//         const data = await res.json();
//         // console.log("search books data = ", data)
//         setBooks(data.books || []);
//     };

//     const router = useRouter();

//     const handleUpdate = () => {
//         if (!selectedBook) return;
//         router.push(`/books/${selectedBook.book_id}`);
//     };

//     const [showBorrowModal, setShowBorrowModal] = useState(false);
//     const [memberId, setMemberId] = useState("");

//     const handleBorrow = (e) => {
//         if (!selectedBook) return;

//         setMemberId("");
//         setShowBorrowModal(true);
//     };

//     const handleBorrowSubmit = async (e) => {
//         if (!selectedBook) return;
//         const transactionData = {
//             book_id: Number(selectedBook.book_id),
//             member_id: Number(memberId),
//             issued_branch_id: 1
//         }
//         console.log(transactionData);

//         setShowBorrowModal(false);

//         // call the api to insert transaction
//         const res = await fetch("/api/transactions", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 transactionData
//             }),
//         });
//         // const data = await res.json()
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//             <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6">
//                 <h2 className="text-2xl font-bold mb-6 text-gray-800">
//                     Search Book
//                 </h2>

//                 <form onSubmit={handleSubmit} className="space-y-6">

//                     {/* Radio Buttons */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-3">
//                             Filters
//                         </label>

//                         <div className="flex flex-wrap gap-6">
//                             <label className="flex items-center gap-2 cursor-pointer">
//                                 <input
//                                     type="radio"
//                                     name="filter"
//                                     value="all"
//                                     checked={formData.filter === "all"}
//                                     onChange={handleChange}
//                                     className="text-blue-600"
//                                 />
//                                 <span>All</span>
//                             </label>

//                             <label className="flex items-center gap-2 cursor-pointer">
//                                 <input
//                                     type="radio"
//                                     name="filter"
//                                     value="title"
//                                     checked={formData.filter === "title"}
//                                     onChange={handleChange}
//                                     className="text-blue-600"
//                                 />
//                                 <span>Book Title</span>
//                             </label>

//                             <label className="flex items-center gap-2 cursor-pointer">
//                                 <input
//                                     type="radio"
//                                     name="filter"
//                                     value="author"
//                                     checked={formData.filter === "author"}
//                                     onChange={handleChange}
//                                     className="text-blue-600"
//                                 />
//                                 <span>Author Name</span>
//                             </label>
//                         </div>
//                     </div>

//                     {/* Title Input */}
//                     {formData.filter === "title" && (
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Book Title
//                             </label>

//                             <input
//                                 type="text"
//                                 name="title"
//                                 placeholder="Enter book title"
//                                 value={formData.title}
//                                 onChange={handleChange}
//                                 className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                     )}

//                     {/* Author Inputs */}
//                     {formData.filter === "author" && (
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Author Name
//                             </label>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                 <input
//                                     type="text"
//                                     name="author_first_name"
//                                     placeholder="First Name"
//                                     value={formData.author_first_name}
//                                     onChange={handleChange}
//                                     className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />

//                                 <input
//                                     type="text"
//                                     name="author_last_name"
//                                     placeholder="Last Name"
//                                     value={formData.author_last_name}
//                                     onChange={handleChange}
//                                     className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
//                     >
//                         Submit
//                     </button>
//                 </form>
//             </div>
//             {books.length > 0 && (
//                 <div className="mt-8">
//                     <h3 className="text-xl font-semibold mb-4">Books</h3>

//                     <table className="w-full border border-gray-300">
//                         <thead>
//                             <tr className="bg-gray-100">
//                                 <th className="border p-2 text-left">Book ID</th>
//                                 <th className="border p-2 text-left">Title</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {books.map((book) => (
//                                 <tr
//                                     key={book.book_id}
//                                     onClick={() => setSelectedBook(book)}
//                                     className={`cursor-pointer hover:bg-blue-100 ${selectedBook?.book_id === book.book_id
//                                         ? "bg-blue-200"
//                                         : ""
//                                         }`}
//                                 >
//                                     <td className="border p-2">
//                                         {book.book_id}
//                                     </td>

//                                     <td className="border p-2">
//                                         {book.title}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             {selectedBook && (
//                 <div className="mt-4 p-4 border rounded bg-gray-50">
//                     <h4 className="font-semibold">Selected Book</h4>

//                     <p>
//                         <strong>ID:</strong> {selectedBook.book_id}
//                     </p>

//                     <p>
//                         <strong>Title:</strong> {selectedBook.title}
//                     </p>

//                     <div className="mt-4 flex gap-3">
//                         <button
//                             onClick={handleBorrow}
//                             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                         >
//                             Borrow
//                         </button>

//                         <button
//                             onClick={handleUpdate}
//                             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                         >
//                             Update
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {showBorrowModal && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//                     <div className="bg-white rounded-lg shadow-lg p-6 w-96">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-lg font-semibold">
//                                 Borrow Book
//                             </h3>

//                             <button
//                                 onClick={() => setShowBorrowModal(false)}
//                                 className="text-gray-500 hover:text-gray-700 text-xl"
//                             >
//                                 ×
//                             </button>
//                         </div>

//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">
//                                     Book ID
//                                 </label>

//                                 <input
//                                     type="text"
//                                     value={selectedBook?.book_id}
//                                     disabled
//                                     className="w-full border rounded px-3 py-2 bg-gray-100"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium mb-1">
//                                     Member ID
//                                 </label>

//                                 <input
//                                     type="number"
//                                     value={memberId}
//                                     onChange={(e) =>
//                                         setMemberId(e.target.value)
//                                     }
//                                     placeholder="Enter Member ID"
//                                     className="w-full border rounded px-3 py-2"
//                                 />
//                             </div>

//                             <div className="flex justify-end gap-2">
//                                 <button
//                                     onClick={() => setShowBorrowModal(false)}
//                                     className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//                                 >
//                                     Close
//                                 </button>

//                                 <button
//                                     onClick={handleBorrowSubmit}
//                                     className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                                 >
//                                     OK
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function BooksPage() {
    const [formData, setFormData] = useState({
        title: "",
        author_first_name: "",
        author_last_name: "",
        filter: "all",
    });

    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);

    const [showBorrowModal, setShowBorrowModal] = useState(false);
    const [memberId, setMemberId] = useState("");

    const router = useRouter();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const params = new URLSearchParams();

        if (formData.filter) {
            params.append("filter", formData.filter);
        }

        if (formData.title) {
            params.append("title", formData.title);
        }

        if (formData.author_first_name) {
            params.append(
                "author_first_name",
                formData.author_first_name
            );
        }

        if (formData.author_last_name) {
            params.append(
                "author_last_name",
                formData.author_last_name
            );
        }

        const url = `/api/books?${params.toString()}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        setBooks(data.books || []);
    };

    const handleUpdate = () => {
        if (!selectedBook) return;
        router.push(`/books/${selectedBook.book_id}`);
    };

    const handleBorrow = () => {
        if (!selectedBook) return;

        setMemberId("");
        setShowBorrowModal(true);
    };

    const handleBorrowSubmit = async () => {
        if (!selectedBook) return;

        const transactionData = {
            book_id: Number(selectedBook.book_id),
            member_id: Number(memberId),
            issued_branch_id: 1,
        };

        setShowBorrowModal(false);

        await fetch("/api/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                transactionData,
            }),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-10 px-4 md:px-10">
            {/* Search Card */}
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
                <h2 className="text-4xl font-extrabold text-center text-slate-800 tracking-tight mb-8">
                    📚 Search Books
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
                                <span className="font-medium">All</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="filter"
                                    value="title"
                                    checked={formData.filter === "title"}
                                    onChange={handleChange}
                                    className="text-blue-600"
                                />
                                <span className="font-medium">
                                    Book Title
                                </span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="filter"
                                    value="author"
                                    checked={formData.filter === "author"}
                                    onChange={handleChange}
                                    className="text-blue-600"
                                />
                                <span className="font-medium">
                                    Author Name
                                </span>
                            </label>
                        </div>
                    </div>

                    {formData.filter === "title" && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Book Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                placeholder="Enter book title"
                                value={formData.title}
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

                    {formData.filter === "author" && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Author Details
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="author_first_name"
                                    placeholder="Author First Name"
                                    value={formData.author_first_name}
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
                                    "
                                />

                                <input
                                    type="text"
                                    name="author_last_name"
                                    placeholder="Author Last Name"
                                    value={formData.author_last_name}
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
                                    "
                                />
                            </div>
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
                        Search Books
                    </button>
                </form>
            </div>

            {/* Books Result */}
            {books.length > 0 && (
                <div className="mt-10 bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 overflow-x-auto">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">
                        📚 Books
                    </h3>

                    <table className="min-w-full overflow-hidden rounded-2xl">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                                <th className="px-4 py-4 text-left font-semibold">
                                    Book ID
                                </th>

                                <th className="px-4 py-4 text-left font-semibold">
                                    Title
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {books.map((book) => (
                                <tr
                                    key={book.book_id}
                                    onClick={() =>
                                        setSelectedBook(book)
                                    }
                                    className={`
                                        cursor-pointer
                                        border-b
                                        border-slate-100
                                        hover:bg-blue-50
                                        hover:shadow-sm
                                        transition-all
                                        duration-200
                                        ${
                                            selectedBook?.book_id ===
                                            book.book_id
                                                ? "bg-blue-100"
                                                : ""
                                        }
                                    `}
                                >
                                    <td className="px-4 py-4">
                                        {book.book_id}
                                    </td>

                                    <td className="px-4 py-4">
                                        {book.title}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Selected Book */}
            {selectedBook && (
                <div className="mt-10 bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
                    <h4 className="text-2xl font-bold text-slate-800 mb-6">
                        📖 Selected Book
                    </h4>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <strong>ID:</strong>{" "}
                            {selectedBook.book_id}
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4">
                            <strong>Title:</strong>{" "}
                            {selectedBook.title}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <button
                            onClick={handleBorrow}
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
                            Borrow Book
                        </button>

                        <button
                            onClick={handleUpdate}
                            className="
                                px-8
                                py-3
                                bg-gradient-to-r
                                from-blue-600
                                to-indigo-600
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
                            Update Book
                        </button>
                    </div>
                </div>
            )}

            {/* Borrow Modal */}
            {showBorrowModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">
                                Borrow Book
                            </h3>

                            <button
                                onClick={() =>
                                    setShowBorrowModal(false)
                                }
                                className="text-slate-500 hover:text-slate-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Book ID
                                </label>

                                <input
                                    type="text"
                                    value={selectedBook?.book_id}
                                    disabled
                                    className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-slate-300
                                        px-4
                                        py-3
                                        bg-slate-100
                                    "
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Member ID
                                </label>

                                <input
                                    type="number"
                                    value={memberId}
                                    onChange={(e) =>
                                        setMemberId(e.target.value)
                                    }
                                    placeholder="Enter Member ID"
                                    className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-slate-300
                                        px-4
                                        py-3
                                        shadow-sm
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                        focus:border-blue-500
                                    "
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() =>
                                        setShowBorrowModal(false)
                                    }
                                    className="
                                        px-5
                                        py-3
                                        bg-slate-500
                                        text-white
                                        rounded-2xl
                                        hover:bg-slate-600
                                    "
                                >
                                    Close
                                </button>

                                <button
                                    onClick={handleBorrowSubmit}
                                    className="
                                        px-5
                                        py-3
                                        bg-gradient-to-r
                                        from-green-600
                                        to-emerald-600
                                        text-white
                                        rounded-2xl
                                        shadow-md
                                        hover:shadow-lg
                                    "
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
