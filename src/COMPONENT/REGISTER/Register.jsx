import { useFormik } from 'formik'
import React from 'react'
import app, { db } from '../../firebase'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from "firebase/firestore";

export default function Register() {

  const auth = getAuth(app)


  const navigate = useNavigate()
  

  const myFormik = useFormik({
    initialValues : {
      name : "" , 
      email : "" ,
      phone : "" ,
      password : "" ,
      rePassword : "" 
    } ,

    

    onSubmit : async (values)=>{

           try{

            const phoneQuery = query(
              collection(db , "users"),
              where("phone" , "==", values.phone)
            )

            const phoneSnapshot = await getDocs(phoneQuery);

            if (!phoneSnapshot.empty) {
              toast.error("رقم الهاتف مستخدم بالفعل");
              return;
            }
              const userCredential = await createUserWithEmailAndPassword(
                 auth ,
                values.email ,
                values.password
            )


            await setDoc(doc( db , "users" , userCredential.user.uid) , {
                uid: userCredential.user.uid,
                name: values.name,
                phone: values.phone,
                email: values.email,
                role : "user" ,
                createdAt: new Date(),
            })

            toast.success("تم التسجيل بنجاح " , 3000)

             

            setTimeout(()=>{
                navigate("/login")
            } , 2500)

           }catch(err){
              toast.error("error ")
              
           }




    } , 


   validate: (values) => {

      const errors = {}

      const regxName = /^[a-zA-Z\u0600-\u06FF\s]{3,50}$/
      const regxEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const regxPhone = /^01[0125][0-9]{8}$/
      const regxPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/

      if (!regxName.test(values.name)) {
        errors.name = "The Name Is Not Valid"
      }

      if (!regxEmail.test(values.email)) {
        errors.email = "The Email Is Not Valid"
      }

      if (!regxPhone.test(values.phone)) {
        errors.phone = "The Phone Is Not Valid"
      }

      if (!regxPassword.test(values.password)) {
        errors.password = "Password must be at least 6 characters and contain letters and numbers"
      }

      if (values.rePassword !== values.password) {
        errors.rePassword = "Passwords Do Not Match"
      }

      return errors

    }


  })
  return <>
  

  <div className="min-h-screen flex justify-center bg-gray-100 p-5 items-center">
    <div className=' p-2 rounded-lg  shadow-lg bg-white  w-full max-w-md m-auto ' >
            <h1 className=' text-center text-3xl italic font-bold p-3 text-gray-800 mb-6 '>Register</h1>
           <form onSubmit={myFormik.handleSubmit} className="space-y-4 p-3 m-auto">
                <input onBlur={myFormik.handleBlur} onChange={myFormik.handleChange} value={myFormik.values.name} className=' w-full  p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400' type="text" placeholder='Name' name='name'/>
                {myFormik.touched.name && myFormik.errors.name ? <div className='bg-red-400 p-1 text-white rounded alert alert-danger '>{myFormik.errors.name}</div> : ""}
                <input
                    onBlur={myFormik.handleBlur}
                    onChange={myFormik.handleChange}
                    value={myFormik.values.email}
                    className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400'
                    type="email"
                    placeholder='Email'
                    name='email'
                  />
                  {myFormik.touched.email && myFormik.errors.email ? (
                    <div className='bg-red-400 p-1 text-white rounded alert alert-danger'>
                      {myFormik.errors.email}
                    </div>
                  ) : ""}

                  <input
                    onBlur={myFormik.handleBlur}
                    onChange={myFormik.handleChange}
                    value={myFormik.values.phone}
                    className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400'
                    type="tel"
                    placeholder='Phone'
                    name='phone'
                  />
                  {myFormik.touched.phone && myFormik.errors.phone ? (
                    <div className='bg-red-400 p-1 text-white rounded alert alert-danger'>
                      {myFormik.errors.phone}
                    </div>
                  ) : ""}

                  <input
                    onBlur={myFormik.handleBlur}
                    onChange={myFormik.handleChange}
                    value={myFormik.values.password}
                    className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400'
                    type="password"
                    placeholder='Password'
                    name='password'
                  />
                  {myFormik.touched.password && myFormik.errors.password ? (
                    <div className='bg-red-400 p-1 text-white rounded alert alert-danger'>
                      {myFormik.errors.password}
                    </div>
                  ) : ""}

                  <input
                    onBlur={myFormik.handleBlur}
                    onChange={myFormik.handleChange}
                    value={myFormik.values.rePassword}
                    className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400'
                    type="password"
                    placeholder='Confirm Password'
                    name='rePassword'
                  />
                  {myFormik.touched.rePassword && myFormik.errors.rePassword ? (
                    <div className='bg-red-400 p-1 text-white rounded alert alert-danger'>
                      {myFormik.errors.rePassword}
                    </div>
                  ) : ""}
                <button type='submit' className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer font-medium capitalize">register</button>
           </form>
    </div>
  </div>
  </> 
  
}
