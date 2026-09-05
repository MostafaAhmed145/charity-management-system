import { getFunctions, httpsCallable } from "firebase/functions";
import { doc, updateDoc } from "firebase/firestore";
import app, { db } from "../firebase";

const CALLABLE_MISSING = new Set([
  "functions/not-found",
  "functions/unavailable",
  "functions/internal",
]);
const DEFAULT_TIMEOUT_MS = 8000;

function functionsClient() {
  return getFunctions(app, "us-central1");
}

function withTimeout(promise, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const error = new Error("callable-timeout");
      error.code = "functions/unavailable";
      reject(error);
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

export async function setUserRoleSecure(uid, role, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const setUserRole = httpsCallable(functionsClient(), "setUserRole");
  try {
    return await withTimeout(setUserRole({ uid, role }), timeoutMs);
  } catch (error) {
    if (!CALLABLE_MISSING.has(error?.code)) {
      throw error;
    }
    await updateDoc(doc(db, "users", uid), { role });
    return { data: { ok: true } };
  }
}

export async function deleteUserAccountSecure(uid, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const deleteUserAccount = httpsCallable(functionsClient(), "deleteUserAccount");
  try {
    return await withTimeout(deleteUserAccount({ uid }), timeoutMs);
  } catch (error) {
    if (CALLABLE_MISSING.has(error?.code)) {
      const missing = new Error("not-found");
      missing.code = "functions/not-found";
      throw missing;
    }
    throw error;
  }
}
