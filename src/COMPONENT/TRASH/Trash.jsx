import React, { useContext, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { collection, getDocs, query, where , deleteDoc, doc , updateDoc} from "firebase/firestore";
import { db } from '../../firebase'
import { toast } from "react-toastify";
import { AuthContext } from "../CONTEXT/Context";

export default function Trash() {

  const [cases, setCases] = useState([])
  const { getStatus } = useContext(AuthContext);


  const deletCase = async (id)=>{
    try{
      await deleteDoc(doc(db, "cases", id))

    setCases((prev) => prev.filter((item) => item.id !== id));

    toast.success("تم حذف الحاله بنجاح")
    }catch(err){
      toast.error("لم يتم حذف هذه الحاله")
    }
  }

  const restoreCase = async (id) => {
  try {
    await updateDoc(doc(db, "cases", id), {
      archived: false,
    });

    setCases((prev) => prev.filter((item) => item.id !== id));

    toast.success("تم استعادة الحالة بنجاح");
  } catch (err) {
    toast.error("لم يتم استعادة الحالة");
  }
};


  useEffect(()=>{
        
    const getArchivedCases = async ()=>{
   const q = query(
          collection(db , "cases") ,
          where("archived" , "==" , true)
         ) ;

         const snapshot = await getDocs(q)

         const archivedCases  = snapshot.docs.map((doc)=> ({
          id: doc.id,
          ...doc.data(),
         }))

         setCases(archivedCases)

    }

    getArchivedCases()
  },[])


  return (
    <div dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-300 pb-4">
        <div className="flex items-center gap-2">
          <Trash2 className="text-red-500" size={26} />

          <h1 className="text-2xl font-bold text-gray-800">
            المهملات
          </h1>
        </div>
      </div>


         {cases.length === 0 ? <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-10 text-center">
    <Trash2 className="mx-auto text-gray-300" size={50} />

    <h2 className="mt-4 text-lg font-bold text-gray-700">
      المهملات فارغة
    </h2>

    <p className="text-sm text-gray-500 mt-2">
      لا توجد حالات مؤرشفة حاليًا
    </p>
  </div> : <>
         
         
        {cases?.map((item)=>{
          const status = getStatus(item.status)
          return <div key={item.id} className="mt-6 bg-white rounded-xl shadow overflow-hidden">
        
        {/* Card Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          
          <div>
            <h2 className="font-bold text-gray-800 text-lg">
               {item.userName}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
  الرقم القومي:
  <span dir="ltr" className="inline-block mr-1">
    ********{item.nationalId?.slice(-3)}
  </span>
</p>
          </div>

          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm w-fit">
            في المهملات
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <div>
            <p className="text-sm text-gray-500">
              تصنيف الحالة
            </p>

            <p className="font-semibold text-gray-800 mt-1">
               {item.caseType}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              نوع المساعدة
            </p>

            <p className="font-semibold text-gray-800 mt-1">
               {item.supportType}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              رقم الهاتف
            </p>

            <p className="font-semibold text-gray-800 mt-1">
              {item.phone}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              حالة الطلب
            </p>

            <p className={`font-semibold text-gray-800 ${status.className} flex justify-center items-center gap-1 w-fit p-1 rounded-xl`}>
                    <status.icon size={16} />
                    { status.text || "غير متوفر"}
                  </p>
          </div>

        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">

          <button
          onClick={()=>{restoreCase(item.id)}}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition cursor-pointer"
          >
            استعادة
          </button>

          <button
          onClick={()=>{deletCase(item.id)}}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
          >
            <Trash2 size={17} />
            حذف نهائي
          </button>

        </div>

      </div>
          
        
        })}
         </>}
      
    </div>
  );
}