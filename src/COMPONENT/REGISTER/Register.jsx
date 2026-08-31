import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { Link, Navigate } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import app from "../../firebase";
import { AuthContext } from "../CONTEXT/Context";
import Loading from "../LOADING/Loading";
import { ensureUserProfile } from "../../lib/ensureUserProfile";
import { getAuthErrorMessage } from "../../lib/authErrors";
import { signInWithGoogle } from "../../lib/googleAuth.js";
import { homeForRole } from "../../lib/resolveRole.js";
import { Button } from "../UI/Button.jsx";
import { Field } from "../UI/Field.jsx";
import { LogoLockup } from "../UI/LogoLockup.jsx";
import { PageHeading } from "../UI/PageHeading.jsx";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidPhone,
  MSG,
} from "../../lib/validation.js";

export default function Register() {
  const { user, role, loading, refreshSession } = useContext(AuthContext);
  const auth = getAuth(app);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    document.title = "إنشاء حساب — جمعية الهداية";
  }, []);

  const formik = useFormik({
    initialValues: { name: "", email: "", phone: "", password: "", rePassword: "" },
    validate: (values) => {
      const errors = {};
      if (!isValidName(values.name)) errors.name = MSG.name;
      if (!isValidEmail(values.email)) errors.email = MSG.email;
      if (!isValidPhone(values.phone)) errors.phone = MSG.phone;
      if (!isValidPassword(values.password)) errors.password = MSG.password;
      if (values.rePassword !== values.password) errors.rePassword = MSG.passwordMatch;
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );

        await ensureUserProfile(userCredential.user, {
          name: values.name,
          phone: values.phone,
          email: values.email,
        });
        await refreshSession();

        toast.success("تم إنشاء الحساب");
      } catch (err) {
        toast.error(getAuthErrorMessage(err));
      }
    },
  });

  const registerGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { isNewUser } = await signInWithGoogle(auth);
      await refreshSession();
      toast.success(isNewUser ? "تم إنشاء الحساب" : "تم تسجيل الدخول بنجاح");
    } catch (err) {
      toast.error(getAuthErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  if (loading || (user && !role)) {
    return <Loading />;
  }

  const home = homeForRole(role);
  if (user && home) {
    return <Navigate to={home} replace />;
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-[14px] border border-[#D5DFD9] bg-white p-6">
        <div className="mb-6 flex justify-center">
          <LogoLockup
            size={56}
            showWord
            variant="hero"
            wordClassName="text-[#1F5C45]"
          />
        </div>
        <PageHeading className="mb-6 text-center">إنشاء حساب</PageHeading>

        <Button type="button" variant="secondary" className="w-full" loading={googleLoading} onClick={registerGoogle}>
          <FcGoogle size={20} />
          الدخول باستخدام Google
        </Button>

        <p className="my-5 text-center text-sm text-[#3F5349]">أو بالبريد</p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Field label="الاسم" name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.name} touched={formik.touched.name} />
          <Field label="البريد" name="email" type="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.email} touched={formik.touched.email} />
          <Field label="الموبايل" name="phone" type="tel" value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.phone} touched={formik.touched.phone} />
          <Field label="كلمة السر" name="password" type="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.password} touched={formik.touched.password} autoComplete="new-password" />
          <Field label="تأكيد كلمة السر" name="rePassword" type="password" value={formik.values.rePassword} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.rePassword} touched={formik.touched.rePassword} autoComplete="new-password" />
          <Button type="submit" className="w-full" loading={formik.isSubmitting}>
            إنشاء حساب
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#3F5349]">
          عندك حساب؟{" "}
          <Link to="/login" className="text-[#1F5C45]">
            دخول
          </Link>
        </p>
      </div>
    </div>
  );
}
