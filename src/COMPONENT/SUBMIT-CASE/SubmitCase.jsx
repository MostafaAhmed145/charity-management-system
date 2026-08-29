import React, { useState } from "react";
import { useFormik } from "formik";
import { db } from "../../firebase";
import { useContext } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../CONTEXT/Context";
import { toast } from "react-toastify";

export default function SubmitCase() {

  const { user } = useContext(AuthContext)
  const [loading , setLoading ] = useState(false)

   
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

    onSubmit: async (values) => {
      try{
              console.log("Submit Case:", values);

              if (!user) {
              toast.error("User is not logged in");
              return;
            }

            setLoading(true) 

      await addDoc(collection(db , "cases") , {
        ...values ,
        userId: user.uid,
        status: "pending",
        completed: false,
        createdAt: serverTimestamp(),
      })

      console.log("Case submitted successfully");

      toast.success("تم تقديم الطلب بنجاح")

      

       formik.resetForm();
      }catch(err){
             console.log("Error submitting case:", err);
             toast.error(" حدث خطا ما اثناء تقديم الطلب حاول مره اخري او راسل المختص")
        
            }finally{
        setLoading(false)
      }
    },

    validate: (values) => {
      const errors = {};

      const regxName = /^[a-zA-Z\u0600-\u06FF\s]{3,50}$/;
      const regxPhone = /^01[0125][0-9]{8}$/;
      const regxNationalId = /^[0-9]{14}$/;

      if (!regxName.test(values.userName)) {
        errors.userName = "برجاء إدخال اسم صحيح";
      }

      if (!regxPhone.test(values.phone)) {
        errors.phone = "رقم الهاتف غير صحيح";
      }

      if (!values.address.trim()) {
        errors.address = "برجاء إدخال العنوان";
      }

      if (!regxNationalId.test(values.nationalId)) {
        errors.nationalId = "الرقم القومي يجب أن يكون 14 رقم";
      }

      if (!values.caseType) {
        errors.caseType = "برجاء اختيار نوع الحالة";
      }

      if (!values.supportType) {
        errors.supportType = "برجاء اختيار نوع المساعدة";
      }

      return errors;
    },
  });

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-100 py-10 px-4 mt-7"
    >
      <div className="mx-auto w-full max-w-4xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            تقديم طلب مساعدة
          </h1>

          <p className="mt-2 text-sm md:text-base text-gray-500">
            قم بإدخال بياناتك وبيانات طلب المساعدة بشكل صحيح.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 md:p-8">

          <form
            onSubmit={formik.handleSubmit}
            className="space-y-8"
          >

            {/* البيانات الشخصية */}
            <section>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  البيانات الأساسية
                </h2>

                <div className="mt-2 h-1 w-12 rounded-full bg-blue-600"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* الاسم */}
                <div>
                  <input
                    type="text"
                    name="userName"
                    value={formik.values.userName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="أدخل اسم الحالة"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  {formik.touched.userName && formik.errors.userName && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors.userName}
                    </p>
                  )}
                </div>

                {/* الهاتف */}
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="أدخل رقم الهاتف"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  {formik.touched.phone && formik.errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors.phone}
                    </p>
                  )}
                </div>

                {/* العنوان */}
                <div>
                  <input
                    type="text"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="أدخل العنوان"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  {formik.touched.address && formik.errors.address && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors.address}
                    </p>
                  )}
                </div>

                {/* الرقم القومي */}
                <div>
                  <input
                    type="text"
                    name="nationalId"
                    value={formik.values.nationalId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="أدخل الرقم القومي"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  {formik.touched.nationalId &&
                    formik.errors.nationalId && (
                      <p className="mt-1 text-sm text-red-500">
                        {formik.errors.nationalId}
                      </p>
                    )}
                </div>

              </div>
            </section>

            {/* تفاصيل الطلب */}
            <section>

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  تفاصيل طلب المساعدة
                </h2>

                <div className="mt-2 h-1 w-12 rounded-full bg-blue-600"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* نوع الحالة */}
                <div>
                  <select
                    name="caseType"
                    value={formik.values.caseType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">
                      اختر نوع الحالة
                    </option>

                    <option>أرملة</option>
                    <option>مطلقة</option>
                    <option>يتيم</option>
                    <option>ذوي احتياجات خاصة</option>
                    <option>أسرة محدودة الدخل</option>
                  </select>

                  {formik.touched.caseType &&
                    formik.errors.caseType && (
                      <p className="mt-1 text-sm text-red-500">
                        {formik.errors.caseType}
                      </p>
                    )}
                </div>

                {/* نوع المساعدة */}
                <div>
                  <select
                    name="supportType"
                    value={formik.values.supportType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">
                      اختر نوع المساعدة
                    </option>

                    <option>مساعدة مالية</option>
                    <option>مواد غذائية</option>
                    <option>علاج</option>
                    <option>مصروفات تعليم</option>
                    <option>تجهيز عرائس</option>
                  </select>

                  {formik.touched.supportType &&
                    formik.errors.supportType && (
                      <p className="mt-1 text-sm text-red-500">
                        {formik.errors.supportType}
                      </p>
                    )}
                </div>

              </div>

              {/* الملاحظات */}
              <div className="mt-5">

                <textarea
                  rows="5"
                  name="notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="اكتب أي تفاصيل أو ملاحظات إضافية..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none resize-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                ></textarea>

              </div>

            </section>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-gray-100 pt-6">

              <button
                type="button"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto rounded-xl border border-gray-300 bg-white px-7 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto rounded-xl cursor-pointer bg-blue-600 px-7 py-3 font-medium text-white transition hover:bg-blue-700"
              >
                  {loading ? "جاري إرسال الطلب..." : "إرسال الطلب"}
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
}