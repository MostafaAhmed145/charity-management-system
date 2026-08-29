import React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Archive, X } from "lucide-react";

export default function DeletCaseModal({
  openDeletCase,
  setOpenDeletCase,
  handleDelete,
  id,
  selectedCase,
}) {
  return (
    <Dialog
      open={openDeletCase}
      onClose={() => setOpenDeletCase(false)}
      className="relative z-50"
    >
      {/* Overlay */}
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl duration-300 data-closed:scale-95 data-closed:opacity-0"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setOpenDeletCase(false)}
            className="absolute left-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={19} />
          </button>

          {/* Content */}
          <div dir="rtl" className="px-6 pb-6 pt-8 text-center">
            
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <Archive
                size={30}
                className="text-orange-600"
              />
            </div>

            {/* Title */}
            <DialogTitle className="text-xl font-bold text-gray-800">
              أرشفة الحالة
            </DialogTitle>

            {/* Description */}
            <p className="mt-3 text-sm leading-7 text-gray-500">
              هل أنت متأكد من رغبتك في نقل هذه الحالة إلى الأرشيف؟
            </p>

            <div className="mt-4 rounded-xl bg-orange-50 px-4 py-3 text-sm text-orange-700">
              سيتم نقل الحالة إلى الأرشيف ولن تظهر ضمن الحالات الحالية.
            </div>

            {/* Case Name */}
            {selectedCase?.userName && (
              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <p className="text-xs text-gray-400">
                  الحالة
                </p>

                <p className="mt-1 font-semibold text-gray-700">
                  {selectedCase.userName}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              
              <button
                type="button"
                onClick={() => setOpenDeletCase(false)}
                className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpenDeletCase(false);
                  handleDelete(id);
                }}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-medium text-white transition hover:bg-orange-700"
              >
                <Archive size={18} />
                نقل إلى الأرشيف
              </button>

            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}