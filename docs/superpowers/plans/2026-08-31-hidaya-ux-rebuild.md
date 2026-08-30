# جمعية الهداية — خطة إعادة بناء UI/UX

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Parallel C agents:** بعد Task 1، شغّل Task 2 و Task 3 و Task 4 في نفس الوقت — كل واحد C agent من الملفات بتاعته بس. جدول الملكيات تحت ملزم.

**Goal:** إعادة بناء واجهة جمعية الهداية (باب عام + بيت مستفيد + غرفة إدارة) على هوية الختم الأخضر واللوجو المعتمد، من غير تغيير نموذج Firebase.

**Architecture:** موجة أساس تثبت التوكنات والمكوّنات المشتركة والـ lib. بعدها ثلاث مسارات مستقلة تبني الأسطح. موجة صقل أخيرة بعد الدمج. كل مسار يملك ملفات حصرية عشان 3 C agents ما يتخانقوش على نفس الملف.

**Tech Stack:** React 19, Vite 8, Tailwind 4, Firebase Auth/Firestore, Formik, react-router-dom 7, lucide-react, react-toastify, Vitest (للـ lib فقط).

**Spec:** `docs/superpowers/specs/2026-08-31-hidaya-ux-rebuild-design.md`

## Global Constraints

- عربي RTL: `html lang="ar" dir="rtl"`. ممنوع إنجليزي ظاهر في الواجهة أو رسائل المستخدم.
- الاسم: **جمعية الهداية** (تاء مربوطة). مش «الهدايه».
- اللوجو المعتمد فقط: `docs/superpowers/specs/assets/hidaya-logo-hand-dome.png` (نسخة `hidaya-mark.png`).
- ألوان حرفياً من المواصفة: Body `#F4F4F2`، Surface `#FFFFFF`، Ink `#1C211E`، Muted `#3F5349`، Accent `#1F5C45`، Accent dark `#143D2E`، Tint `#E6EEE9`، Line `#D5DFD9`، Pending `#F3E6B8` / `#6B5420`، Danger ink `#8B3A2F`.
- خطوط: Aref Ruqaa 700 للعناوين واسم الجمعية فقط. IBM Plex Sans Arabic 400/500/600/700 لكل الواجهة.
- Firebase والحقول والأدوار (`user` / `admin` / `superAdmin`) ما تتغيرش.
- واتساب: `https://wa.me/201121122552`.
- أيقونات: `lucide-react` فقط. `react-icons/fc` لزر جوجل في الدخول فقط.
- ممنوع: italic إنجليزي، قلب/مصافحة في اللوجو، كروت أيقونة متطابقة، `onClose={() => {}}`، أفاتار `a` للزائر، `err.message` الخام للمستخدم.
- كل C agent يلمس **ملفات مساره فقط**. لو محتاج ملف مش ملكه، يوقف ويكتب ملاحظة — ما يعدّلوش.

---

## ملكية الملفات (ملزم لـ C agents)

| المسار | الوكيل | يملك |
|--------|---------|------|
| Foundation | C-0 (وحده أولاً) | `index.html`, `src/index.css`, `public/logo-mark.png`, `src/lib/**`, `src/COMPONENT/UI/**`, `src/COMPONENT/CONTEXT/Context.jsx`, `src/COMPONENT/NAV-BAR/NavBar.jsx`, `src/COMPONENT/LayOute/LayOute.jsx`, `package.json`, `vite.config.js` |
| Door + Auth | C-Door | `src/COMPONENT/DOOR/**`, `LOGIN`, `REGISTER`, `FORGOT-PASSWORD`, `NOT-FOUND`, `src/App.jsx` |
| Beneficiary | C-User | `USER-HOME`, `SUBMIT-CASE`, `MY-CASES`, `PROFILE`, `EDIT-PROFILE` |
| Admin | C-Admin | `SIDE-BAR`, `DASH-BOARD`, `CASES`, `TRASH`, `SUPER-ADMIN`, `CASE-MODAL`, `CASE-DETELS-MODAL`, `DeleteCaseModal`, `CHANGE-ROLE-MODAL`, `src/COMPONENT/CASE-DRAWER/**` |
| Polish | C-Polish (بعد دمج 2–4) | فجوات مشتركة: empty/loading/focus فقط في الملفات اللي لسه ناقصة — قائمة صريحة في Task 5 |

