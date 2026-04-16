import { useState } from 'react'
import PlayerCard from './PlayerCard'

function App() {
  const [searchTerm, setSearchTerm] = useState("")
  // 1. เพิ่มกล่องความจำใหม่ สำหรับจำว่า "ตอนนี้เปิดโหมดเรียงคะแนนอยู่หรือเปล่า?" (ค่าเริ่มต้นคือ false = ปิด)
  const [sortByPPG, setSortByPPG] = useState(false)

  const players = [
    { id: 1, name: "Stephen Curry", team: "GSW", pos: "G", num: "30", ppg: "26.4", apg: "5.1", rpg: "4.5", color: "bg-blue-600" },
    { id: 2, name: "LeBron James", team: "LAL", pos: "F", num: "23", ppg: "25.7", apg: "8.3", rpg: "7.3", color: "bg-yellow-500" },
    { id: 3, name: "Tanawat Petchkerd", team: "PSNL", pos: "G", num: "23", ppg: "0.0", apg: "0.0", rpg: "0.0", color: "bg-cyan-500" },
    { id: 4, name: "Tanawat Clone", team: "PSNL", pos: "G", num: "22", ppg: "15.5", apg: "2.0", rpg: "1.0", color: "bg-red-500" } // แอบเพิ่มแต้มให้ Clone นิดนึง จะได้เห็นผลชัดๆ
  ];

  // 2. กระบวนการที่ 1: ร่อนตะแกรงค้นหาชื่อ (เหมือนเดิม)
  // เปลี่ยนจาก const เป็น let เพราะเราอาจจะต้องเอาข้อมูลมาสลับที่กันต่อ
  let displayPlayers = players.filter((p) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. กระบวนการที่ 2: เรียงลำดับคะแนน
  // ถ้าโหมด sortByPPG ถูกเปิด (เป็น true) ให้ทำการสลับที่
  if (sortByPPG) {
    displayPlayers.sort((a, b) => parseFloat(b.ppg) - parseFloat(a.ppg));
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-black text-white mb-2 uppercase tracking-tighter">
          NBA <span className="text-blue-500">Player</span> Stats
        </h1>
        <p className="text-gray-400 mb-8">ข้อมูลสถิตินักบาสฤดูกาลล่าสุด 2026</p>
        
        {/* เปลี่ยนตรงนี้ให้เป็น flex เพื่อให้ช่องค้นหากับปุ่มอยู่บรรทัดเดียวกัน */}
        <div className="max-w-xl mx-auto flex gap-4">
          <input 
            type="text" 
            placeholder="ค้นหาชื่อนักบาส..." 
            className="flex-1 px-6 py-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* 4. ปุ่มเปิด/ปิด โหมดเรียงคะแนน */}
          <button 
            onClick={() => setSortByPPG(!sortByPPG)} 
            className={`px-6 py-3 rounded-full font-bold transition whitespace-nowrap ${
              sortByPPG 
                ? "bg-blue-500 text-white" 
                : "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700"
            }`}
          >
            {sortByPPG ? "🔥 Top PPG" : "เรียงคะแนน"}
          </button>
        </div>
      </header>

      <div className="flex flex-wrap justify-center gap-8">
        {displayPlayers.map((p) => (
          <PlayerCard 
            key={p.id} 
            name={p.name}
            team={p.team}
            position={p.pos}
            number={p.num}
            ppg={p.ppg}
            apg={p.apg}
            rpg={p.rpg}
            colorClass={p.color} 
            />
        ))}
        
        {displayPlayers.length === 0 && (
          <p className="text-gray-500 text-xl mt-10">ไม่พบข้อมูลนักบาสที่คุณค้นหา 🏀</p>
        )}
      </div>

    </div>
  )
}

export default App