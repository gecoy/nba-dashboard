import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

function PlayerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [player, setPlayer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // ⭐️ เช็คสถานะล็อกอินเพื่อเอาไว้ใช้ ซ่อน/โชว์ ปุ่ม แก้ไขและลบ
  const token = localStorage.getItem('token')
  const isLoggedIn = token !== null && token !== undefined

  useEffect(() => {
    fetch(`http://localhost:8080/api/players/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("ไม่พบผู้เล่น")
        return res.json()
      })
      .then(data => {
        setTimeout(() => {
          setPlayer(data)
          setIsLoading(false)
        }, 200)
      })
      .catch(err => {
        console.error("ดึงข้อมูลพัง:", err)
        setPlayer(null)
        setIsLoading(false)
      })
  }, [id])

  // ⭐️ ฟังก์ชันลบข้อมูลแบบดักจับ Error แจ้งเตือน
  const handleDelete = () => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบนักกีฬาคนนี้?")) {
      fetch(`http://localhost:8080/api/players/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // แนบตั๋ว JWT ไปด้วย
        }
      })
        .then(res => {
          if (!res.ok) {
            return res.text().then(text => { throw new Error(text) })
          }
          return res.json()
        })
        .then(data => {
          alert("ลบข้อมูลเรียบร้อยแล้ว! 🗑️")
          navigate('/')
        })
        .catch(err => {
          alert(`เกิดข้อผิดพลาด: ${err.message}`)
        })
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">

      {/* ปุ่มกลับ */}
      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition font-bold">
        <span className="text-2xl mr-2">←</span> กลับหน้าหลัก
      </Link>

      {/* หน้าจอ Loading */}
      {isLoading ? (
        <div className="text-center text-3xl font-bold text-blue-500 animate-pulse mt-20">
          กำลังโหลดประวัติส่วนตัว... 🏀
        </div>
      ) : !player ? (
        <div className="text-center text-3xl font-bold text-red-500 mt-20">
          ไม่พบข้อมูลนักกีฬาที่คุณตามหา ❌
        </div>
      ) : (
        // ถ้าหาเจอ ก็โชว์โปรไฟล์เลย!
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-3xl overflow-hidden shadow-2xl">

          {/* ส่วนหัว: สีตามทีม */}
          <div className={`h-48 ${player.colorClass} flex flex-col items-center justify-center relative`}>
            <h1 className="text-6xl font-black tracking-tighter text-white drop-shadow-lg">{player.name}</h1>
            <p className="text-2xl font-bold text-white/80 mt-2">Team: {player.team}</p>
          </div>

          {/* ส่วนสถิติ */}
          <div className="p-10">
            <div className="flex justify-between items-center mb-10 border-b border-gray-700 pb-8">
              <div>
                <p className="text-gray-400 text-lg">ตำแหน่ง</p>
                <p className="text-3xl font-bold">
                  {player.position === 'G' ? 'Guard' : player.position === 'F' ? 'Forward' : 'Center'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-lg">หมายเลขเสื้อ</p>
                <p className="text-5xl font-black text-blue-500">#{player.number}</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-300 mb-6 uppercase tracking-wider">Season Stats</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gray-900 p-6 rounded-2xl text-center border border-gray-700">
                <p className="text-gray-500 font-bold mb-2">Points (PPG)</p>
                <p className="text-5xl font-black text-white">{player.ppg}</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-2xl text-center border border-gray-700">
                <p className="text-gray-500 font-bold mb-2">Assists (APG)</p>
                <p className="text-5xl font-black text-white">{player.apg}</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-2xl text-center border border-gray-700">
                <p className="text-gray-500 font-bold mb-2">Rebounds (RPG)</p>
                <p className="text-5xl font-black text-white">{player.rpg}</p>
              </div>
            </div>
          </div>

          {/* 🔒 โชว์ปุ่ม แก้ไข/ลบ ถ้าล็อกอินแล้ว หรือโชว์ข้อความถ้ายังไม่ล็อกอิน */}
          {isLoggedIn ? (
            <div className="bg-gray-900 p-6 text-center border-t border-gray-700 flex justify-center gap-4">
              <Link to={`/edit/${id}`} className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-full transition shadow-lg">
                ✏️ แก้ไขข้อมูล
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-full transition shadow-lg"
              >
                🗑️ ลบนักกีฬาคนนี้
              </button>
            </div>
          ) : (
            // ⭐️ ถ้ายังไม่ล็อกอิน ให้โชว์แถบข้อความแบบเท่ๆ แทนปุ่ม
            <div className="bg-gray-900 p-6 text-center border-t border-gray-700">
              <p className="text-gray-500 font-bold bg-gray-800 inline-block px-8 py-3 rounded-full border border-gray-700 shadow-inner">
                🔒 <Link to="/login" className="text-blue-400 hover:text-blue-300 underline transition">เข้าสู่ระบบ</Link> เพื่อจัดการแก้ไขและลบข้อมูล
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  )
}

export default PlayerProfile