import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function ensureUserProfile(user, extras = {}) {
  if (!user?.uid) {
    return null;
  }

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    const existing = snapshot.data();
    const updates = {};
    if (extras.name && !existing.name) {
      updates.name = extras.name;
    }
    if (extras.phone && !existing.phone) {
      updates.phone = extras.phone;
    }
    if (Object.keys(updates).length === 0) {
      return existing;
    }
    await setDoc(userRef, updates, { merge: true });
    return { ...existing, ...updates };
  }

  const profile = {
    uid: user.uid,
    name: extras.name || user.displayName || "",
    phone: extras.phone || "",
    email: user.email || extras.email || "",
    role: "user",
    createdAt: new Date(),
  };

  await setDoc(userRef, profile);
  return profile;
}
