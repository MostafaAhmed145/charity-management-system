import { useContext, useEffect } from "react";
import { useFormik } from "formik";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../CONTEXT/Context";
import Loading from "../LOADING/Loading";
import { Button } from "../UI/Button.jsx";
import { Field } from "../UI/Field.jsx";
import { PageHeading } from "../UI/PageHeading.jsx";
import { isValidName, isValidPhone, MSG } from "../../lib/validation.js";

export default function EditProfile() {
  const { user, loading, userData, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "تعديل الملف — جمعية الهداية";
  }, []);

  const formik = useFormik({
    initialValues: {
      name: userData?.name || user?.displayName || "",
      email: user?.email || "",
      phone: userData?.phone || "",
    },
    validate: (values) => {
      const errors = {};
      if (!isValidName(values.name)) errors.name = MSG.name;
      if (!isValidPhone(values.phone)) errors.phone = MSG.phone;
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await updateProfile(user, {
          displayName: values.name,
        });

        await setDoc(
          doc(db, "users", user.uid),
          {
            name: values.name,
            email: user.email,
            phone: values.phone,
          },
          { merge: true }
        );

        if (typeof setUserData === "function") {
          setUserData({
            ...(userData || {}),
            name: values.name,
            phone: values.phone,
          });
        }

        toast.success("تم حفظ التعديلات");
        navigate("/profile");
      } catch {
        toast.error(MSG.network);
      }
    },
  });

  useEffect(() => {
    const getUserData = async () => {
      if (!user) return;

      const docSnap = await getDoc(doc(db, "users", user.uid));

      if (docSnap.exists()) {
        const data = docSnap.data();
        formik.setValues({
          name: data.name || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
        });
      }
    };

    getUserData();
    // formik identity changes every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-[14px] border border-[#D5DFD9] bg-white p-6">
        <PageHeading className="mb-6 text-center">تعديل الملف</PageHeading>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Field
            label="الاسم"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.name}
            touched={formik.touched.name}
          />
          <Field
            label="البريد"
            name="email"
            type="email"
            value={formik.values.email}
            disabled
          />
          <Field
            label="الموبايل"
            name="phone"
            type="tel"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.phone}
            touched={formik.touched.phone}
          />
          <Button type="submit" className="w-full" loading={formik.isSubmitting}>
            حفظ التعديلات
          </Button>
        </form>
      </div>
    </div>
  );
}