`src/App.jsx` ملك C-Door وحده. المسارات الحالية للمستفيد والإدارة موجودة؛ C-User و C-Admin ما يفتحوش `App.jsx`.

---

## كيف تشغّل أكتر من C agent

1. وكّل **C-0** على Task 1. استنى ما يخلّص ويتراجع.
2. في رسالة واحدة، وكّل **ثلاثة** C agents معاً:
   - C-Door → Task 2
   - C-User → Task 3
   - C-Admin → Task 4
3. بعد ما التلاتة يخلّصوا، وكّل **C-Polish** على Task 5.
4. كل وكيل يقرأ المواصفة + المهمة بتاعته + قسم Interfaces. ما يورّثش تاريخ الشات.

برومبت جاهز لكل وكيل في نهاية كل Task تحت عنوان **C-agent prompt**.

---

## خريطة الملفات الجديدة

```
public/logo-mark.png
src/lib/status.js
src/lib/status.test.js
src/lib/validation.js
src/lib/validation.test.js
src/lib/caseFields.js
src/COMPONENT/UI/Button.jsx
src/COMPONENT/UI/Field.jsx
src/COMPONENT/UI/StatusBadge.jsx
src/COMPONENT/UI/LogoLockup.jsx
src/COMPONENT/UI/ConfirmDialog.jsx
src/COMPONENT/UI/PageHeading.jsx
src/COMPONENT/DOOR/Door.jsx
src/COMPONENT/CASE-DRAWER/CaseDrawer.jsx
```

---

### Task 1: Foundation — التوكنات والـ lib ومكوّنات الصدفة

**Agent:** C-0 فقط. باقي الوكلاء ما يبدؤوش قبل ما المهمة دي تتقفل.

**Files:**
- Create: `public/logo-mark.png` (نسخ من `docs/superpowers/specs/assets/hidaya-mark.png`)
- Create: `src/lib/status.js`, `src/lib/status.test.js`, `src/lib/validation.js`, `src/lib/validation.test.js`, `src/lib/caseFields.js`
- Create: `src/COMPONENT/UI/Button.jsx`, `Field.jsx`, `StatusBadge.jsx`, `LogoLockup.jsx`, `ConfirmDialog.jsx`, `PageHeading.jsx`
- Modify: `index.html`, `src/index.css`, `src/COMPONENT/CONTEXT/Context.jsx`, `src/COMPONENT/NAV-BAR/NavBar.jsx`, `src/COMPONENT/LayOute/LayOute.jsx`, `package.json`, `vite.config.js`
- Do not touch: أي صفحة مسار (Login, Cases, …) أو `App.jsx`

**Interfaces:**
- Consumes: المواصفة قسم 3 و 4 و 7؛ ملف اللوجو `docs/superpowers/specs/assets/hidaya-mark.png`
- Produces: العقود التالية — C-Door / C-User / C-Admin بيستهلكوها بالحرف:

```js
// src/lib/status.js
export function getStatus(status) // { text, className, icon } — approved => same as in_progress
export function statusReassurance(status) // Arabic sentence for MyCases
export function maskNationalId(nationalId) // "**********" + last 4

// src/lib/validation.js
export function isValidName(value)    // 3–50 Arabic or Latin letters/spaces
export function isValidEmail(value)
export function isValidPhone(value)   // /^01[0125][0-9]{8}$/
export function isValidNationalId(value) // /^[0-9]{14}$/
export function isValidPassword(value) // /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
export const MSG = {
  name: "برجاء إدخال اسم صحيح",
  email: "البريد مش صح",
  phone: "رقم الموبايل مش صح",
  nationalId: "الرقم القومي لازم 14 رقم",
  password: "كلمة السر 6 حروف على الأقل وفيها حرف ورقم",
  passwordMatch: "كلمتا السر مش زي بعض",
  required: "الحقل مطلوب",
  loginFailed: "البريد أو كلمة السر مش صح",
  network: "تعذر الحفظ، حاول مرة تانية",
}

// src/lib/caseFields.js
export const CASE_TYPES = ["أرملة","مطلقة","يتيم","ذوي احتياجات خاصة","أسرة محدودة الدخل","شيء آخر"]
export const SUPPORT_TYPES = ["مساعدة مالية","مواد غذائية","علاج","مصروفات تعليم","تجهيز عرائس","شيء آخر"]
```

