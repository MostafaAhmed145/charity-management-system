import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../CONTEXT/Context";
import Loading from "../LOADING/Loading";
import { Button } from "../UI/Button.jsx";
import { PageHeading } from "../UI/PageHeading.jsx";

export default function Profile() {
  const { loading, user, userData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "الملف — جمعية الهداية";
  }, []);

  if (loading) return <Loading />;

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-[#3F5349]">
        الحساب مش موجود
      </div>
    );
  }

  const name = userData?.name || user.displayName || "";
  const letter = name.trim().charAt(0) || "؟";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-[14px] border border-[#D5DFD9] bg-white p-8 text-center">
        <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-[#D5DFD9] bg-[#E6EEE9] text-3xl font-bold text-[#1F5C45]">
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
          ) : (
            letter
          )}
        </div>
        <PageHeading className="mt-4">{name || "عضو الجمعية"}</PageHeading>
        <div className="mt-6 space-y-3 text-right text-sm">
          <p className="rounded-[12px] bg-[#F4F4F2] p-3">البريد: {user.email}</p>
          <p className="rounded-[12px] bg-[#F4F4F2] p-3">
            الهاتف: {userData?.phone || "غير مسجّل"}
          </p>
        </div>
        <Button className="mt-6 w-full" onClick={() => navigate("/edit-profile")}>
          تعديل الملف
        </Button>
      </div>
    </div>
  );
}
