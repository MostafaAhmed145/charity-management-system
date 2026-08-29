import React, { useContext } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import {
  X,
  User,
  Phone,
  CreditCard,
  HeartHandshake,
  FileText,
  CalendarDays,
  Mail,
} from "lucide-react";
import { AuthContext } from "../CONTEXT/Context";

export default function CaseDetailsModal({
  openDetails,
  setOpenDetails,
  selectedCase,
}) {


const { getStatus } = useContext(AuthContext);
if (!openDetails || !selectedCase) return null;


const status = getStatus(selectedCase.status)

  return (
    <Dialog
      open={openDetails}
      onClose={() => setOpenDetails(false)}
      className="relative z-50"
    >
      {/* الخلفية */}
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* مكان المودال */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          dir="rtl"
          className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                تفاصيل الحالة
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                جميع بيانات مقدم الطلب
              </p>
            </div>

            <button
              onClick={() => setOpenDetails(false)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
            >
              <X size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-7">

            {/* بيانات مقدم الطلب */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <User className="text-blue-600" size={21} />

                <h3 className="font-bold text-gray-800">
                  بيانات مقدم الطلب
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">
                    الاسم
                  </p>

                  <p className="font-semibold text-gray-800">
                    {selectedCase.userName || "غير متوفر"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">
                    الرقم القومي
                  </p>

                  <p dir="ltr" className="font-semibold text-gray-800">
                    {selectedCase.nationalId || "غير متوفر"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">
                    رقم الهاتف
                  </p>

                  <p dir="ltr" className="font-semibold text-gray-800">
                    {selectedCase.phone || "غير متوفر"}
                  </p>
                </div>

                

              </div>
            </section>

            {/* بيانات الحالة */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <HeartHandshake
                  className="text-green-600"
                  size={21}
                />

                <h3 className="font-bold text-gray-800">
                  بيانات الحالة
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">
                    تصنيف الحالة
                  </p>

                  <p className="font-semibold text-gray-800">
                    {selectedCase.caseType || "غير متوفر"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">
                    نوع المساعدة
                  </p>

                  <p className="font-semibold text-gray-800">
                    {selectedCase.supportType || "غير متوفر"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">
                    حالة الطلب
                  </p>

                  <p className={`font-semibold text-gray-800 ${status.className} flex justify-center items-center gap-1 w-fit p-1 rounded-xl`}>
                    <status.icon size={16} />
                    { status.text || "غير متوفر"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">
                    تاريخ تقديم الطلب
                  </p>

                  <p className="font-semibold text-gray-800">
                    {selectedCase.createdAt?.toDate
                      ? selectedCase.createdAt
                          .toDate()
                          .toLocaleDateString("ar-EG")
                      : "غير متوفر"}
                  </p>
                </div>

              </div>
            </section>

            {/* الملاحظات */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <FileText
                  className="text-purple-600"
                  size={21}
                />

                <h3 className="font-bold text-gray-800">
                  الملاحظات
                </h3>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-gray-700 leading-7 min-h-20">
                {selectedCase.notes || "لا توجد ملاحظات"}
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end">
            <button
              onClick={() => setOpenDetails(false)}
              className="px-5 py-2.5 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition cursor-pointer"
            >
              إغلاق
            </button>
          </div>

        </DialogPanel>
      </div>
    </Dialog>
  );
}