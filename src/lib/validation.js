export const PASSWORD_REGEX = /^.{8,}$/;
export const PHONE_REGEX = /^01[0125][0-9]{8}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NAME_REGEX = /^[a-zA-Z\u0600-\u06FF\s]{3,50}$/;
export const NATIONAL_ID_REGEX = /^[0-9]{14}$/;
export const PASSWORD_HINT = "كلمة السر 8 حروف أو أرقام على الأقل";

export const MSG = {
  name: "يرجى إدخال اسم صحيح",

  email: "يرجى إدخال بريد إلكتروني صحيح",

  phone: "يرجى إدخال رقم هاتف صحيح",

  nationalId: "يجب أن يتكون الرقم القومي من 14 رقمًا",

  password: PASSWORD_HINT,

  passwordMatch: "كلمتا المرور غير متطابقتين",

  required: "هذا الحقل مطلوب",

  loginFailed: "البريد الإلكتروني أو كلمة المرور غير صحيحة",

  network: "تعذر حفظ البيانات، يرجى المحاولة مرة أخرى",
};


export function isValidName(value) {
  return NAME_REGEX.test(String(value ?? "").trim());
}

export function isValidEmail(value) {
  return EMAIL_REGEX.test(String(value ?? "").trim());
}

export function isValidPhone(value) {
  return PHONE_REGEX.test(String(value ?? "").trim());
}

export function isValidNationalId(value) {
  return NATIONAL_ID_REGEX.test(String(value ?? "").trim());
}

export function isValidPassword(value) {
  return PASSWORD_REGEX.test(String(value ?? ""));
}
