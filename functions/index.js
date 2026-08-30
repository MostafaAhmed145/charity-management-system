const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { auth } = require("firebase-functions/v1");

initializeApp();

const ALLOWED_ROLES = ["user", "admin"];

async function assertSuperAdmin(request) {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be signed in.");
  }

  if (request.auth.token.role === "superAdmin") {
    return;
  }

  const snap = await getFirestore().doc(`users/${request.auth.uid}`).get();
  if (snap.exists && snap.data().role === "superAdmin") {
    return;
  }

  throw new HttpsError("permission-denied", "Only superAdmin can perform this action.");
}

exports.setUserRole = onCall(async (request) => {
  await assertSuperAdmin(request);

  const uid = request.data?.uid;
  const role = request.data?.role;

  if (!uid || typeof uid !== "string") {
    throw new HttpsError("invalid-argument", "uid is required.");
  }

  if (!ALLOWED_ROLES.includes(role)) {
    throw new HttpsError("invalid-argument", "Role must be user or admin.");
  }

  await getAuth().setCustomUserClaims(uid, { role });
  await getFirestore().doc(`users/${uid}`).set({ role }, { merge: true });

  return { ok: true };
});

exports.deleteUserAccount = onCall(async (request) => {
  await assertSuperAdmin(request);

  const uid = request.data?.uid;

  if (!uid || typeof uid !== "string") {
    throw new HttpsError("invalid-argument", "uid is required.");
  }

  await getAuth().deleteUser(uid);
  await getFirestore().doc(`users/${uid}`).delete();

  return { ok: true };
});

exports.onUserCreate = auth.user().onCreate(async (user) => {
  const ref = getFirestore().doc(`users/${user.uid}`);
  const snap = await ref.get();

  if (!snap.exists) {
    await ref.set({
      uid: user.uid,
      name: user.displayName || "",
      phone: user.phoneNumber || "",
      email: user.email || "",
      role: "user",
      createdAt: new Date(),
    });
  }

  await getAuth().setCustomUserClaims(user.uid, { role: "user" });
});
