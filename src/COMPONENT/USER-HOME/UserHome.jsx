import { FilePlus, HandHeart, MessageCircle, SearchCheck } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function UserHome() {
  const options = [
    {
      title: "تقديم طلب",
      description: "قم بتقديم طلب مساعدة جديد",
      icon: FilePlus,
      path: "/submitCase",
    },
    {
      title: "متابعة طلبك",
      description: "تابع حالة طلب المساعدة الخاص بك",
      icon: SearchCheck,
      path: "/myCases",
    },

      {
      title: "تواصل معنا",
      description: "تواصل معنا عبر WhatsApp",
      icon: MessageCircle,
      path: "https://wa.me/201121122552",
    },
  ];

  return (

    
    <section
      dir="rtl"
      className=" flex items-center justify-center px-4 py-10 mt-12"
    >
      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const Icon = option.icon;

          const isExternal = option.path.startsWith("http");

          return isExternal ? (
            <a
              key={option.title}
              href={option.path}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl bg-white p-8 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                <Icon size={30} strokeWidth={1.8} />
              </div>

              <h2 className="mb-3 text-xl font-bold text-gray-800">
                {option.title}
              </h2>

              <p className="text-sm leading-6 text-gray-500">
                {option.description}
              </p>
            </a>
          ) : (
            <Link
              key={option.title}
              to={option.path}
              className="group rounded-2xl bg-white p-8 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                <Icon size={30} strokeWidth={1.8} />
              </div>

              <h2 className="mb-3 text-xl font-bold text-gray-800">
                {option.title}
              </h2>

              <p className="text-sm leading-6 text-gray-500">
                {option.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}