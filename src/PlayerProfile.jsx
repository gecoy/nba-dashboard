import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

function PlayerProfile() {
  const { id } = useParams() // 1. อ่านรหัสจาก URL
  
  // 2. เตรียมกล่องเก็บข้อมูลนักบาส "แค่คนเดียว" (ค่าเริ่มต้นคือ null หรือกล่องว่าง)
  const [player, setPlayer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // 3. สั่งเด็กเสิร์ฟไปทำงานทันทีที่เปิดหน้านี้
  useEffect(() => {
    fetch('/nba-data.json')
      .then(res => res.json())
      .then(data => {
        // 4. ความต่างอยู่ตรงนี้! 
        // เราใช้ .find() เพื่อค้นหาคนที่มี id ตรงกับ URL 
        // (ต้องแปลง id จาก URL ที่เป็นตัวหนังสือ ให้เป็นตัวเลขด้วย parseInt)
        const foundPlayer = data.find(p => p.id === parseInt(id))
        
        // หน่วงเวลาให้ดูเท่ๆ 0.5 วินาที
        setTimeout(() => {
          setPlayer(foundPlayer)
          setIsLoading(false)
        }, 200)
      })
      .catch(err => console.error("ดึงข้อมูลพัง:", err))
  }, [id]) // กล่องเงื่อนไขใส่ id ไว้: แปลว่า "ถ้า id บน URL เปลี่ยน ให้ไปดึงข้อมูลใหม่ด้วยนะ"

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
        // ถ้าหาไม่เจอ (เช่น พิมพ์มั่วๆ เป็น /player/999)
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
                <p className="text-3xl font-bold">{player.position === 'G' ? 'Guard' : 'Forward'}</p>
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

        </div>
      )}

    </div>
  )
}

export default PlayerProfile