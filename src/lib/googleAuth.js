import { GoogleAuthProvider, getAdditionalUserInfo, signInWithPopup } from "firebase/auth";
import { ensureUserProfile } from "./ensureUserProfile.js";

export async function signInWithGoogle(auth) {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  await ensureUserProfile(result.user, {
    name: result.user.displayName || "",
    email: result.user.email || "",
  });
  const info = getAdditionalUserInfo(result);
  return {
    user: result.user,
    isNewUser: info?.isNewUser === true,
  };
}
