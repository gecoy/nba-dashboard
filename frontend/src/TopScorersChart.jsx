import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts'

// ⭐️ รับ prop sortBy เพิ่มเข้ามา
function TopScorersChart({ players, sortBy }) {
  
  // 1. กำหนดค่าเริ่มต้น (ถ้าดึงตามชื่อ หรืออย่างอื่น จะให้โชว์แต้ม PPG เป็นหลัก)
  let statKey = 'ppg'
  let chartTitle = '🔥 Top 5 Scoring Leaders (PPG)'
  let championColor = '#fbbf24' // สีทอง

  // 2. เปลี่ยนหัวข้อและคีย์ข้อมูลตาม Dropdown ที่เลือก
  if (sortBy === 'apg') {
    statKey = 'apg'
    chartTitle = '🏀 Top 5 Assist Leaders (APG)'
    championColor = '#10b981' // สีเขียวสำหรับจ้าวแอสซิสต์
  } else if (sortBy === 'rpg') {
    statKey = 'rpg'
    chartTitle = '🛡️ Top 5 Rebound Leaders (RPG)'
    championColor = '#a855f7' // สีม่วงสำหรับจ้าวรีบาวน์
  }

  // 3. กรองและเรียงข้อมูลใหม่ตาม statKey
  const topPlayers = [...players]
    .sort((a, b) => b[statKey] - a[statKey])
    .slice(0, 5)

  if (topPlayers.length === 0) return null

  const formatName = (fullName) => {
    const parts = fullName.split(' ')
    if (parts.length > 1) {
      return `${parts[0].charAt(0)}. ${parts[parts.length - 1]}`
    }
    return fullName
  }

  return (
    <div className="bg-gray-800 p-8 rounded-3xl shadow-xl w-full max-w-4xl mx-auto mb-12 border border-gray-700 transition-all duration-500">
      <h2 className="text-3xl font-black mb-8 text-center text-white tracking-wide">
        {chartTitle}
      </h2>
      
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topPlayers} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af" 
              tick={{ fill: '#d1d5db', fontSize: 14, fontWeight: 'bold' }} 
              tickFormatter={formatName} 
              interval={0}               
              tickMargin={12}            
              axisLine={false}
              tickLine={false}
            />
            
            <YAxis 
              stroke="#9ca3af" 
              tick={{ fill: '#9ca3af', fontSize: 13 }} 
              axisLine={false}
              tickLine={false}
              // ให้กราฟขยับยืดหยุ่นตามค่าน้อยสุด-มากสุด
              domain={['dataMin - 1', 'dataMax + 1']} 
            />
            
            <Tooltip 
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151', 
                borderRadius: '12px', 
                color: '#fff',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ color: championColor, fontSize: '18px', fontWeight: 'bold' }}
            />

            {/* ⭐️ ดึง statKey (ppg, apg, หรือ rpg) มาใช้แสดงผลแท่งกราฟ */}
            <Bar dataKey={statKey} radius={[8, 8, 0, 0]} barSize={55} animationDuration={1000}>
              {topPlayers.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? championColor : '#3b82f6'} /> 
              ))}
            </Bar>
            
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TopScorersChart