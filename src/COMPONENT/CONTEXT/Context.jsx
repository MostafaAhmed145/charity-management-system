import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useState, useEffect } from 'react'
import app, { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { getStatus as getStatusFromLib } from "../../lib/status.js";

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
                    const token = await currentUser.getIdTokenResult();

                    let resolvedRole = "";
                    if (typeof token.claims.role === "string") {
                      resolvedRole = token.claims.role;
                    } else if (docSnap.exists()) {
                      resolvedRole = docSnap.data().role || "";
                    }

                    setRole(resolvedRole);

                    if (docSnap.exists()) {
                      setUserData(docSnap.data());
                    } else {
                      setUserData(null);
                    }

              }   else{
                 setUser(null);
                  setRole("");
                  setUserData(null);
              }

              setLoading(false)
        })

        return unsubscribe

    } , [])

    const getStatus = (status) => getStatusFromLib(status);

  return <AuthContext.Provider value={{ 
    user,
    setUser,
    loading,
    setLoading,
    role,
    userData, 
    setUserData , 
    getStatus
   } }>
     {children}
  </AuthContext.Provider>
  
}
