import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../firebase";

export async function setUserRoleSecure(uid, role) {
  const setUserRole = httpsCallable(getFunctions(app), "setUserRole");
  return setUserRole({ uid, role });
}

export async function deleteUserAccountSecure(uid) {
  const deleteUserAccount = httpsCallable(getFunctions(app), "deleteUserAccount");
  return deleteUserAccount({ uid });
}
