// 1. นำเข้า Link
import { Link } from 'react-router-dom'

// 2. อย่าลืมรับค่า id เข้ามาด้วย!
function PlayerCard({ id, name, team, position, number, ppg, apg, rpg, colorClass }) {
  return (
    // 3. เอา <Link> มาคลุมกล่องการ์ดทั้งหมด และสั่งให้มันชี้ไปที่ /player/รหัสของคนคนนั้น
    <Link to={`/player/${id}`} className="block">
      <div className="bg-white rounded-2xl shadow-xl w-80 overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-300">
        
        <div className={`h-32 flex items-center justify-center ${colorClass}`}>
           <span className="text-white text-5xl font-black tracking-widest">{team}</span>
        </div>
        
        <div className="p-6">
          <h2 className="text-3xl font-black text-gray-800">{name}</h2>
          <p className="text-gray-500 font-bold text-sm mb-4">{position} • #{number}</p>

          <div className="flex justify-between border-t border-gray-200 pt-4">
            <div className="text-center">
              <p className="text-xs text-gray-400 font-bold uppercase">PPG</p>
              <p className="text-xl font-black text-gray-900">{ppg}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 font-bold uppercase">APG</p>
              <p className="text-xl font-black text-gray-900">{apg}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 font-bold uppercase">RPG</p>
              <p className="text-xl font-black text-gray-900">{rpg}</p>
            </div>
          </div>
          
        </div>
      </div>
    </Link>
  )
}

export default PlayerCard