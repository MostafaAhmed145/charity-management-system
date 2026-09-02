import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { Link, Navigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import app from "../../firebase";
import { AuthContext } from "../CONTEXT/Context";
import Loading from "../LOADING/Loading";
import { Button } from "../UI/Button.jsx";
import { Field } from "../UI/Field.jsx";
import { LogoLockup } from "../UI/LogoLockup.jsx";
import { PageHeading } from "../UI/PageHeading.jsx";
import { getAuthErrorMessage } from "../../lib/authErrors";
import { signInWithGoogle } from "../../lib/googleAuth.js";
import { ensureUserProfile } from "../../lib/ensureUserProfile.js";
import { homeForRole } from "../../lib/resolveRole.js";
import { isValidEmail, MSG } from "../../lib/validation.js";

export default function Login() {
  const { user, role, loading, refreshSession } = useContext(AuthContext);
  const [googleLoading, setGoogleLoading] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    document.title = "تسجيل الدخول — جمعية الهداية";
  }, []);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validate: (values) => {
      const errors = {};
      if (!isValidEmail(values.email)) errors.email = MSG.email;
      if (!String(values.password ?? "").trim()) errors.password = MSG.required;
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        await ensureUserProfile(auth.currentUser);
        await refreshSession();
        toast.success("تم تسجيل الدخول بنجاح");
      } catch (err) {
        toast.error(getAuthErrorMessage(err));
      }
    },
  });

  const loginGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle(auth);
      await refreshSession();
      toast.success("تم تسجيل الدخول بنجاح");
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
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 pb-10 pt-20">
      <div className="rounded-[14px] border border-[#D5DFD9] bg-white p-6">
        <div className="mb-6 flex justify-center">
          <LogoLockup
            size={56}
            showWord
            variant="hero"
            wordClassName="text-[#1F5C45]"
          />
        </div>
        <PageHeading className="mb-6 text-center">تسجيل الدخول</PageHeading>

        <Button type="button" variant="secondary" className="w-full" loading={googleLoading} onClick={loginGoogle}>
          <FcGoogle size={20} />
          الدخول باستخدام Google
        </Button>

        <p className="my-5 text-center text-sm text-[#3F5349]">أو بالبريد</p>

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
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
            autoComplete="current-password"
          />

          <Link to="/forgot-password" className="block text-sm text-[#1F5C45]">
            نسيت كلمة السر؟
          </Link>

          <Button type="submit" className="w-full" loading={formik.isSubmitting}>
            دخول
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#3F5349]">
          ليس لديك حساب ؟ {" "}
          <Link to="/register" className="
            inline-flex items-center justify-center
            rounded-lg
            bg-[#08945e]
            px-5 py-2.5
            text-sm font-semibold text-white
          
            transition-all duration-300
            hover:bg-[#0aa968]
                hover:-translate-y-0.5
              "
            >
              انشئ حساب 
            </Link>

          
        </p>
      </div>
    </div>
  );
}
