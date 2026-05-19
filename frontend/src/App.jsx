import { useState, useEffect } from 'react'
import PlayerCard from './PlayerCard'
import { Link } from 'react-router-dom'
import TopScorersChart from './TopScorersChart'


function App() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortType, setSortType] = useState("")
  const [players, setPlayers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  
  const token = localStorage.getItem('token')
  const isLoggedIn = token !== null && token !== undefined // ถ้ามี Token แปลว่าล็อกอินแล้ว
  const currentUsername = localStorage.getItem('username')

  // ฟังก์ชันเวลากดปุ่มออกจากระบบ
  const handleLogout = () => {
    localStorage.clear() // ล้างข้อมูลการล็อกอินทั้งหมดในเครื่องนี้
    window.location.reload() // สั่งรีเฟรชหน้าเว็บทีนึงเพื่อให้สถานะเปลี่ยนกลับ
  }

  // ปรับ useEffect ให้ดึงข้อมูลใหม่ทุกครั้งที่คำค้นหาหรือการเรียงลำดับเปลี่ยน
  useEffect(() => {
    setIsLoading(true) 
    
    fetch(`https://nba-dashboard-production-39ec.up.railway.app/api/players?search=${searchTerm}&sort=${sortType}`)
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data)      
        setIsLoading(false)   
      })
      .catch((error) => {
        console.error("พังครับ ดูดข้อมูลไม่ได้:", error)
        setIsLoading(false)
      })
  }, [searchTerm, sortType])

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      
      {/* ⭐️ ส่วนที่เพิ่มใหม่: แถบเมนูแสดงสถานะ Auth (วางไว้บนสุดของหน้าเว็บ) */}
      <div className="max-w-6xl mx-auto flex justify-end gap-4 mb-6">
        {isLoggedIn ? (
          // ถ้าผู้ใช้ล็อกอินแล้ว ให้โชว์ชื่อและปุ่มออกจากระบบ
          <div className="flex items-center gap-4">
            <span className="text-gray-300 font-bold">สวัสดี, {currentUsername} 👋</span>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-sm px-4 py-2 rounded-xl font-bold transition">
              ออกจากระบบ
            </button>
          </div>
        ) : (
          // ถ้ายังไม่ได้ล็อกอิน ให้โชว์ปุ่มเข้าสู่ระบบกับสมัครสมาชิก
          <div className="flex gap-3">
            <Link to="/login" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-xl font-bold transition">
              เข้าสู่ระบบ
            </Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl font-bold transition">
              สมัครสมาชิก
            </Link>
          </div>
        )}
      </div>

      {/* ------------------ บล็อกเดิมของคุณทั้งหมดอยู่ตรงนี้ ------------------ */}
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-black mb-2 uppercase tracking-tighter">
          NBA <span className="text-blue-500">Player</span> Stats
        </h1>
        <p className="text-gray-400 mb-8">ข้อมูลสถิตินักบาสฤดูกาลล่าสุด 2026</p>
        
        <div className="max-w-2xl mx-auto flex gap-4">
          <input 
            type="text" 
            placeholder="ค้นหาชื่อนักบาส..." 
            className="flex-1 px-6 py-3 rounded-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 transition"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="px-6 py-3 rounded-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="">เรียงตามปกติ</option>
            <option value="ppg">🔥 แต้มสูงสุด (PPG)</option>
            <option value="apg">🎯 แอสซิสต์สูงสุด (APG)</option>
            <option value="rpg">🛡️ รีบาวน์สูงสุด (RPG)</option>
          </select>
          {/* โชว์ปุ่มเพิ่มนักกีฬา เฉพาะคนที่ล็อกอินแล้วเท่านั้น */}
{isLoggedIn ? (
            // ถ้าล็อกอินแล้ว โชว์ปุ่มเขียวปกติ
            <Link to="/add" className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full font-bold transition flex items-center shrink-0">
              + เพิ่มนักกีฬา
            </Link>
          ) : (
            // ถ้ายังไม่ล็อกอิน โชว์ปุ่มสีเทาๆ กดไม่ได้ พร้อมรูปลูกกุญแจ
            <div className="bg-gray-800 text-gray-500 px-6 py-3 rounded-full font-bold border border-gray-700 flex items-center cursor-not-allowed shrink-0 tooltip" title="กรุณาเข้าสู่ระบบก่อน">
              🔒 เพิ่มนักกีฬา
            </div>
          )}
        </div>
      </header>

      {/* 👇 แทรกกราฟตรงนี้ ส่งข้อมูล players ไปให้กราฟคำนวณ */}
      {/* ส่งตัวแปร sortBy เข้าไปด้วย */}
      {!isLoading && players.length > 0 && (
        <TopScorersChart players={players} sortBy={sortType} /> 
      )}

      {/* บล็อกแสดงผล Loading หรือการ์ดนักบาส */}
      {isLoading ? (
        <div className="text-center text-3xl font-bold text-blue-500 animate-pulse mt-20">
          กำลังโหลดข้อมูลนักบาส... 🏀
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {players.map((p) => (
            <PlayerCard key={p.id} {...p} />
          ))}
          {players.length === 0 && (
            <p className="text-gray-500 text-xl mt-10">ไม่พบข้อมูลนักบาสที่คุณค้นหา 🏀</p>
          )}
        </div>
      )}

    </div>
  )
}

export default App