"use client";

import { useRouter } from "next/navigation";

export default function BooksPage() {
    const router = useRouter();

    const handleAdd = (e) => {
        e.preventDefault();
        router.push("/books/add");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.push("/books/search");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    📚 Books
                </h2>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleAdd}
                        className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                    >
                        ➕ Add Book
                    </button>

                    <button
                        onClick={handleSearch}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                    >
                        🔍 Search Books
                    </button>
                </div>
            </div>
        </div>
    );
}
