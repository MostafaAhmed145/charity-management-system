export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
export const PHONE_REGEX = /^01[0125][0-9]{8}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NAME_REGEX = /^[a-zA-Z\u0600-\u06FF\s]{3,50}$/;
export const NATIONAL_ID_REGEX = /^[0-9]{14}$/;
export const PASSWORD_HINT = "كلمة المرور 8 أحرف على الأقل وتشمل حرفاً ورقماً ورمزاً";

export const MSG = {
  name: "برجاء إدخال اسم صحيح",
  email: "البريد مش صح",
  phone: "رقم الموبايل مش صح",
  nationalId: "الرقم القومي لازم 14 رقم",
  password: PASSWORD_HINT,
  passwordMatch: "كلمتا السر مش زي بعض",
  required: "الحقل مطلوب",
  loginFailed: "البريد أو كلمة السر مش صح",
  network: "تعذر الحفظ، حاول مرة تانية",
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
