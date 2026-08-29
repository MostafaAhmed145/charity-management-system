import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
    >
      <div className="text-center">
        <h1 className="text-8xl font-bold text-[#0f2c4d]">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          الصفحة غير موجودة
        </h2>

        <p className="mt-2 text-gray-500">
          يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 bg-[#0f2c4d] text-white px-6 py-3 rounded-lg hover:bg-[#163d68] transition"
        >
          <Home size={20} />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}