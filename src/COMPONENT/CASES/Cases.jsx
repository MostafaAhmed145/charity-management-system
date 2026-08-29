import React, { useContext, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import CaseModal from "../CASE-MODAL/CaseModal";
import { collection, deleteDoc, doc, getDocs  , updateDoc} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { AuthContext } from "../CONTEXT/Context";
// import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import DeletCaseModal from "../DeleteCaseModal/DeletCaseModal";
import CaseDetailsModal from "../CASE-DETELS-MODAL/CaseDetailsModal";

export default function Cases() {
  const [open, setOpen] = useState(false);
  const [openDeletCase , setOpenDeletCase] = useState(false);
  const [search, setSearch] = useState("");
  const [sortStatus, setSortStatus] = useState("");
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null)
  const [openDetails, setOpenDetails] = useState(false);
  const {getStatus } = useContext(AuthContext)

  
  const getCases  = async()=>{

    try{
        const querySnapshot = await getDocs(collection(db, "cases"));

        const data = querySnapshot.docs.map((doc)=>({
           id: doc.id,
           ...doc.data(),
           
        }))

        .filter((item) => item.archived !== true);

          setCases(data)
    }catch(err){
        console.log(err);
        
    }
  }

  useEffect(() => {
  getCases();
}, []);


const handleDelete = async (id) => {
  if (!id) {
    toast.error("لم يتم تحديد الحالة");
    return;
  }

  try {
    await updateDoc(doc(db, "cases", id) ,{
      archived : true
    });

    setCases((prevCases) =>
      prevCases.filter((caseItem) => caseItem.id !== id)
    );

    setOpenDeletCase(false);
    setSelectedCase(null);

    toast.success("تم نقل الحالة إلى المهملات");
  } catch (err) {
    toast.error("فشل نقل الحالة إلى المهملات");
  }
};


const filteredCases  = cases.filter((item)=>{
  const searchTerm = search.toLowerCase();
  const matchesSearch = 
    item.userName?.toLowerCase().includes(searchTerm) ||
    item.nationalId.includes(searchTerm) ||
    item.phone?.includes(searchTerm) 


  const matchesStatus = 

   sortStatus === "" ||
   sortStatus === "all" ||
   item.status === sortStatus

  return matchesSearch && matchesStatus
  
  
})

  
  return (
    <>
      <header className=" border-b border-gray-300 rounded-b-lg py-3">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <button
          onClick={() => {setOpen(true) ; setSelectedCase(null)}  }
          className="flex items-center justify-center cursor-pointer gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full md:w-auto"
        >
          <Plus size={18} />
          إضافة حالة
        </button>

        <div className=" flex flex-col md:flex-row gap-2">
          <select
        value={sortStatus} onChange={(e)=> setSortStatus(e.target.value)} className=" border p-2 rounded-lg border-gray-300 outline-none">
          <option value="">فرز حسب الحالة</option>
          <option value="all">كل الحالات</option>
          <option value="pending">قيد المراجعة</option>
          <option value="in_progress">جاري التنفيذ</option>
          <option value="completed">مكتملة</option>
          <option value="rejected">مرفوضة</option>
        </select>

        <div className="flex items-center gap-2 border border-gray-400 rounded-lg px-3 py-2 w-full md:w-80">
          <Search size={18} className="text-gray-400" />

          <input
            type="search"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="بحث باستخدام الاسم او رقم الهاتف او الرقم القومي"
            className="w-full outline-none"
          />
        </div>
        </div>
      </div>

      <CaseModal open={open} setOpen={setOpen} selectedCase={selectedCase} getCases={getCases} setSelectedCase={setSelectedCase}/>
      </header>

      <div className="overflow-x-auto mt-6 bg-white rounded-xl shadow">

        <table
          dir="rtl"
          className="min-w-full text-right"
        >
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4">م</th>
              <th className="px-6 py-4">اسم الحالة</th>
              <th className="px-6 py-4 whitespace-nowrap">الرقم القومي</th>
              <th className="px-6 py-4">حالة الطلب</th>
              <th className="px-6 py-4 whitespace-nowrap">تصنيف الحالة</th>
              <th className="px-6 py-4 whitespace-nowrap">نوع المساعدة</th>
              <th className="px-6 py-4">رقم الهاتف</th>
              <th className="px-6 py-4 text-center">الإجراءات</th>
            </tr>
          </thead>

          

          <tbody>

            {filteredCases.map((item, index)=>{

              const status = getStatus(item.status)

              const StatusIcon = status.icon

              return <>
                
                <tr key={index} className="border-t border-blue-400 hover:bg-gray-50 whitespace-nowrap text-center">
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4"> {item.userName} </td>
              <td className="px-6 py-4">{item.nationalId}</td>

              <td className="px-6 py-4">
                <span className={`rounded-full flex justify-center items-center gap-1  px-3 whitespace-nowrap py-1 text-xs ${getStatus(item.status).className}`}>
                  <StatusIcon size={16} />
                  {getStatus(item.status).text}
                </span>
              </td>

              <td className="px-6 py-4">{item.caseType}</td>
              <td className="px-6 py-4"> {item.supportType}</td>
              <td className="px-6 py-4">{item.phone}</td>

              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={()=>{
                      setSelectedCase(item);
                      setOpenDetails(true)
                    }}
                  className="rounded bg-blue-500 px-3 cursor-pointer py-1 text-white hover:bg-blue-600">
                    عرض
                  </button>

                  <button onClick={()=>{
                    setSelectedCase(item)
                    setOpen(true)
                  }} className="rounded bg-green-500 px-3 py-1 text-white cursor-pointer hover:bg-green-600">
                    تعديل
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCase(item);
                      setOpenDeletCase(true);
                    }}
                    className="rounded cursor-pointer bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>

            {/* <DeletCaseModal openDeletCase={openDeletCase} setOpenDeletCase={setOpenDeletCase} handleDelete={handleDelete} id={item.id}/> */}

            {/* handleDelete(item.id) */}
                
                </>
            }
              
                
            )}
            
            
          </tbody>

        </table>
          <CaseDetailsModal setOpenDetails={setOpenDetails} openDetails={openDetails} selectedCase={selectedCase}/>

        <DeletCaseModal
  openDeletCase={openDeletCase}
  setOpenDeletCase={setOpenDeletCase}
  handleDelete={handleDelete}
  id={selectedCase?.id}
/>

     

      </div>
    </>
  );
}