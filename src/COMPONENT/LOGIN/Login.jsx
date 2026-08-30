import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { Link, Navigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import app from "../../firebase";
import { AuthContext } from "../CONTEXT/Context";
import { Button } from "../UI/Button.jsx";
import { Field } from "../UI/Field.jsx";
import { LogoLockup } from "../UI/LogoLockup.jsx";
import { PageHeading } from "../UI/PageHeading.jsx";
import { isValidEmail, isValidPassword, MSG } from "../../lib/validation.js";

export default function Login() {
  const { user, role } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    document.title = "تسجيل الدخول — جمعية الهداية";
  }, []);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validate: (values) => {
      const errors = {};
      if (!isValidEmail(values.email)) errors.email = MSG.email;
      if (!isValidPassword(values.password)) errors.password = MSG.password;
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast.success("تم تسجيل الدخول بنجاح");
      } catch {
        toast.error(MSG.loginFailed);
      }
    },
  });

  const loginGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("تم تسجيل الدخول بنجاح");
    } catch {
      toast.error(MSG.network);
    }
  };

  if (user && (role === "admin" || role === "superAdmin")) {
    return <Navigate to="/dashBoard" replace />;
  }
  if (user && role === "user") {
    return <Navigate to="/userHome" replace />;
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-[14px] border border-[#D5DFD9] bg-white p-6">
        <div className="mb-6 flex justify-center">
          <LogoLockup size={36} showWord />
        </div>
        <PageHeading className="mb-6 text-center">تسجيل الدخول</PageHeading>

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
            autoComplete="email"
          />
          <Field
            label="كلمة السر"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="text-sm text-[#1F5C45]"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
          </button>

          <Link to="/ForgotPassword" className="block text-sm text-[#1F5C45]">
            نسيت كلمة السر؟
          </Link>

          <Button type="submit" className="w-full" loading={formik.isSubmitting}>
            دخول
          </Button>

          <Button type="button" variant="secondary" className="w-full" onClick={loginGoogle}>
            <FcGoogle size={20} />
            الدخول بجوجل
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#3F5349]">
          ما عندكش حساب؟{" "}
          <Link to="/register" className="text-[#1F5C45]">
            إنشاء حساب
          </Link>
        </p>
      </div>
    </div>
  );
}
