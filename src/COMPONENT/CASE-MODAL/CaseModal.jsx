import { useContext } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useFormik } from "formik";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import { AuthContext } from "../CONTEXT/Context";
import { Button } from "../UI/Button.jsx";
import { Field } from "../UI/Field.jsx";
import { CASE_TYPES, SUPPORT_TYPES } from "../../lib/caseFields.js";
import {
  isValidName,
  isValidNationalId,
  isValidPhone,
  MSG,
} from "../../lib/validation.js";

export default function CaseModal({
  open,
  setOpen,
  selectedCase,
  getCases,
  setSelectedCase,
}) {
  const { user } = useContext(AuthContext);

  const closeModal = () => {
    setSelectedCase(null);
    setOpen(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      userName: selectedCase?.userName || "",
      phone: selectedCase?.phone || "",
      address: selectedCase?.address || "",
      nationalId: selectedCase?.nationalId || "",
      caseType: selectedCase?.caseType || "",
      supportType: selectedCase?.supportType || "",
      notes: selectedCase?.notes || "",
      status: selectedCase?.status || "pending",
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
    onSubmit: async (values, { resetForm }) => {
      try {
        if (selectedCase) {
          await updateDoc(doc(db, "cases", selectedCase.id), { ...values });
          toast.success("تم تعديل الحالة");
        } else {
          await addDoc(collection(db, "cases"), {
            ...values,
            userId: user.uid,
            archived: false,
            completed: false,
            createdAt: serverTimestamp(),
          });
          toast.success("تمت إضافة الحالة");
        }
        resetForm();
        closeModal();
        await getCases();
      } catch {
        toast.error(MSG.network);
      }
    },
  });

  return (
    <Dialog open={open} onClose={closeModal} className="relative z-[70]">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative w-full max-w-2xl rounded-[14px] border border-[#D5DFD9] bg-white shadow-lg">
            <div className="border-b border-[#D5DFD9] p-6">
              <h2 className="font-heading text-2xl font-bold leading-normal text-[#1C211E]">
                {selectedCase ? "تعديل البيانات" : "إضافة حالة"}
              </h2>
              <p className="mt-1 text-sm text-[#3F5349]">
                اكتب بيانات الحالة وبعدين احفظ.
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  label="اسم الحالة"
                  name="userName"
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.userName}
                  touched={formik.touched.userName}
                />
                <Field
                  label="رقم الموبايل"
                  name="phone"
                  type="tel"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.phone}
                  touched={formik.touched.phone}
                />
                <Field
                  label="العنوان"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.address}
                  touched={formik.touched.address}
                />
                <Field
                  label="الرقم القومي"
                  name="nationalId"
                  value={formik.values.nationalId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.nationalId}
                  touched={formik.touched.nationalId}
                />
                <Field
                  label="تصنيف الحالة"
                  name="caseType"
                  type="select"
                  value={formik.values.caseType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.caseType}
                  touched={formik.touched.caseType}
                >
                  <option value="">اختر التصنيف</option>
                  {CASE_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
                <Field
                  label="نوع المساعدة"
                  name="supportType"
                  type="select"
                  value={formik.values.supportType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.supportType}
                  touched={formik.touched.supportType}
                >
                  <option value="">اختر النوع</option>
                  {SUPPORT_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
                {selectedCase && (
                  <Field
                    label="حالة الطلب"
                    name="status"
                    type="select"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="pending">قيد المراجعة</option>
                    <option value="in_progress">جاري التنفيذ</option>
                    <option value="completed">مكتملة</option>
                    <option value="rejected">مرفوضة</option>
                  </Field>
                )}
              </div>

              <Field
                label="ملاحظات"
                name="notes"
                type="textarea"
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <div className="flex flex-col-reverse gap-3 border-t border-[#D5DFD9] pt-4 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  إلغاء
                </Button>
                <Button type="submit" loading={formik.isSubmitting}>
                  {selectedCase ? "حفظ التغييرات" : "حفظ الحالة"}
                </Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
