import { useFormik } from 'formik'
import React from 'react'
import app, { db } from '../../firebase'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { ensureUserProfile } from '../../lib/ensureUserProfile'
import { getAuthErrorMessage } from '../../lib/authErrors'
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_HINT, PASSWORD_REGEX, PHONE_REGEX } from '../../lib/validation'

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

            try {
            const phoneQuery = query(
              collection(db , "users"),
              where("phone" , "==", values.phone)
            )

            const phoneSnapshot = await getDocs(phoneQuery);

            if (!phoneSnapshot.empty) {
              toast.error("رقم الهاتف مستخدم بالفعل");
              return;
            }
            } catch {
              // Unauthenticated clients cannot query users after rules are published.
            }
              const userCredential = await createUserWithEmailAndPassword(
                 auth ,
                values.email ,
                values.password
            )


            await ensureUserProfile(userCredential.user, {
                name: values.name,
                phone: values.phone,
                email: values.email,
            })

            toast.success("تم التسجيل بنجاح " , 3000)

             

            setTimeout(()=>{
                navigate("/login")
            } , 2500)

           }catch(err){
              toast.error(getAuthErrorMessage(err))
              
           }



    } , 


   validate: (values) => {

      const errors = {}

      if (!NAME_REGEX.test(values.name)) {
        errors.name = "The Name Is Not Valid"
      }

      if (!EMAIL_REGEX.test(values.email)) {
        errors.email = "The Email Is Not Valid"
      }

      if (!PHONE_REGEX.test(values.phone)) {
        errors.phone = "The Phone Is Not Valid"
      }

      if (!PASSWORD_REGEX.test(values.password)) {
        errors.password = PASSWORD_HINT
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
                <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input id="name" onBlur={myFormik.handleBlur} onChange={myFormik.handleChange} value={myFormik.values.name} className=' w-full  p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400' type="text" placeholder='Name' name='name'/>
                {myFormik.touched.name && myFormik.errors.name ? <div className='bg-red-400 p-1 text-white rounded alert alert-danger '>{myFormik.errors.name}</div> : ""}
                </div>
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    id="email"
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
                </div>

                  <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    id="phone"
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
                  </div>

                  <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    id="password"
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
                  </div>

                  <div>
                  <label htmlFor="rePassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    id="rePassword"
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
                  </div>
                <button type='submit' className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer font-medium capitalize">register</button>
           </form>
    </div>
  </div>
  </> 
  
}
