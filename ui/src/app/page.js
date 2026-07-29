"use client";

import BannerSection from "./components/home-components/BannerSection";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <BannerSection />

      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
          Library Management System
        </h1>

        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => router.push("/books")}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200"
          >
            📚 Books
          </button>

          <button
            onClick={() => router.push("/members")}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 hover:scale-105 transition-all duration-200"
          >
            👥 Members
          </button>

          <button
            onClick={() => router.push("/transactions")}
            className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-700 hover:scale-105 transition-all duration-200"
          >
            🔄 Transactions
          </button>
        </div>
      </div>
    </>
  );
}