```jsx
// UI — named exports
<Button variant="primary|secondary|danger" type="button|submit" disabled loading>
<Field label name type="text|tel|email|password|select|textarea" value onChange onBlur error touched children /* for select options */ />
<StatusBadge status />           // uses getStatus
<LogoLockup size={24|28|36|48} showWord word="جمعية الهداية"|"الهداية" onDark />
<ConfirmDialog open onClose onConfirm title body confirmLabel danger />
<PageHeading>عنوان رقعة</PageHeading>
```

`AuthContext.getStatus` يبقى موجود ويغلّف `getStatus` من `src/lib/status.js` (ما تكسروش المستدعين الحاليين).

- [ ] **Step 1: انسخ اللوجو**

```bash
cp docs/superpowers/specs/assets/hidaya-mark.png public/logo-mark.png
```

- [ ] **Step 2: أضف Vitest**

في `package.json` scripts: `"test": "vitest run"`.  
في `vite.config.js` أضف:

```js
test: { environment: "node", include: ["src/**/*.test.js"] }
```

```bash
npm i -D vitest
```

- [ ] **Step 3: اكتب اختبارات lib الفاشلة**

`src/lib/status.test.js`:

```js
import { describe, it, expect } from "vitest";
import { getStatus, maskNationalId, statusReassurance } from "./status.js";

describe("getStatus", () => {
  it("maps approved to in_progress copy", () => {
    expect(getStatus("approved").text).toBe(getStatus("in_progress").text);
  });
  it("pending is قيد المراجعة", () => {
    expect(getStatus("pending").text).toBe("قيد المراجعة");
  });
});

describe("maskNationalId", () => {
  it("keeps last 4", () => {
    expect(maskNationalId("29501011234567")).toBe("**********4567");
  });
});

describe("statusReassurance", () => {
  it("pending sentence", () => {
    expect(statusReassurance("pending")).toContain("بنراجع");
  });
});
```

`src/lib/validation.test.js`: اختبار `isValidPhone("01012345678") === true` و `"0123" === false` و `isValidNationalId` طول 14.

- [ ] **Step 4: شغّل الاختبارات — لازم FAIL**

```bash
npm test
```

Expected: FAIL module not found.

- [ ] **Step 5: اكتب `src/lib/status.js` و `validation.js` و `caseFields.js`**

`getStatus` classNames (حرفياً):

```
pending:     "bg-[#F3E6B8] text-[#6B5420]"
in_progress: "bg-[#E6EEE9] text-[#3F5349]"  // also used for approved
completed:   "bg-[#E6EEE9] text-[#1F5C45]"
rejected:    "bg-[#F4F4F2] text-[#8B3A2F]"
default:     "bg-[#E6EEE9] text-[#3F5349]"
```

`statusReassurance`:

- pending: `لسه بنراجع البيانات. هتتبلغ أول ما الحالة تتغير.`
- in_progress / approved: `الطلب اتقبل وبيتنفّذ.`
- completed: `الطلب اتقفّل.`
- rejected: `الطلب مترفض. لو محتاج توضيح، تواصل واتساب.`

- [ ] **Step 6: `npm test` — PASS**

- [ ] **Step 7: `index.html` و `src/index.css`**

`index.html`:

