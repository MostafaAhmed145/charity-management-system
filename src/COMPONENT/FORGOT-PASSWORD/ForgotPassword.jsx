

import { sendPasswordResetEmail } from 'firebase/auth'
import { useFormik } from 'formik'
import React from 'react'

import { auth } from "../../firebase";
import { toast } from 'react-toastify';

export default function ForgotPassword() {


     const myFormik = useFormik({
           initialValues : {
               email : ""
           } ,

           onSubmit : async (valuse)=>{
                 
               try{
                    await sendPasswordResetEmail(auth , valuse.email )
                    toast.success("Password reset email sent successfully")
                    }catch(err){
                         toast.error(err.message)
                    }
               } ,

               validate: (values) => {
                    const errors = {};

                    const regxEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                    if (!regxEmail.test(values.email)) {
                    errors.email = "Please enter a valid email";
                    }

                    return errors;
                    },
           


     })

   

  return <>
  
       <div className=' min-h-screen bg-gray-100 flex justify-center items-center '>
            <div className='w-full max-w-md bg-white rounded-xl p-6 shadow-lg'>
                <h1 className='text-3xl font-bold text-center text-gray-800 mb-6 italic'>Reset Password</h1>
                   <p className="text-center text-gray-500 mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <form  onSubmit={myFormik.handleSubmit} className=' space-y-4'>
                        <input onBlur={myFormik.handleBlur} onChange={myFormik.handleChange} value={myFormik.values.email} type="email" placeholder='Enter your email'  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400" name='email'/>
                        <button type='submit' className='bg-blue-600 p-3 rounded-lg text-white w-full cursor-pointer'>Send Reset Link</button>
                    </form>
            </div>
       </div>
  
  
  </>
}
