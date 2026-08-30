import {
  Clock3,
  LoaderCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const STATUS_MAP = {
  pending: {
    text: "قيد المراجعة",
    className: "bg-[#F3E6B8] text-[#6B5420]",
    icon: Clock3,
  },
  in_progress: {
    text: "جاري التنفيذ",
    className: "bg-[#E6EEE9] text-[#3F5349]",
    icon: LoaderCircle,
  },
  approved: {
    text: "جاري التنفيذ",
    className: "bg-[#E6EEE9] text-[#3F5349]",
    icon: LoaderCircle,
  },
  completed: {
    text: "مكتمل",
    className: "bg-[#E6EEE9] text-[#1F5C45]",
    icon: CheckCircle2,
  },
  rejected: {
    text: "مرفوض",
    className: "bg-[#F4F4F2] text-[#8B3A2F]",
    icon: XCircle,
  },
};

const DEFAULT_STATUS = {
  text: "غير معروف",
  className: "bg-[#E6EEE9] text-[#3F5349]",
  icon: Clock3,
};

export function getStatus(status) {
  return STATUS_MAP[status] ?? DEFAULT_STATUS;
}

export function statusReassurance(status) {
  switch (status) {
    case "pending":
      return "لسه بنراجع البيانات. هتتبلغ أول ما الحالة تتغير.";
    case "in_progress":
    case "approved":
      return "الطلب اتقبل وبيتنفّذ.";
    case "completed":
      return "الطلب اتقفّل.";
    case "rejected":
      return "الطلب مترفض. لو محتاج توضيح، تواصل واتساب.";
    default:
      return "";
  }
}

export function maskNationalId(nationalId) {
  const str = String(nationalId ?? "");
  if (str.length < 4) return str;
  return "**********" + str.slice(-4);
}
