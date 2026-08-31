import { useEffect } from "react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../firebase";
import { Button } from "../UI/Button.jsx";
import { Field } from "../UI/Field.jsx";
import { PageHeading } from "../UI/PageHeading.jsx";
import { isValidEmail, MSG } from "../../lib/validation.js";

export default function ForgotPassword() {
  useEffect(() => {
    document.title = "نسيت كلمة السر — جمعية الهداية";
  }, []);

  const formik = useFormik({
    initialValues: { email: "" },
    validate: (values) => {
      const errors = {};
      if (!isValidEmail(values.email)) errors.email = MSG.email;
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await sendPasswordResetEmail(auth, values.email);
        toast.success("بعتنا رابط على بريدك");
      } catch {
        toast.error(MSG.network);
      }
    },
  });

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-[14px] border border-[#D5DFD9] bg-white p-6">
        <PageHeading className="mb-3 text-center">نسيت كلمة السر؟</PageHeading>
        <p className="mb-6 text-center text-sm text-[#3F5349]">
          اكتب بريدك ونبعت لك رابط إعادة التعيين.
        </p>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Field
            label="البريد"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
          />
          <Button type="submit" className="w-full" loading={formik.isSubmitting}>
            إرسال الرابط
          </Button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-[#1F5C45]">
            الرجوع لتسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
