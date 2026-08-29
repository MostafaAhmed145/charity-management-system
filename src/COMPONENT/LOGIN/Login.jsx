import { replace, useFormik } from 'formik'
import app from '../../firebase'
import { getAuth, signInWithEmailAndPassword , GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { FcGoogle } from 'react-icons/fc'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../CONTEXT/Context'
import { cache } from 'react'


export default function Login() {

  const { user , role } = useContext(AuthContext)

  const auth = getAuth(app)

  const provider = new GoogleAuthProvider()

  const navigate = useNavigate()

  const myFormik = useFormik({

    initialValues: {
      email: "",
      password: ""
    },

    onSubmit: async (values) => {

      try{
           await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      )

      toast.success("تم تسجيل الدخول بنجاح")


      }catch(err){
         toast.error("err")
      }

      

    },

    validate: (values) => {

      const errors = {}

      const regxEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const regxPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/

      if (!regxEmail.test(values.email)) {
        errors.email = "The Email Is Not Valid"
      }

      if (!regxPassword.test(values.password)) {
        errors.password = "Password must be at least 6 characters and contain letters and numbers"
      }

      return errors
    }


     

  })




  const loginGoogle = async ()=>{

    try{

      await signInWithPopup( auth , provider )

      toast.success("تم التسجيل بنجاح")

       setTimeout(() => {
      navigate("/UserHome");
    }, 2500);

    }  catch(err){
      toast.error(err.message)
    }
     }


     
    if (user && role === "admin") {
        return <Navigate to="/dashBoard" replace />;
      }

      if (user && role === "user") {
        return <Navigate to="/UserHome" replace />;
      }
     

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 italic">
            Login
          </h1>

          <form onSubmit={myFormik.handleSubmit} className="space-y-4">

            <input
              onBlur={myFormik.handleBlur}
              onChange={myFormik.handleChange}
              value={myFormik.values.email}
              name="email"
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
            {myFormik.touched.email && myFormik.errors.email ? (
              <div className='bg-red-400 p-1 text-white rounded alert alert-danger'>
                {myFormik.errors.email}
              </div>
            ) : ""}

            <input
              onBlur={myFormik.handleBlur}
              onChange={myFormik.handleChange}
              value={myFormik.values.password}
              name="password"
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
            {myFormik.touched.password && myFormik.errors.password ? (
              <div className='bg-red-400 p-1 text-white rounded alert alert-danger'>
                {myFormik.errors.password}
              </div>
            ) : ""}

            <Link to={"/ForgotPassword"}>
              <span className='text-red-500 capitalize'>
                forgit password
              </span>
            </Link>

            <button
              type="submit"
              className="w-full mt-2 bg-blue-600 text-white py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>

            <button
            onClick={loginGoogle}
              type="button"
              className="w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition duration-300 cursor-pointer"
            >
              <FcGoogle size={22} />
              <span className="font-medium text-gray-700">
                التسجيل باستخدام Google
              </span>
            </button>

          </form>
        </div>
      </div>
    </>
  )
}