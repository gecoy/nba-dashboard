// 1. นำเข้า useState (เครื่องมือสร้างความจำให้ React)
import { useState } from 'react'
import PlayerCard from './PlayerCard'

function App() {
  // 2. สร้าง "กล่องความจำ" ชื่อ searchTerm เพื่อเก็บคำที่ผู้ใช้พิมพ์ค้นหา
  const [searchTerm, setSearchTerm] = useState("")

  const players = [
    { id: 1, name: "Stephen Curry", team: "GSW", pos: "G", num: "30", ppg: "26.4", apg: "5.1", rpg: "4.5", color: "bg-blue-600" },
    { id: 2, name: "LeBron James", team: "LAL", pos: "F", num: "23", ppg: "25.7", apg: "8.3", rpg: "7.3", color: "bg-yellow-500" },
    { id: 3, name: "Tanawat Petchkerd", team: "PSNL", pos: "G", num: "23", ppg: "0.0", apg: "0.0", rpg: "0.0", color: "bg-cyan-500" },
    { id: 4, name: "Tanawat Clone", team: "PSNL", pos: "G", num: "22", ppg: "0.0", apg: "0.0", rpg: "0.0", color: "bg-red-500" }
  ];

  // 3. สร้าง "ตะแกรงร่อน" (Filter) 
  // ดึงมาเฉพาะนักบาสที่มีชื่อตรงกับคำที่พิมพ์ในช่องค้นหา
  const filteredPlayers = players.filter((p) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-black text-white mb-2 uppercase tracking-tighter">
          NBA <span className="text-blue-500">Player</span> Stats
        </h1>
        <p className="text-gray-400 mb-8">ข้อมูลสถิตินักบาสฤดูกาลล่าสุด 2026</p>
        
        {/* 4. กล่องค้นหา (Search Input) */}
        <div className="max-w-md mx-auto">
          <input 
            type="text" 
            placeholder="ค้นหาชื่อนักบาส..." 
            className="w-full px-6 py-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition"
            // เมื่อมีการพิมพ์ ให้เอาข้อความไปเก็บไว้ในกล่องความจำ (searchTerm)
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* 5. แสดงผล (ใช้ filteredPlayers แทน players เฉยๆ) */}
      <div className="flex flex-wrap justify-center gap-8">
        {filteredPlayers.map((p) => (
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
        
        {/* โชว์ข้อความเตือนถ้าค้นหาไม่เจอใครเลย */}
        {filteredPlayers.length === 0 && (
          <p className="text-gray-500 text-xl mt-10">ไม่พบข้อมูลนักบาสที่คุณค้นหา 🏀</p>
        )}
      </div>

    </div>
  )
}

export default App