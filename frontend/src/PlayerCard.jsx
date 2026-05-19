import { Link } from 'react-router-dom'

// 1. คลังข้อมูลชื่อย่อทีม (ย้ายมาไว้ที่หน้านี้แทน)
const teamAbbr = {
  "Atlanta Hawks": "ATL", "Boston Celtics": "BOS", "Brooklyn Nets": "BKN",
  "Charlotte Hornets": "CHA", "Chicago Bulls": "CHI", "Cleveland Cavaliers": "CLE",
  "Dallas Mavericks": "DAL", "Denver Nuggets": "DEN", "Detroit Pistons": "DET",
  "Golden State Warriors": "GSW", "Houston Rockets": "HOU", "Indiana Pacers": "IND",
  "LA Clippers": "LAC", "Los Angeles Lakers": "LAL", "Memphis Grizzlies": "MEM",
  "Miami Heat": "MIA", "Milwaukee Bucks": "MIL", "Minnesota Timberwolves": "MIN",
  "New Orleans Pelicans": "NOP", "New York Knicks": "NYK", "Oklahoma City Thunder": "OKC",
  "Orlando Magic": "ORL", "Philadelphia 76ers": "PHI", "Phoenix Suns": "PHX",
  "Portland Trail Blazers": "POR", "Sacramento Kings": "SAC", "San Antonio Spurs": "SAS",
  "Toronto Raptors": "TOR", "Utah Jazz": "UTA", "Washington Wizards": "WAS"
}

function PlayerCard({ id, name, team, position, number, ppg, apg, rpg, colorClass }) {
  return (
    <Link to={`/player/${id}`} className="block w-80 bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300">
      
      {/* ⭐️ ส่วนหัวการ์ด: โชว์สี, ชื่อ, โลโก้ และ ชื่อย่อทีม */}
      <div className={`h-32 ${colorClass} flex flex-col justify-center items-center relative overflow-hidden`}>
        <h2 className="text-3xl font-black text-white drop-shadow-md z-10">{name}</h2>
        
        {/* กล่องใส่โลโก้และตัวย่อ */}
        <div className="flex items-center gap-2 mt-2 z-10 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
          <img 
            src={`https://a.espncdn.com/i/teamlogos/nba/500/${(teamAbbr[team] || 'NBA').toLowerCase()}.png`} 
            alt={team} 
            className="w-6 h-6 object-contain drop-shadow-lg"
            onError={(e) => e.target.style.display = 'none'} // ถ้าโหลดรูปไม่ขึ้นให้ซ่อนไป
          />
          <p className="text-sm font-bold text-white tracking-wider">
            {teamAbbr[team] || team}
          </p>
        </div>
      </div>

      {/* ส่วนสถิติครึ่งล่างของการ์ด */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <div className="text-gray-400 font-bold">{position === 'G' ? 'Guard' : position === 'F' ? 'Forward' : 'Center'}</div>
          <div className="text-2xl font-black text-blue-500">#{number}</div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-900 p-2 rounded-lg">
            <p className="text-xs text-gray-500 font-bold">PPG</p>
            <p className="text-xl font-black text-white">{ppg}</p>
          </div>
          <div className="bg-gray-900 p-2 rounded-lg">
            <p className="text-xs text-gray-500 font-bold">APG</p>
            <p className="text-xl font-black text-white">{apg}</p>
          </div>
          <div className="bg-gray-900 p-2 rounded-lg">
            <p className="text-xs text-gray-500 font-bold">RPG</p>
            <p className="text-xl font-black text-white">{rpg}</p>
          </div>
        </div>
      </div>
      
    </Link>
  )
}

export default PlayerCard