import { useCallback, useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import { AuthContext } from "../CONTEXT/Context";
import { Button } from "../UI/Button.jsx";
import { ConfirmDialog } from "../UI/ConfirmDialog.jsx";
import { Field } from "../UI/Field.jsx";
import { PageHeading } from "../UI/PageHeading.jsx";
import { PhoneConfirmDialog } from "../UI/PhoneConfirmDialog.jsx";
import { CASE_TYPES, SUPPORT_TYPES } from "../../lib/caseFields.js";
import {
  isValidName,
  isValidNationalId,
  isValidPhone,
  MSG,
} from "../../lib/validation.js";

export default function SubmitCase() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    document.title = "تقديم طلب — جمعية الهداية";
  }, []);

  const saveCase = useCallback(async (values) => {
    if (!user) {
      toast.error("سجّل دخولك الأول");
      return;
    }
    try {
      await addDoc(collection(db, "cases"), {
        ...values,
        userId: user.uid,
        status: "pending",
        completed: false,
        archived: false,
        createdAt: serverTimestamp(),
      });
      toast.success("تم تقديم الطلب بنجاح");
      navigate("/my-cases");
    } catch {
      toast.error(MSG.network);
    }
  }, [navigate, user]);

  const formik = useFormik({
    initialValues: {
      userName: "",
      phone: "",
      address: "",
      nationalId: "",
      caseType: "",
      supportType: "",
      notes: "",
    },
    validate: (values) => {
      const errors = {};
      if (!isValidName(values.userName)) errors.userName = MSG.name;
      if (!isValidPhone(values.phone)) errors.phone = MSG.phone;
      if (!String(values.address || "").trim()) errors.address = MSG.required;
      if (!isValidNationalId(values.nationalId)) errors.nationalId = MSG.nationalId;
      if (!values.caseType) errors.caseType = MSG.required;
      if (!values.supportType) errors.supportType = MSG.required;
      return errors;
    },
    onSubmit: saveCase,
  });

  const stepFields = [
    ["userName", "phone", "address", "nationalId"],
    ["caseType", "supportType"],
  ];

  const goNext = async () => {
    const fields = stepFields[step];
    const errors = await formik.validateForm();
    fields.forEach((name) => formik.setFieldTouched(name, true));
    if (fields.some((name) => errors[name])) return;
    setStep((s) => s + 1);
  };

  const cancel = () => {
    const dirty = Object.values(formik.values).some((v) => String(v).trim());
    if (dirty) {
      setCancelOpen(true);
      return;
    }
    navigate("/user-home");
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <PageHeading>تقديم طلب مساعدة</PageHeading>
      <p className="mt-2 mb-6 text-sm text-[#3F5349]">الخطوة {step + 1} من 3</p>
      <div className="mb-6 flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-[#1F5C45]" : "bg-[#D5DFD9]"}`}
          />
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step === 2) setPhoneOpen(true);
        }}
        className="space-y-4 rounded-[14px] border border-[#D5DFD9] bg-white p-5"
      >
        {step === 0 && (
          <>
            <Field label="اسم الحالة" name="userName" value={formik.values.userName} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.userName} touched={formik.touched.userName} />
            <Field label="رقم الموبايل" name="phone" type="tel" value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.phone} touched={formik.touched.phone} />
            <Field label="العنوان" name="address" value={formik.values.address} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.address} touched={formik.touched.address} />
            <Field label="الرقم القومي" name="nationalId" value={formik.values.nationalId} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.nationalId} touched={formik.touched.nationalId} />
          </>
        )}

        {step === 1 && (
          <>
            <Field label="تصنيف الحالة" name="caseType" type="select" value={formik.values.caseType} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.caseType} touched={formik.touched.caseType}>
              <option value="">اختر التصنيف</option>
              {CASE_TYPES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Field>
            <Field label="نوع المساعدة" name="supportType" type="select" value={formik.values.supportType} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.supportType} touched={formik.touched.supportType}>
              <option value="">اختر النوع</option>
              {SUPPORT_TYPES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Field>
            <Field label="ملاحظات" name="notes" type="textarea" value={formik.values.notes} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          </>
        )}

        {step === 2 && (
          <dl className="space-y-3 text-sm">
            {[
              ["الاسم", formik.values.userName],
              ["الموبايل", formik.values.phone],
              ["العنوان", formik.values.address],
              ["الرقم القومي", formik.values.nationalId],
              ["التصنيف", formik.values.caseType],
              ["نوع المساعدة", formik.values.supportType],
              ["ملاحظات", formik.values.notes || "لا توجد"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[#3F5349]">{label}</dt>
                <dd className="font-medium text-[#1C211E]">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-[#D5DFD9] pt-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={step === 0 ? cancel : () => setStep((s) => s - 1)}>
            {step === 0 ? "إلغاء" : "السابق"}
          </Button>
          {step < 2 ? (
            <Button type="button" onClick={goNext}>التالي</Button>
          ) : (
            <Button type="submit">إرسال الطلب</Button>
          )}
        </div>
      </form>
      <PhoneConfirmDialog
        open={phoneOpen}
        onClose={() => setPhoneOpen(false)}
        phone={formik.values.phone}
        loading={sending}
        onConfirm={async (phone) => {
          setSending(true);
          try {
            formik.setFieldValue("phone", phone, false);
            await saveCase({ ...formik.values, phone });
            setPhoneOpen(false);
          } finally {
            setSending(false);
          }
        }}
      />
      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => navigate("/user-home")}
        title="إلغاء الطلب"
        body="هتلغي الطلب؟ البيانات اللي كتبتها مش هتتحفظ."
        confirmLabel="إلغاء الطلب"
        danger
      />
    </div>
  );
}
