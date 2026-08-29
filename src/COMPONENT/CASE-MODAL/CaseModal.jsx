import React, { useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { X } from "lucide-react";
import { useFormik } from "formik";
import { db } from "../../firebase";
import { addDoc, collection, doc, updateDoc , serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../CONTEXT/Context";
import * as Yup from "yup";

export default function CaseModal({ open, setOpen , selectedCase , getCases , setSelectedCase}) {



  const { user } = useContext(AuthContext);

  const validationSchema = Yup.object({
  userName: Yup.string()
    .trim()
    .required("اسم الحالة مطلوب")
    .min(3, "اسم الحالة يجب أن يكون 3 أحرف على الأقل"),

  phone: Yup.string()
    .trim()
    .required("رقم الهاتف مطلوب")
    .matches(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صحيح"),

  address: Yup.string()
    .trim()
    .required("العنوان مطلوب"),

  nationalId: Yup.string()
    .trim()
    .required("الرقم القومي مطلوب")
    .matches(/^[0-9]{14}$/, "الرقم القومي يجب أن يكون 14 رقم"),

  caseType: Yup.string()
    .required("يجب اختيار تصنيف الحالة"),

  supportType: Yup.string()
    .required("يجب اختيار نوع المساعدة"),

  notes: Yup.string()
    .trim(),
});
  

  const formik = useFormik({
    initialValues : {
      
      userName: "",
      phone: "",
      address: "",
      nationalId: "",
      caseType: "",
      supportType: "",
      notes: "", 
      status: "pending",

    } , 

    onSubmit : async (values , { resetForm })=>{
       console.log("values" , values);


       try{

        if (selectedCase) {
          await updateDoc(doc(db , "cases" , selectedCase.id) , {
            ...values
          })

          toast.success("تم تعديل الحالة");
          resetForm();
          await getCases()
           setOpen(false);
        }else{
          await addDoc(collection(db, "cases"), {
           ...values , 
           userId: user.uid,
           createdAt : serverTimestamp()
         });

         toast.success("تمت إضافة الحالة")
         resetForm();
         setOpen(false);
        await getCases()

        }
 
       }
       catch(err){
          toast.error(err.message)
       }

       
    } ,

    validationSchema
  })


  useEffect(() => {
  if (selectedCase) {
    formik.setValues({
      userName: selectedCase.userName || "",
      phone: selectedCase.phone || "",
      address: selectedCase.address || "",
      nationalId: selectedCase.nationalId || "",
      caseType: selectedCase.caseType || "",
      supportType: selectedCase.supportType || "",
      notes: selectedCase.notes || "",
      status: selectedCase.status || "pending",
    });
  }else{
    formik.resetForm();
  }
}, [selectedCase]);
  return (
    <Dialog open={open} onClose={() => {}} className="relative z-50">

      <DialogBackdrop className="fixed inset-0 bg-black/50 transition-opacity" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">

          <DialogPanel className="relative w-full max-w-2xl rounded-xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* زرار الإغلاق */}
            <button
              type="button"
              onClick={() => {setSelectedCase(null) ; setOpen(false) }}
              className="absolute top-4 left-4 cursor-pointer flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-red-600"
            >
              <X size={20} />
            </button>

            <div dir="rtl" className="p-6">
  {/* العنوان */}
  <div className="mb-6 border-b border-gray-200 pb-4">
    <h2 className="text-2xl font-bold text-gray-800">
    
         {selectedCase ? "تعديل البيانات" : "إضافة حالة"}

    </h2>
    <p className="mt-1 text-sm text-gray-500">
      قم بإدخال بيانات الحالة ثم اضغط على حفظ.
    </p>
  </div>

  <form onSubmit={formik.handleSubmit} className="space-y-5">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      <div>
        
        <input
          type="text"
          name="userName"
          value={formik.values.userName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="أدخل اسم الحالة"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />

        {formik.touched.userName && formik.errors.userName && (
        <p className="mt-1 text-sm text-red-500">
          {formik.errors.userName}
        </p>
      )}

      </div>

      <div>
  
        <input
          type="tel"
          name="phone"
          placeholder="أدخل رقم الهاتف"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />

        {formik.touched.phone && formik.errors.phone && (
        <p className="mt-1 text-sm text-red-500">
          {formik.errors.phone}
        </p>
      )}
      </div>


      
      <div>
    
        <input
          type="text"
          name="address"
          placeholder="أدخل العنوان"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />

        {formik.touched.address && formik.errors.address && (
  <p className="mt-1 text-sm text-red-500">
    {formik.errors.address}
  </p>
)}
      </div>

      <div>
    
        <input
          type="text"
          value={formik.values.nationalId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="nationalId"
          placeholder="أدخل الرقم القومي"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />

        {formik.touched.nationalId && formik.errors.nationalId && (
  <p className="mt-1 text-sm text-red-500">
    {formik.errors.nationalId}
  </p>
)}
      </div>

    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      <div>
      
        <select
        name="caseType"
        value={formik.values.caseType}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
          <option value="">اختر نوع الحالة</option>
          <option value="أرملة">أرملة</option>
          <option value="مطلقة">مطلقة</option>
          <option value="يتيم">يتيم</option>
          <option value="ذوي احتياجات خاصة">ذوي احتياجات خاصة</option>
          <option value="أسرة محدودة الدخل">أسرة محدودة الدخل</option>
          <option value="شئ اخر"> شئ اخر </option>
        </select>

        {formik.touched.caseType && formik.errors.caseType && (
        <p className="mt-1 text-sm text-red-500">
          {formik.errors.caseType}
        </p>
      )}
      </div>

      <div>
       
        <select
        name="supportType"
        value={formik.values.supportType}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
          <option value="">اختر نوع المساعدة</option>
          <option value="مساعدة مالية">مساعدة مالية</option>
          <option value="مواد غذائية">مواد غذائية</option>
          <option value="علاج">علاج</option>
          <option value="مصروفات تعليم">مصروفات تعليم</option>
          <option value="تجهيز عرائس">تجهيز عرائس</option>
          <option value="شئ اخر"> شئ اخر </option>
        </select>

        {formik.touched.supportType && formik.errors.supportType && (
  <p className="mt-1 text-sm text-red-500">
    {formik.errors.supportType}
  </p>
)}
      </div>


       {selectedCase ? <div>  
        <select
        name="status"
        value={formik.values.status}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}

        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
          <option value=""> حالة الطلب </option>
          <option value="pending">قيد المراجعة</option>
          <option value="in_progress">جاري التنفيذ</option>
          <option value="completed">مكتملة</option>
          <option value="rejected">مرفوضة</option>
        </select>
      </div>  : ""}

    </div>

    <div>
      

      <textarea
        rows="4"
        name="notes"
        value={formik.values.notes}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="اكتب أي ملاحظات إضافية..."
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none resize-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      ></textarea>
    </div>

    <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">

      <button
        type="button"
        onClick={() => setOpen(false)}
        className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
      >
        إلغاء
      </button>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="rounded-xl bg-blue-600 px-6 py-3 cursor-pointer font-medium text-white transition hover:bg-blue-700"
      >
        {selectedCase ? "حفظ التغيرات" : "حفظ الحاله"}
         
      </button>

    </div>

  </form>
</div>

          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}