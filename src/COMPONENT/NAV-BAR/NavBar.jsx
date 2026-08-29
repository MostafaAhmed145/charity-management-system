import { getAuth, signOut } from "firebase/auth";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import app from "../../firebase";
import { toast } from "react-toastify";
import { AuthContext } from "../CONTEXT/Context";
import { LogOut } from "lucide-react";

export default function NavBar() {

  const { user , userData, setUserData , role} = useContext(AuthContext)
  const [open, setOpen] = useState(false);

  const auth = getAuth(app)
  const navigate = useNavigate()

    async function Logout() {
      try{
        await signOut( auth )
        toast.success("تم تسجيل الخروج بنجاح");
        navigate("/login" , { replace: true })

      }catch(err){
        toast.error("حدث خطا ما")
      }
    }

  return (
    <nav className="bg-gray-800 shadow-md fixed top-0 left-0 right-0">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-white text-2xl md:text-3xl font-extrabold tracking-wide"
          >
             جمعية الهدايه
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">

            {/* {user ?  : ""} */}
            

            {user ? <>
            

            {role === "admin" ||  role === "superAdmin" ? <Link
              to="/dashBoard"
              className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
            >
               لوحة التحكم
            </Link> : ""}

            <Link
              to="/userHome"
              className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
            >
              واجهة المستخدم 
            </Link> 

              
            <button onClick={Logout} className=" capitalize rounded p-1 text-white bg-red-600  hover:bg-red-500 transition-all duration-300 cursor-pointer font-bold"><LogOut /></button>
            
            </> : <>
            
             <Link
              to="/register"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              Register
            </Link>

            <Link
              to="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              Login
            </Link>
            
            </>}

           

          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 justify-center overflow-hidden">

            {user?.photoURL ? <>
            
            
              <img
                onClick={() => navigate("/profile")}
                src={user.photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-gray-500 cursor-pointer"
              />

            </>  : (
              <div
                onClick={() => navigate("/profile")}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold cursor-pointer"
              >
                {userData?.name?.charAt(0).toUpperCase() || "a" }
              </div>
            )}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-gray-300 hover:text-white"
            >
              {open ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {/* Mobile Menu */}
{open && (
  <div className="md:hidden pb-4 space-y-2">

    {user ? (
      <>
        {role === "admin" && (
          <Link
            to="/dashBoard"
            className="block rounded-md px-3 py-2 text-white hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
            لوحة التحكم
          </Link>
        )}

        <Link
          to="/userHome"
          className="block rounded-md px-3 py-2 text-white hover:bg-gray-700"
          onClick={() => setOpen(false)}
        >
          واجهة المستخدم
        </Link>

        <Link
          to="/profile"
          className="block rounded-md px-3 py-2 text-white hover:bg-gray-700"
          onClick={() => setOpen(false)}
        >
          الملف الشخصي
        </Link>

        <button
          onClick={() => {
            setOpen(false);
            Logout();
          }}
          className="w-full text-right rounded-md px-3 py-2 text-white bg-red-600 hover:bg-red-500"
        >
          تسجيل الخروج
        </button>
      </>
    ) : (
      <>
        <Link
          to="/register"
          className="block rounded-md px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          onClick={() => setOpen(false)}
        >
          إنشاء حساب
        </Link>

        <Link
          to="/login"
          className="block rounded-md px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          onClick={() => setOpen(false)}
        >
          تسجيل الدخول
        </Link>
      </>
    )}

  </div>
)}
      </div>
    </nav>
  );
}