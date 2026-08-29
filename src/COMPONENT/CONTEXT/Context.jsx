
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useState, useEffect } from 'react'
import app, { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Clock3,
  HeartHandshake,
  XCircle,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

export let AuthContext = createContext()

export default function AuthProvider({children}) {
  
  const auth = getAuth(app)
  
  const [userData, setUserData] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ role, setRole] = useState("");



    useEffect(()=>{

        const unsubscribe = onAuthStateChanged( auth , async (currentUser)=>{

             if (currentUser) {
                  setUser(currentUser)
                   const docRef = doc(db, "users", currentUser.uid);

                    const docSnap = await getDoc(docRef);

                    console.log("doc exists:", docSnap.data().role);

                    

                    if (docSnap.exists()) {
                      setRole(docSnap.data().role);
                      setUserData(docSnap.data());
                    }

              }   else{
                 setUser(null);
                  setRole("");
              }

              setLoading(false)
        })

        return unsubscribe

    } , [])

    const getStatus = (status) => {
  switch (status) {
    case "pending":
      return {
        text: "قيد المراجعة",
        className: "bg-yellow-50 text-yellow-700",
        icon: Clock3,
      };

    case "approved":
      return {
        text: "تمت الموافقة",
        className: "bg-green-50 text-green-700",
        icon: HeartHandshake,
      };

    case "rejected":
      return {
        text: "مرفوض",
        className: "bg-red-100 text-red-700",
        icon: XCircle,
      };

    case "in_progress":
      return {
        text: "جار التنفيذ",
        className: "bg-gray-100 text-gray-700 ",
        icon: LoaderCircle,
      };

    case "completed":
      return {
        text: "مكتمل",
        className: "bg-blue-50 text-blue-700",
        icon: CheckCircle2,
      };

    default:
      return {
        text: "غير معروف",
        className: "bg-gray-50 text-gray-600",
        icon: Clock3,
      };
  }
};

  return <AuthContext.Provider value={{ 
    user,
    setUser,
    loading,
    setLoading,
    role,
    setRole,
    userData, 
    setUserData , 
    getStatus
   } }>
     {children}
  </AuthContext.Provider>
  
}
