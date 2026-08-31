# Firebase — رفع القواعد

المشروع مربوط بـ `charity-management-syste-26444`.

الملفات:

- القواعد: `firestore.rules`
- الربط: `.firebaserc` و `firebase.json`
- الإعداد المحلي: انسخ `.env.example` إلى `.env`

Firebase CLI مثبت داخل المشروع. لا تكتب `firebase` مباشرة.

## 1) تسجيل الدخول

من جذر المشروع، ادخل بالحساب المالك للمشروع في Firebase Console:

```bash
npx firebase login --reauth
```

## 2) رفع القواعد والـ Functions

```bash
npm run deploy:firebase
```

أو:

```bash
npx firebase deploy --only firestore:rules,functions
```

لرفع القواعد فقط:

```bash
npx firebase deploy --only firestore:rules
```

## لو ظهر خطأ

- `firebase: command not found` — استخدم `npx firebase` من جذر المشروع.
- `403` — الحساب الحالي ليس Owner/Editor على المشروع. أعد `npx firebase login --reauth` بالحساب الصحيح.
- فشل الـ Functions — يحتاج خطة Blaze. ارفع القواعد وحدها بالأمر الأخير أعلاه. تغيير الصلاحيات وحذف الحسابات يتطلب Functions ولا يوجد مسار بديل عبر Firestore فقط.

أول `superAdmin` يُعيَّن يدوياً من Firestore Console على مستند `users/{uid}`: `role: "superAdmin"`.
