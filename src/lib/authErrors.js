const GENERIC_AUTH_MESSAGE = "تعذر إتمام العملية. حاول مرة أخرى.";

const AUTH_ERROR_MESSAGES = {
  "auth/wrong-password": "البريد أو كلمة المرور غير صحيحة.",
  "auth/invalid-credential": "البريد أو كلمة المرور غير صحيحة.",
  "auth/user-not-found": "البريد أو كلمة المرور غير صحيحة.",
  "auth/email-already-in-use": "هذا البريد مسجّل بالفعل.",
  "auth/invalid-email": "صيغة البريد الإلكتروني غير صحيحة.",
  "auth/weak-password": "كلمة المرور ضعيفة جداً.",
  "auth/too-many-requests": "محاولات كثيرة. حاول لاحقاً.",
  "auth/popup-closed-by-user": "تم إغلاق نافذة تسجيل الدخول.",
  "auth/network-request-failed": "تعذر الاتصال. تحقق من الشبكة.",
};

export function getAuthErrorMessage(err) {
  const code = err?.code;
  if (typeof code === "string" && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }
  return GENERIC_AUTH_MESSAGE;
}
