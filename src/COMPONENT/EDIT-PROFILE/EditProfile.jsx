import React, { useContext, useEffect } from "react";
import { useFormik } from "formik";
import { updateProfile } from "firebase/auth";
import { AuthContext } from "../CONTEXT/Context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Loading from "../LOADING/Loading";

export default function EditProfile() {

  const { user , loading , setPhoneNumper} =  useContext(AuthContext)
  const navigate = useNavigate()



  const formik = useFormik({

  initialValues: {
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
  },

  onSubmit: async (values) => {
    console.log("Submit Works");
    try {
      console.log("Submit Works");
      console.log(user);
      await updateProfile(user, {
        displayName: values.name,
      });

      console.log("updateProfile Done");
        
      console.log(values);
      await setDoc(doc(db , "users" , user.uid) ,{
          name: values.name,
          email: user.email,
          phone: values.phone,
      } , {
        merge : true
      })


      toast.success("Profile Updated Successfully");

      navigate("/profile");
    } catch (error) {
        
        toast.error(error.message);
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

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}

            className="w-full p-3 rounded-lg border border-gray-300 outline-none focus:border-blue-500"
          />

          <input
            type="email"
            name="email"
            value={formik.values.email}
            disabled
            className="w-full p-3 rounded-lg bg-gray-100 cursor-not-allowed"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 rounded-lg border border-gray-300 outline-none focus:border-blue-500"
          />

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
