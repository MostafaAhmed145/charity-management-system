

import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../CONTEXT/Context'
import Loading from '../LOADING/Loading'
import { db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function Profile() {

  const { loading , user } = useContext(AuthContext)
  const [phone , setPhone] = useState(null)

  const navigate = useNavigate()

  useEffect(()=>{

    const getPhoneNumper = async ()=>{
      if (!user) return;
      console.log(user);
console.log(user.uid);
      const docSnap = await getDoc(doc(db, "users", user.uid));

    if (docSnap.exists()) {
       console.log(docSnap.data());
      setPhone(docSnap.data().phone);
      console.log("Phone:", docSnap.data().phone);
    }
    }

    getPhoneNumper()
  },[user])

  if (loading) {
    return <Loading/>
  }

  if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      User not found
    </div>
  );
}
  
  return <>
  



 <div className="bg-gray-100 min-h-screen flex justify-center items-center">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

    <div className="flex flex-col items-center">

      <div className="w-28 h-28 rounded-full border-2 overflow-hidden border-dashed border-gray-400 flex items-center justify-center text-4xl text-gray-400 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition">
        {user?.photoURL ? <>
        
                 <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
        </> : <span className="text-2xl font-bold">
            {user?.displayName?.charAt(0).toUpperCase() || "M"}
          </span> }
      </div>

      <h2 className="mt-4 text-2xl font-bold text-gray-800 capitalize italic">
        {user.displayName}
      </h2>

      <p className="text-gray-500">
        Charity Member
      </p>

    </div>

    <div className="mt-8 space-y-4">

      

      <p className=' bg-gray-100 p-3 rounded-lg'>Email : {user.email}</p>
      <p className=' bg-gray-100 p-3 rounded-lg'>Phone Numper : { phone ? phone : "not phone"}</p>

    </div>

    <button onClick={()=>navigate("/editProfile")}  className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer">
      Edit Profile
    </button>

  </div>
</div>
  
  
  </>
}
