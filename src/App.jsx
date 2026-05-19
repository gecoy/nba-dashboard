import { useState, useEffect } from 'react'
import PlayerCard from './PlayerCard'

function App() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortType, setSortType] = useState("")
  
  // 1. เปลี่ยนผู้เล่นให้เป็น State ว่างๆ (รอข้อมูลมาเติม)
  const [players, setPlayers] = useState([])
  
  // 2. สร้าง State สำหรับระบบ "กำลังโหลด..."
  const [isLoading, setIsLoading] = useState(true)

  // 3. บอสใหญ่ทำงาน: useEffect (ทำทันทีที่เปิดเว็บ)
  useEffect(() => {
    // ใช้คำสั่ง fetch ไปดูดไฟล์ nba-data.json
    fetch('/nba-data.json')
      .then((response) => response.json()) // แปลงข้อมูลให้กลายเป็น JSON ที่ React อ่านออก
      .then((data) => {
        // แกล้งหน่วงเวลา 1 วินาที ให้เห็นตัว Loading สวยๆ (ชีวิตจริงไม่ต้องใส่ setTimeout)
        setTimeout(() => {
          setPlayers(data)      // เอาข้อมูลที่ได้ ใส่กล่อง players
          setIsLoading(false)   // ปิดหน้าจอ Loading
        }, 150)
      })
      .catch((error) => console.error("พังครับ ดูดข้อมูลไม่ได้:", error))
  }, []) 
  // วงเล็บเหลี่ยม [] ตอนจบ สำคัญมาก! แปลว่า "ให้ดูดข้อมูลแค่ครั้งเดียวตอนเปิดหน้าเว็บเท่านั้น" (ถ้าไม่ใส่ เว็บจะโหลดซ้ำรัวๆ จนคอมค้าง)

  // ร่อนตะแกรงค้นหาชื่อ
  let displayPlayers = players.filter((p) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // เรียงลำดับ
  if (sortType === "ppg") displayPlayers.sort((a, b) => parseFloat(b.ppg) - parseFloat(a.ppg));
  else if (sortType === "apg") displayPlayers.sort((a, b) => parseFloat(b.apg) - parseFloat(a.apg));
  else if (sortType === "rpg") displayPlayers.sort((a, b) => parseFloat(b.rpg) - parseFloat(a.rpg));

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      
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
        </div>
      </header>

      {/* 4. โชว์สถานะ Loading หรือ โชว์การ์ด */}
      {isLoading ? (
        <div className="text-center text-3xl font-bold text-blue-500 animate-pulse mt-20">
          กำลังโหลดข้อมูลนักบาส... 🏀
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {displayPlayers.map((p) => (
            <PlayerCard key={p.id} {...p} />
          ))}
          {displayPlayers.length === 0 && (
            <p className="text-gray-500 text-xl mt-10">ไม่พบข้อมูลนักบาสที่คุณค้นหา 🏀</p>
          )}
        </div>
      )}

    </div>
  )
}

export default App