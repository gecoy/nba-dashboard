// รับตัวแปร (Props) เข้ามาในวงเล็บ เพื่อรอคนส่งข้อมูลมาให้
function PlayerCard({ name, team, position, number, ppg, apg, rpg, colorClass }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl w-80 overflow-hidden transform hover:scale-105 transition duration-300">
      
      {/* ใช้ตัวแปร colorClass สำหรับสีทีม และ team สำหรับชื่อย่อ */}
      <div className={`h-32 flex items-center justify-center ${colorClass}`}>
         <span className="text-white text-5xl font-black tracking-widest">{team}</span>
      </div>
      
      <div className="p-6">
        {/* ใช้ตัวแปร name, position, number */}
        <h2 className="text-3xl font-black text-gray-800">{name}</h2>
        <p className="text-gray-500 font-bold text-sm mb-4">{position} • #{number}</p>

        <div className="flex justify-between border-t border-gray-200 pt-4">
          <div className="text-center">
            <p className="text-xs text-gray-400 font-bold uppercase">PPG</p>
            {/* ใช้ตัวแปร ppg */}
            <p className="text-xl font-black text-gray-900">{ppg}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 font-bold uppercase">APG</p>
            {/* ใช้ตัวแปร apg */}
            <p className="text-xl font-black text-gray-900">{apg}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 font-bold uppercase">RPG</p>
            {/* ใช้ตัวแปร rpg */}
            <p className="text-xl font-black text-gray-900">{rpg}</p>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default PlayerCard