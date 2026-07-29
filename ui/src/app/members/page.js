// "use client";

// import { useRouter } from "next/navigation";

// export default function MembersPage() {
//     const router = useRouter();

//     const handleAddMember = async (e) => {
//         e.preventDefault();
//         router.push(`/members/add`);
//     };

    
//     const handleSearchMember = async (e) => {
//         e.preventDefault();
//         router.push(`/members/search`);
//     }

//     return (
//         <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//             <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6">
//                 <h2 className="text-2xl font-bold mb-6 text-gray-800">
//                     Members
//                 </h2>

//                 <div className="mt-4 flex gap-3">
//                     <button
//                         onClick={handleAddMember}
//                         className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                     >
//                         Add
//                     </button>

//                     <button
//                         onClick={handleSearchMember}
//                         className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                     >
//                         Search
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import { useRouter } from "next/navigation";

export default function MembersPage() {
    const router = useRouter();

    const handleAddMember = (e) => {
        e.preventDefault();
        router.push("/members/add");
    };

    const handleSearchMember = (e) => {
        e.preventDefault();
        router.push("/members/search");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    👥 Members
                </h2>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleAddMember}
                        className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                    >
                        ➕ Add Member
                    </button>

                    <button
                        onClick={handleSearchMember}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                    >
                        🔍 Search Members
                    </button>
                </div>
            </div>
        </div>
    );
}