```html
<html lang="ar" dir="rtl">
  <head>
    <title>جمعية الهداية</title>
    <link rel="icon" type="image/png" href="/logo-mark.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

`src/index.css` — بعد `@import "tailwindcss";` عرّف `@theme` / `:root` بالتوكنات من المواصفة (`--hidaya-body` … `--hidaya-drawer`).  
`body`: `background: var(--hidaya-body); color: var(--hidaya-ink); font-family: "IBM Plex Sans Arabic", sans-serif;`  
`.font-ruqaa { font-family: "Aref Ruqaa", serif; }`  
focus: `*:focus-visible { outline: 3px solid var(--hidaya-tint); outline-offset: 2px; box-shadow: 0 0 0 1px var(--hidaya-accent); }`  
`@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`

- [ ] **Step 8: اكتب مكوّنات `src/COMPONENT/UI/`**

`Button`: ارتفاع ≥ 44px، `rounded-[12px]`. primary = `bg-[#1F5C45] text-[#F4F4F2]`، secondary = حدود `#B7C9BE` نص ختم، danger = نص `#8B3A2F`.  
`Field`: label فوق الحقل (مش placeholder لوحده)، خطأ أحمر تحت الحقل إذا `touched && error`.  
`LogoLockup`: `<img src="/logo-mark.png" alt="جمعية الهداية" width={size} height={size} />` + كلمة رقعة إذا `showWord`.  
`ConfirmDialog`: Headless UI Dialog، `onClose` يقفل فعلاً، زر تأكيد/إلغاء عربي.  
`StatusBadge`: أيقونة + `getStatus(status).text`.  
`PageHeading`: `h1.font-ruqaa` حجم 1.5–1.75rem.

- [ ] **Step 9: NavBar + Layout + Context**

`LayOute.jsx`: `<NavBar />` ثم `<div className="pt-16"><Outlet /></div>` (64px).  
`NavBar.jsx`: ثابت `h-16 bg-[#143D2E] z-[30]`. `LogoLockup size={36} showWord word={narrow ? "الهداية" : "جمعية الهداية"} onDark`.  
زائر: روابط «إنشاء حساب» و«تسجيل الدخول» — **من غير أفاتار**.  
داخل: أول اسم من `userData.name`، أفاتار حرف عربي، زر نص «تسجيل الخروج».  
أدمن/سوبر: رابط «لوحة التحكم». مستفيد: من غير رابط لوحة. سوبر وأدمن: بدون «واجهة المستخدم» إلا رابط نصّي صغير اختياري.  
`Context.jsx`: استورد `getStatus` من `../../lib/status` واستخدمه في الـ provider (امسح الـ switch المحلي).

- [ ] **Step 10: تحقق**

```bash
npm test
npm run build
```

Expected: tests PASS، build ينجح.

- [ ] **Step 11: Commit**

```bash
git add index.html src/index.css public/logo-mark.png src/lib src/COMPONENT/UI src/COMPONENT/CONTEXT/Context.jsx src/COMPONENT/NAV-BAR/NavBar.jsx src/COMPONENT/LayOute/LayOute.jsx package.json package-lock.json vite.config.js
git commit -m "feat: hidaya design tokens, logo, and shared UI kit"
```

**C-agent prompt (C-0):**

```
نفّذ Task 1 فقط من docs/superpowers/plans/2026-08-31-hidaya-ux-rebuild.md
اقرأ docs/superpowers/specs/2026-08-31-hidaya-ux-rebuild-design.md
لا تعدّل App.jsx ولا صفحات Login/Cases/UserHome.
التزم بملكية الملفات وقسم Interfaces حرفياً.
ارجع: قائمة الملفات + نتيجة npm test و npm run build.
```

---

### Task 2: الباب العام والدخول (C-Door)

**Files:**
- Create: `src/COMPONENT/DOOR/Door.jsx`
- Modify: `src/COMPONENT/LOGIN/Login.jsx`, `REGISTER/Register.jsx`, `FORGOT-PASSWORD/ForgotPassword.jsx`, `NOT-FOUND/NotFound.jsx`, `src/App.jsx`
- Do not touch: ملفات C-0 بعد ما تخلّصت، ولا صفحات المستفيد/الإدارة

**Interfaces:**
- Consumes: `Button`, `Field`, `LogoLockup`, `PageHeading`, `MSG` + validators من `src/lib/validation.js`، `AuthContext.user` و `role`
- Produces: `/` يعرض `Door`. بعد الدخول: `role === "admin" || role === "superAdmin"` → `/dashBoard` وإلا `/userHome`. جوجل نفس التحويل (مش `UserHome` ثابت).

- [ ] **Step 1: `Door.jsx`**

نصوص حرفياً:

- سطر الثقة: `أهل بيتك… لو محتاج مساعدة، إحنا هنا.`
- أساسي: `تقديم طلب مساعدة` → لو `user` اروح `/submitCase` وإلا `/login` (أو `/register` لو مفيش حساب — الزر الأساسي يروح `/register` إذا مفيش user)
- ثانوي: `متابعة طلب` → `user` ? `/myCases` : `/login`
- ثلاث جمل: `تقدّم الطلب` / `نراجعه معاك` / `نبلغك بالحالة`
- روابط: `تسجيل الدخول` · `إنشاء حساب`
- أسفل: `جمعية الهداية`
- `LogoLockup size={48} showWord`
- مفيش لوحة تحكم

- [ ] **Step 2: Login / Register / ForgotPassword**

كلها RTL، `Field` بتسميات: البريد، كلمة السر، الاسم، الموبايل، تأكيد كلمة السر.  
إظهار/إخفاء كلمة السر.  
Login: «نسيت كلمة السر؟» → `/ForgotPassword`. «ما عندكش حساب؟ إنشاء حساب».  
زر جوجل: `الدخول باستخدام Google` (`type="button"`).  
Register: «عندك حساب؟ دخول». نفس التحقق الحالي بالقيم من `validation.js` ورسائل `MSG`.  
نجاح التسجيل: توست `تم إنشاء الحساب` ثم `/login`.  
Forgot: نجاح `بعتنا رابط على بريدك`.  
أخطاء Firebase للمستخدم: `MSG.loginFailed` أو `MSG.network` — مش `err.message`.  
امسح italic الإنجليزي و`forgit password`.

`Login.jsx` تحويل بعد auth:

```js
if (user && (role === "admin" || role === "superAdmin")) return <Navigate to="/dashBoard" replace />
if (user && role === "user") return <Navigate to="/userHome" replace />
```

امسح `setTimeout(() => navigate("/UserHome"))` من جوجل.

- [ ] **Step 3: `App.jsx`**

```js
{ index: true, element: <Door /> },
{ path: "login", element: <Login /> },
```

باقي المسارات زي ما هي.  
`ToastContainer` `theme="light"` `rtl` `position="top-center"` `autoClose={2500}`.  
`document.title` الافتراضي من `index.html`.

- [ ] **Step 4: `NotFound.jsx`**

عربي، زر `العودة للرئيسية` → `/` بـ `Button` + لوجو اختياري. ألوان الختم مش `#0f2c4d`.

- [ ] **Step 5: تحقق**

```bash
npm run build
```

Expected: ينجح. افتح `/` و `/login` و `/register` — كله عربي، اللوجو ظاهر، مفيش إنجليزي.

- [ ] **Step 6: Commit**

```bash
git add src/COMPONENT/DOOR src/COMPONENT/LOGIN src/COMPONENT/REGISTER src/COMPONENT/FORGOT-PASSWORD src/COMPONENT/NOT-FOUND src/App.jsx
git commit -m "feat: Arabic public door and auth screens"
```

**C-agent prompt (C-Door):**

```
نفّذ Task 2 فقط من docs/superpowers/plans/2026-08-31-hidaya-ux-rebuild.md
Task 1 خلصت. استهلك UI و lib من src/COMPONENT/UI و src/lib.
الملفات المسموحة: DOOR, LOGIN, REGISTER, FORGOT-PASSWORD, NOT-FOUND, App.jsx فقط.
لا تعدّل NavBar ولا Cases ولا UserHome.
ارجع: المسارات التي تغيّرت + نتيجة البناء.
```

---

### Task 3: بيت المستفيد (C-User)

**Files:**
- Modify: `src/COMPONENT/USER-HOME/UserHome.jsx`, `SUBMIT-CASE/SubmitCase.jsx`, `MY-CASES/MyCases.jsx`, `PROFILE/Profile.jsx`, `EDIT-PROFILE/EditProfile.jsx`
- Do not touch: `App.jsx`, NavBar, صفحات الإدارة

**Interfaces:**
- Consumes: `Button`, `Field`, `PageHeading`, `StatusBadge`, `LogoLockup` (اختياري)، `getStatus` / `statusReassurance` / `maskNationalId` من `src/lib/status.js`، `CASE_TYPES` / `SUPPORT_TYPES`، `MSG` + validators، `AuthContext.user` و `userData`
- Produces: تقديم يكتب `archived: false` مع `status: "pending"` و `userId` و `createdAt`. متابعة تعرض كروت بالحالة أولاً.

- [ ] **Step 1: `UserHome.jsx`**

قائمة رأسية (مش شبكة 3 كروت أيقونة):

```jsx
const first = (userData?.name || "").trim().split(/\s+/)[0]
// السلام عليكم يا {first}
```

ثلاث مهام: تقديم طلب → `/submitCase`، متابعة طلباتك → `/myCases`، تواصل واتساب → `https://wa.me/201121122552` (`target="_blank"` rel noopener).  
زر أساسي واحد ظاهر: `تقديم طلب مساعدة`.

- [ ] **Step 2: `SubmitCase.jsx` — ثلاث خطوات**

state: `step` 0|1|2.

0. `userName`, `phone`, `address`, `nationalId` — كل واحد `Field` بتسمية.  
1. `caseType` و `supportType` من `CASE_TYPES` / `SUPPORT_TYPES`، `notes` textarea.  
2. مراجعة قراءة فقط + `إرسال الطلب`.

شريط: `الخطوة ${step+1} من 3`.  
أساسي: `التالي` أو `إرسال الطلب`. ثانوي: `السابق`. إلغاء: `window.confirm("هتلغي الطلب؟")` ثم رجوع `/userHome`.  
تحقق كل خطوة قبل التالي.  
`addDoc` يضيف `archived: false`.  
نجاح: `toast.success("تم تقديم الطلب بنجاح")` ثم `navigate("/myCases")`.  
فشل: `toast.error(MSG.network)`.  
`document.title` عبر `useEffect`: `تقديم طلب — جمعية الهداية`.

- [ ] **Step 3: `MyCases.jsx`**

كارت لكل طلب: `StatusBadge` أكبر عنصر، ثم `{supportType} — {userName}`، التاريخ `toLocaleDateString("ar-EG")`، ثم `statusReassurance(item.status)`.  
قومي: `maskNationalId`.  
فارغ: `ما عندكش طلبات لسه` + `Button` إلى `/submitCase`.  
استعلام Firestore يفضل `userId` + `archived == false`. الوثائق الجديدة فيها الحقل.  
تحميل: 3 كروت skeleton `bg-[#E6EEE9] h-28` مش spinner وسط الصفحة.  
عنوان رقعة: `طلباتك`.

- [ ] **Step 4: Profile + EditProfile**

عربي. تسميات: الاسم، البريد، الهاتف. الزر: `تعديل الملف`.  
الأفاتار حرف من الاسم — **مش** `cursor-pointer` يوهم برفع صورة.  
امسح `Charity Member` و `Phone Numper`.  
EditProfile: `Field` + `Button` حفظ، رسائل `MSG`.

- [ ] **Step 5: تحقق**

```bash
npm run build
```

Expected: ينجح. مسار يدوي: تقديم 3 خطوات → `/myCases` كارت قيد المراجعة.

- [ ] **Step 6: Commit**

```bash
git add src/COMPONENT/USER-HOME src/COMPONENT/SUBMIT-CASE src/COMPONENT/MY-CASES src/COMPONENT/PROFILE src/COMPONENT/EDIT-PROFILE
git commit -m "feat: beneficiary home, three-step submit, and status-first cases"
```

**C-agent prompt (C-User):**

```
نفّذ Task 3 فقط من docs/superpowers/plans/2026-08-31-hidaya-ux-rebuild.md
استهلك src/lib و src/COMPONENT/UI.
الملفات: USER-HOME, SUBMIT-CASE, MY-CASES, PROFILE, EDIT-PROFILE فقط.
لا تعدّل App.jsx ولا الإدارة.
archived: false عند كل تقديم جديد.
ارجع: ملخص التدفقات + نتيجة البناء.
```

---

### Task 4: غرفة الإدارة (C-Admin)

**Files:**
- Create: `src/COMPONENT/CASE-DRAWER/CaseDrawer.jsx`
- Modify: `SIDE-BAR/SideBar.jsx`, `DASH-BOARD/DashBoard.jsx`, `CASES/Cases.jsx`, `TRASH/Trash.jsx`, `SUPER-ADMIN/SuperAdmin.jsx`, `CASE-MODAL/CaseModal.jsx`, `CASE-DETELS-MODAL/CaseDetailsModal.jsx`, `DeleteCaseModal/DeletCaseModal.jsx`, `CHANGE-ROLE-MODAL/ChangeRoleModal.jsx`
- Do not touch: `App.jsx`, صفحات المستفيد، `NavBar.jsx`

**Interfaces:**
- Consumes: كل UI kit + `getStatus` + `CASE_TYPES` / `SUPPORT_TYPES` + `ConfirmDialog` + `MSG`
- Produces: ضغط صف يفتح `CaseDrawer`. `onClose` يقفل. Escape يقفل. مفيش `onClose={() => {}}`. أرشيف `archived: true`. سوبر وحده يشوف رابط المسؤولين (موبايل وسطح المكتب).

- [ ] **Step 1: SideBar + DashBoard**

قائمة يمين RTL `w-[var(--hidaya-sidebar)]` `bg-[#1C211E]` `top-16` `z-[40]`.  
روابط: الحالات → `cases`، الأرشيف → `trash`، المسؤولون → `SuperAdmin` **إذا** `role === "superAdmin"` (من `AuthContext`).  
موبايل: زر قائمة + overlay `z-[50]`.  
`DashBoard`: `main` `mt-0 pt` مع `md:mr-64` (RTL: margin على جانب القائمة).

- [ ] **Step 2: `CaseDrawer.jsx`**

props:

```js
{ open, onClose, selectedCase, onEdit, onArchive }
```

سطح المكتب ≥1024: لوحة عرض `w-[22.5rem]` `z-[60]` جنب الجدول.  
تحت 1024: شيت من تحت.  
Escape وزر «إغلاق» ينادوا `onClose`.  
عرض كل الحقول + `StatusBadge`. أزرار: `تعديل`، `نقل للأرشيف`.  
القومي كامل هنا (شغل داخلي).

- [ ] **Step 3: `Cases.jsx`**

أدوات: بحث، فلتر حالة، `Button` «إضافة حالة».  
جدول RTL. صف قابل للضغط → `setSelectedCase` + فتح اللوحة. **مفيش** أزرار عرض/تعديل/حذف جوه الصف.  
تحميل: skeleton صفوف.  
فارغ: `ما فيش حالات بعد` أو `ما فيش حالات تطابق البحث` + زر تصفير الفلتر.  
`CaseModal` للإضافة/التعديل فقط، `onClose` يقفل (`setOpen(false)`).  
بعد الحفظ: `getCases()`.  
`document.title`: `الحالات — جمعية الهداية`.

- [ ] **Step 4: CaseModal**

نفس الحقول بـ `Field` + قوائم `CASE_TYPES` / `SUPPORT_TYPES`. عند التعديل أضف `status`.  
`Dialog` `onClose={() => { setSelectedCase(null); setOpen(false); }}`.  
نصوص عربية: `إضافة حالة` / `حفظ التغييرات`.

- [ ] **Step 5: Trash + SuperAdmin + تأكيدات**

Trash: جدول أرشيف، `ConfirmDialog` للحذف النهائي، استعادة `archived: false`.  
SuperAdmin: جدول مستخدمين، تغيير دور، حذف حساب — كلها `ConfirmDialog` عربي. مفيش «تم حذف الحسابا».  
`DeletCaseModal` و `ChangeRoleModal` إمّا يتلفّوا على `ConfirmDialog` أو يتبدلوا بيه.  
`CaseDetailsModal` يتشال من مسار الحالات (التفاصيل في اللوحة). ممكن تفضل الملف بس Cases ما تستخدمهوش.

- [ ] **Step 6: تحقق**

```bash
npm run build
```

Expected: ينجح. أدمن: صف → لوحة → Escape تقفل. سوبر يشوف المسؤولين، أدمن عادي لا.

- [ ] **Step 7: Commit**

```bash
git add src/COMPONENT/CASE-DRAWER src/COMPONENT/SIDE-BAR src/COMPONENT/DASH-BOARD src/COMPONENT/CASES src/COMPONENT/TRASH src/COMPONENT/SUPER-ADMIN src/COMPONENT/CASE-MODAL src/COMPONENT/CASE-DETELS-MODAL src/COMPONENT/DeleteCaseModal src/COMPONENT/CHANGE-ROLE-MODAL
git commit -m "feat: admin table with side drawer and Arabic confirmations"
```

**C-agent prompt (C-Admin):**

```
نفّذ Task 4 فقط من docs/superpowers/plans/2026-08-31-hidaya-ux-rebuild.md
استهلك src/lib و src/COMPONENT/UI.
لا تعدّل App.jsx ولا NavBar ولا صفحات المستفيد.
CaseDrawer إجباري. ممنوع onClose فارغ.
المسؤولون لـ superAdmin فقط بما فيها قائمة الموبايل.
ارجع: سلوك اللوحة + نتيجة البناء.
```

---

### Task 5: صقل مشترك (C-Polish) — بعد دمج 2 و 3 و 4

**Files:** أي ملف من 2–4 فيه فجوة مواصفة فقط. لا تعيد تصميم. لا تضيف ميزات.

**Interfaces:** Consumes المنتج المدموج. Produces: قائمة تحقق المواصفة قسم 12 تمر.

- [ ] **Step 1: امسح إنجليزي ظاهر**

ابحث:

```bash
rg -n "Login|Register|Password|Phone Numper|Charity Member|forgit|The Email|User not found|error " src/COMPONENT --glob "*.jsx"
```

بدّل أي نص مستخدم ظاهر بعربي من المواصفة.

- [ ] **Step 2: titles**

`useEffect` على الصفحات الأساسية:

- باب: `جمعية الهداية`
- دخول: `تسجيل الدخول — جمعية الهداية`
- تقديم: `تقديم طلب — جمعية الهداية`
- متابعة: `متابعة الطلب — جمعية الهداية`
- حالات: `الحالات — جمعية الهداية`

- [ ] **Step 3: تحقق يدوي سريع**

- موبايل ~390: باب، تقديم، متابعة. أزرار ≥ 44px.  
- مكتب ~1280: جدول + لوحة.  
- تاب خلال التقديم. Escape للوحة.  
- تباين Ink على Body وقطن على Accent.  
- `prefers-reduced-motion` موجود من Task 1.

- [ ] **Step 4: `npm test && npm run build`**

Expected: PASS / ينجح.

- [ ] **Step 5: Commit**

```bash
git add -u
git commit -m "fix: Arabic copy, page titles, and spec checklist gaps"
```

**C-agent prompt (C-Polish):**

```
نفّذ Task 5 فقط من docs/superpowers/plans/2026-08-31-hidaya-ux-rebuild.md
بعد ما Tasks 2–4 اتحطوا. لا تعيد تصميم. سكّ المواصفة قسم 8 و 10 و 12.
ارجع: قائمة الفجوات التي أُغلقت + نتيجة npm test و build.
```

---

## ترتيب التشغيل

```
C-0 Foundation          ──►  [merge]
                            ├── C-Door     Task 2  ─┐
                            ├── C-User     Task 3  ─┼─► merge ──► C-Polish Task 5
                            └── C-Admin    Task 4  ─┘
```

لو C-Door و C-User و C-Admin اشتغلوا على فروع: `feat/hidaya-door` و `feat/hidaya-user` و `feat/hidaya-admin` من نفس commit بتاع Task 1.

---

## مراجعة الخطة مقابل المواصفة

| قسم المواصفة | المهمة |
|---------------|--------|
| 2 مسارات / RTL | 1 + 2 |
| 3 هوية / لوجو / توكنات / خطوط | 1 |
| 4 صدفة / شريط | 1 |
| 5 باب / دخول / بيت / تقديم / متابعة / بروفايل | 2 + 3 |
| 6 إدارة / لوحة / أرشيف / سوبر | 4 |
| 7 مكوّنات | 1 |
| 8 أخطاء | 2 + 3 + 5 |
| 9 `archived: false` | 3 |
| 10 حذف الإنجليزي القديم | 2 + 3 + 5 |
| 11 مراحل | موجات الوكلاء |
| 12 اختبار | 1 tests + 5 يدوي |
| 13 HTML/خطوط | 1 |
| 14 خارج النطاق | لا مهمة ترفع صور أو بوش |
