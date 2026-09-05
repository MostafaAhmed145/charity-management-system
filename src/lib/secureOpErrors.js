import { MSG } from "./validation.js";

const MESSAGES = {
  "functions/not-found": "خدمة إدارة الحسابات غير مفعّلة. تعذر إتمام العملية.",
  "functions/unavailable": "خدمة إدارة الحسابات غير مفعّلة. تعذر إتمام العملية.",
  "functions/internal": "خدمة إدارة الحسابات غير مفعّلة. تعذر إتمام العملية.",
  "functions/permission-denied": "ليس لديك صلاحية لهذا الإجراء.",
  "functions/unauthenticated": "يجب تسجيل الدخول أولاً.",
  "functions/failed-precondition": "لا يمكن تنفيذ هذا الإجراء على هذا الحساب.",
};

export function getSecureOpMessage(error) {
  const code = typeof error?.code === "string" ? error.code : "";
  return MESSAGES[code] || MSG.network;
}
