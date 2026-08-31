import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useCallback, useEffect, useState } from "react";
import app, { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { getStatus as getStatusFromLib } from "../../lib/status.js";
import { ensureUserProfile } from "../../lib/ensureUserProfile.js";
import { resolveRole } from "../../lib/resolveRole.js";

export let AuthContext = createContext();

export default function AuthProvider({ children }) {
  const auth = getAuth(app);

  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  const applySession = useCallback(async (currentUser, forceRefresh = false) => {
    let claimRole = "";
    try {
      const token = await currentUser.getIdTokenResult(forceRefresh);
      claimRole = typeof token.claims.role === "string" ? token.claims.role : "";
    } catch {
      claimRole = "";
    }

    let docRole = "";
    let data = null;
    try {
      const docSnap = await getDoc(doc(db, "users", currentUser.uid));
      if (docSnap.exists()) {
        data = docSnap.data();
        docRole = data.role || "";
      }
    } catch {
      data = null;
    }

    setRole(resolveRole(docRole, claimRole));
    setUserData(data);
    return Boolean(data);
  }, []);

  const refreshSession = useCallback(async () => {
    const current = auth.currentUser;
    if (!current) return;
    const hasProfile = await applySession(current, true);
    if (!hasProfile) {
      await ensureUserProfile(current);
      await applySession(current, true);
    }
  }, [applySession, auth]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
          const hasProfile = await applySession(currentUser, false);
          if (!hasProfile) {
            await ensureUserProfile(currentUser);
            await applySession(currentUser, true);
          }
        } else {
          setUser(null);
          setRole("");
          setUserData(null);
        }
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [applySession, auth]);

  const getStatus = (status) => getStatusFromLib(status);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        role,
        userData,
        setUserData,
        getStatus,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
