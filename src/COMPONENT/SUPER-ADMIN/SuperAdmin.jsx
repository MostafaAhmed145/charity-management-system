import { ShieldCheck, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import ChangeRoleModal from "../CHANGE-ROLE-MODAL/ChangeRoleModal";

export default function SuperAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);  

  const handleOpenRoleModal = (user) => {
  setSelectedUser(user);
  setOpenRoleModal(true);
};


const deleteAcount = async (id)=>{
  try{
    await deleteDoc(doc(db , "users" , id ))

    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== id)
    );

    toast.success("تم حذف الحسابا بنجاح")
  }catch(err){
    toast.error("حدث خطا ما اثناء حذف الحساب")
  }
}
const changeRole = async ()=>{
 if (!selectedUser) return;

 try{
     setRoleLoading(true);

     const newRole  = selectedUser.role === "admin" ? "user" : "admin"

     await updateDoc(doc(db , "users" , selectedUser.id),{
      role : newRole
     })

     

      setUsers((prevUsers) =>
      prevUsers.map((item) =>
        item.id === selectedUser.id
          ? { ...item, role: newRole }
          : item
      )
    );

     setSelectedUser((prev) => ({
      ...prev,
      role: newRole,
    }));

    toast.success("تم تغيير صلاحية الحساب بنجاح");

    setOpenRoleModal(false);

 }catch(err){
    toast.error("حدث خطأ أثناء تغيير صلاحية الحساب");
 }finally {
    setRoleLoading(false);
  }
}

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const usersSnapshot = await getDocs(
          collection(db, "users")
        );

        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersData);
      } catch (err) {
        setError("حدث خطأ أثناء تحميل بيانات المستخدمين");
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const admins = users.filter(
    (user) => user.role === "admin"
  );

  const normalUsers = users.filter(
    (user) => user.role === "user"
  );

  if (loading) {
    return (
      <div className="content" dir="rtl">
        <p className="text-center mt-10 text-gray-500">
          جاري تحميل البيانات...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content" dir="rtl">
        <div className="mt-10 p-4 rounded-lg bg-red-100 text-red-600 text-center">
          {error}
        </div>
      </div>
    );
  }

  const displayedUsers = users.filter(
  (user) => user.role !== "superAdmin"
);

  console.log(users.map((user) => user.role));
  const usersWithoutRole = users.filter(
  (user) => !user.role
);

console.log(usersWithoutRole);

  return (
    <div className="content" dir="rtl">
      
      <header>
        <h1 className="font-bold text-xl">
          إدارة المستخدمين والمشرفين
        </h1>

        <p className="mt-1 text-gray-500">
          إدارة الحسابات والصلاحيات
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

        {/* إجمالي المشرفين */}
        <div className="card p-4 rounded-xl shadow flex justify-between items-center border border-blue-500">
          
          <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
            <ShieldCheck size={28} />
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-gray-500">
              إجمالي المشرفين
            </h3>

            <h2 className="text-2xl font-bold">
              {admins.length}
            </h2>
          </div>

        </div>

        {/* إجمالي المستخدمين */}
        <div className="card p-4 rounded-xl shadow flex justify-between items-center border border-blue-500">
          
          <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
            <Users size={28} />
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-gray-500">
              إجمالي المستخدمين
            </h3>

            <h2 className="text-2xl font-bold">
              {normalUsers.length}
            </h2>
          </div>

        </div>

      </div>

      {/* Users Table */}
<div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

  {/* Table Header */}
  <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
    <div>
      <h2 className="text-lg font-bold text-gray-800">
        إدارة الحسابات
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        جميع الحسابات المسجلة في النظام
      </p>
    </div>

    <div className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium">
      {users.length} حساب
    </div>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full">

      {/* Head */}
      <thead>
        <tr className="bg-gray-50/80 border-b border-gray-100">

          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500">
            المستخدم
          </th>

          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500">
            البريد الإلكتروني
          </th>

          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500">
            رقم الهاتف
          </th>

          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500">
            الصلاحية
          </th>

          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500">
            الإجراءات
          </th>

        </tr>
      </thead>

      {/* Body */}
      <tbody>

        {displayedUsers.map((item) => (

          <tr
            key={item.id}
            className="border-b border-gray-100 last:border-0 hover:bg-gray-50/70 transition"
          >

            {/* User */}
            <td className="px-6 py-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {item.name?.charAt(0) || "؟"}
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    {item.name || "غير متوفر"}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    ID: {item.id}
                  </p>
                </div>

              </div>

            </td>

            {/* Email */}
            <td className="px-6 py-4">

              <span className="text-sm text-gray-600">
                {item.email || "غير متوفر"}
              </span>

            </td>

            {/* Phone */}
            <td className="px-6 py-4">

              <span className="text-sm text-gray-600">
                {item.phone || "غير متوفر"}
              </span>

            </td>

            {/* Role */}
            <td className="px-6 py-4">

              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  item.role === "admin"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >

                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.role === "admin"
                      ? "bg-blue-500"
                      : "bg-gray-400"
                  }`}
                />

                {item.role === "admin"
                  ? "مشرف"
                  : "مستخدم"}

              </span>

            </td>

            {/* Actions */}
            <td className="px-6 py-4 flex flex-col md:flex-row gap-1">

              <button
  onClick={() => handleOpenRoleModal(item)}
  className="px-4 py-2 text-sm cursor-pointer font-medium text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-600 hover:text-white rounded-lg transition-all duration-200"
>
  تعديل
</button>

<button
  onClick={() => deleteAcount(item.id)}
  className="px-4 py-2  text-sm cursor-pointer font-medium text-red-600 bg-red-50 border border-red-100 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
>
  حذف
</button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>
  </div>

  <ChangeRoleModal
  open={openRoleModal}
  setOpen={setOpenRoleModal}
  selectedUser={selectedUser}
  changeRole={changeRole}
  loading={roleLoading}
/>

</div>
    </div>

    
  );
}