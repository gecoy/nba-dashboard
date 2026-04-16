import { useParams, Link } from 'react-router-dom'

function PlayerProfile() {
  // useParams คือตัวดูดตัวเลขรหัส (id) จากบน URL มาใช้งาน
  const { id } = useParams() 

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      
      <h1 className="text-5xl font-black mb-4">
        โปรไฟล์ของนักบาสรหัส: <span className="text-blue-500">{id}</span>
      </h1>
      <p className="text-gray-400 mb-8 text-xl">เดี๋ยวเราจะดึงประวัติส่วนตัวและไฮไลท์มาใส่หน้านี้!</p>
      
      {/* Link คือปุ่มของ React Router (ใช้แทน <a> แบบเก่า เพื่อไม่ให้เว็บกระตุก) */}
      <Link to="/" className="px-8 py-3 bg-gray-800 border border-gray-700 rounded-full hover:bg-gray-700 transition font-bold">
        ← กลับหน้าหลัก
      </Link>
      
    </div>
  )
}

export default PlayerProfile