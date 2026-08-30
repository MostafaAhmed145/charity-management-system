import React, { useContext, useEffect } from "react";
import { useFormik } from "formik";
import { updateProfile } from "firebase/auth";
import { AuthContext } from "../CONTEXT/Context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Loading from "../LOADING/Loading";

const PHONE_REGEX = /^01[0125][0-9]{8}$/;
const NAME_REGEX = /^[a-zA-Z\u0600-\u06FF\s]{3,50}$/;

export default function EditProfile() {

  const { user , loading , userData, setUserData} =  useContext(AuthContext)
  const navigate = useNavigate()



  const formik = useFormik({

  initialValues: {
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
  },

  validate: (values) => {
    const errors = {};

    if (!NAME_REGEX.test(values.name?.trim() || "")) {
      errors.name = "برجاء إدخال اسم صحيح";
    }

    if (!PHONE_REGEX.test(values.phone || "")) {
      errors.phone = "رقم الهاتف غير صحيح";
    }

    return errors;
  },

  onSubmit: async (values) => {
    try {
      await updateProfile(user, {
        displayName: values.name,
      });

      await setDoc(doc(db , "users" , user.uid) ,{
          name: values.name,
          email: user.email,
          phone: values.phone,
      } , {
        merge : true
      })

      if (typeof setUserData === "function") {
        setUserData({
          ...(userData || {}),
          name: values.name,
          phone: values.phone,
        });
      }

      toast.success("Profile Updated Successfully");

      navigate("/Profile");
    } catch {
        toast.error("تعذر حفظ التعديلات. حاول مرة أخرى.");
    }
  },
});


useEffect(() => {
  const getUserData = async () => {
    if (!user) return;

    const docSnap = await getDoc(doc(db, "users", user.uid));

    if (docSnap.exists()) {
      formik.setValues({
        name: docSnap.data().name,
        email: docSnap.data().email,
        phone: docSnap.data().phone,
      });
    }
  };

  getUserData();
}, [user]);



if (loading) {
  return <Loading/>
}

 
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6 italic">
          Edit Profile
        </h2>

        <form onSubmit={formik.handleSubmit}  className="space-y-5">

          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              الاسم
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Full Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}

              className="w-full p-3 rounded-lg border border-gray-300 outline-none focus:border-blue-500"
            />
            {formik.touched.name && formik.errors.name ? (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            ) : null}
          </div>

          <input
            type="email"
            name="email"
            value={formik.values.email}
            disabled
            className="w-full p-3 rounded-lg bg-gray-100 cursor-not-allowed"
          />

          <div>
            <label htmlFor="phone" className="block mb-1 font-medium">
              رقم الهاتف
            </label>
            <input
              id="phone"
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 rounded-lg border border-gray-300 outline-none focus:border-blue-500"
            />
            {formik.touched.phone && formik.errors.phone ? (
              <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Save Changes
          </button>

        </form>

      </div>
    </div>
  );
}
