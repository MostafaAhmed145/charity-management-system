import React, { useContext, useEffect, useState } from "react";
import { Clock3, FileText, User, CheckCircle2 } from "lucide-react";
import { AuthContext } from "../CONTEXT/Context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export default function MyCases() {

  const { user , getStatus } = useContext(AuthContext)
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(()=>{
      
    const getMyCases = async ()=>{
      if (!user) return ;

      try{

        
        const q = query(
      collection(db, "cases"),
      where("userId", "==", user.uid),
      where("archived", "==", false)
    );
       

       const querySnapshot = await getDocs(q)
       console.log("number of cases:", querySnapshot.docs.length);

       const caseData = querySnapshot.docs.map((doc)=> ({
           id : doc.id ,
          ...doc.data()
       }))

       console.log("caseData" , caseData);

       setCases(caseData)


       
      }catch(err){
        console.log(err);
        
      }
       finally {
      setLoading(false);
    }
    }

    getMyCases()

  } , [user])

  const maskedNationalId = (nationalId)=>{
        if (!nationalId) return ;

        return "**********" + nationalId.slice(-4)
  }
  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 p-5 flex flex-col items-center">

{/* Header */}
      <div className="mb-8 pt-6 ">

  <div className="flex items-center gap-3 mb-2 mt-4 justify-center">

    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
      <FileText className="text-blue-600" size={21} />
    </div>

    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
      متابعة الطلب
    </h1>

  </div>

  <p className="text-gray-500 text-sm md:text-base mr-1">
    يمكنك متابعة حالة طلب المساعدة الخاص بك ومعرفة آخر التحديثات
  </p>

</div>



      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-3">

   
   {cases?.map((item )=>{
    const status = getStatus(item.status);
     const StatusIcon = status.icon;
    return <>
        {/* Case Card */}
        <div key={item.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Card Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center">
                <FileText className="text-blue-600" size={22} />
              </div>

              <div>
                <h2 className="font-bold text-gray-800">
                  طلب مساعدة
                </h2>

              </div>
            </div>

            {/* Status */}

            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full  text-sm font-medium ${getStatus(item.status).className}`}>
              <StatusIcon size={16} />
              {getStatus(item.status).text}
            </span>
          </div>

          {/* User Info */}
          <div className="p-5">

            <div className="flex items-center gap-2 mb-4">
              <User size={19} className="text-gray-500" />

              <h3 className="font-semibold text-gray-700">
                بيانات مقدم الطلب
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">
                  الاسم
                </p>

                <p className="font-semibold text-gray-800">
                   {item.userName} 
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">
                  الرقم القومي
                </p>

                <p dir="ltr" className="font-semibold text-gray-800">
                {maskedNationalId(item.nationalId)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">
                  نوع المساعدة
                </p>

                <p className="font-semibold text-gray-800">
                   {item.supportType}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">
                  تاريخ تقديم الطلب
                </p>

                <p className="font-semibold text-gray-800">
                   {item.createdAt?.toDate().toLocaleDateString("ar-EG")}
                </p>
              </div>

            </div>

            {/* Notes */}
            <div className="mt-5">
              <p className="text-sm text-gray-500 mb-2">
                ملاحظات
              </p>

              <div className="bg-gray-50 rounded-xl p-4 text-gray-700">
                    {item.notes === "" ? "لا توجد ملاحظات" : item.notes}   
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-100 p-4 flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 size={18} className="text-green-600" />
            سيتم تحديث حالة الطلب عند الانتهاء من المراجعة
          </div>

        </div>
    </>
   })}
        

      </div>

    </div>
  );
}