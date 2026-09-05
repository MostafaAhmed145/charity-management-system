const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { auth } = require("firebase-functions/v1");

initializeApp();

const ALLOWED_ROLES = ["user", "admin"];
const CALLABLE = { region: "us-central1" };

async function assertSuperAdmin(request) {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be signed in.");
  }

  const snap = await getFirestore().doc(`users/${request.auth.uid}`).get();
  if (snap.exists && snap.data().role === "superAdmin") {
    return;
  }

  throw new HttpsError("permission-denied", "Only superAdmin can perform this action.");
}

async function assertMutableTarget(request, uid) {
  if (!uid || typeof uid !== "string") {
    throw new HttpsError("invalid-argument", "uid is required.");
  }

  if (uid === request.auth.uid) {
    throw new HttpsError("failed-precondition", "Cannot mutate your own account.");
  }

  const snap = await getFirestore().doc(`users/${uid}`).get();
  if (snap.exists && snap.data().role === "superAdmin") {
    throw new HttpsError("failed-precondition", "Cannot mutate a superAdmin.");
  }
}

exports.setUserRole = onCall(CALLABLE, async (request) => {
  await assertSuperAdmin(request);

  const uid = request.data?.uid;
  const role = request.data?.role;

  await assertMutableTarget(request, uid);

  if (!ALLOWED_ROLES.includes(role)) {
    throw new HttpsError("invalid-argument", "Role must be user or admin.");
  }

  await getFirestore().doc(`users/${uid}`).set({ role }, { merge: true });
  await getAuth().setCustomUserClaims(uid, { role });
  await getAuth().revokeRefreshTokens(uid);

  return { ok: true };
});

exports.deleteUserAccount = onCall(CALLABLE, async (request) => {
  await assertSuperAdmin(request);

  const uid = request.data?.uid;
  await assertMutableTarget(request, uid);

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

  const existingRole = snap.exists ? snap.data().role : "";
  const role = typeof existingRole === "string" && existingRole ? existingRole : "user";
  await getAuth().setCustomUserClaims(user.uid, { role });
});
