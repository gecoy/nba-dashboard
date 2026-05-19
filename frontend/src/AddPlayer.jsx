import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function AddPlayer() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    team: '',
    position: 'G',
    number: '',
    ppg: '',
    apg: '',
    rpg: '',
    colorClass: 'bg-blue-600' // ค่าเริ่มต้น
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const playerToSave = {
      ...formData,
      number: parseInt(formData.number),
      ppg: parseFloat(formData.ppg),
      apg: parseFloat(formData.apg),
      rpg: parseFloat(formData.rpg),
    }

    const token = localStorage.getItem('token')

    fetch('http://localhost:8080/api/players', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(playerToSave)
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => { throw new Error(text) })
        }
        return res.json()
      })
      .then(data => {
        alert("เพิ่มนักบาสสำเร็จ! 🏀")
        navigate('/')
      })
      .catch(err => {
        alert(`เพิ่มไม่สำเร็จ: ${err.message}`)
      })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-gray-400 hover:text-white mb-8 inline-block">
          ← กลับหน้าหลัก
        </Link>
        
        <h1 className="text-4xl font-black mb-8 text-blue-500">เพิ่มนักกีฬาใหม่</h1>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6">
          <div>
            <label className="block text-gray-400 mb-2">ชื่อนักกีฬา</label>
            <input type="text" name="name" required className="w-full bg-gray-900 border border-gray-700 p-3 rounded" onChange={handleChange} />
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <label className="block text-gray-400 mb-2">ทีม</label>
              <input type="text" name="team" required className="w-full bg-gray-900 border border-gray-700 p-3 rounded" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">ตำแหน่ง</label>
              <select name="position" className="w-full bg-gray-900 border border-gray-700 p-3 rounded cursor-pointer" onChange={handleChange}>
                <option value="G">Guard (G)</option>
                <option value="F">Forward (F)</option>
                <option value="C">Center (C)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-2">หมายเลขเสื้อ</label>
              <input type="number" name="number" required className="w-full bg-gray-900 border border-gray-700 p-3 rounded" onChange={handleChange} />
            </div>
            
            {/* 👇 เพิ่มตัวเลือกสีธีมของทีมตรงนี้ */}
            <div>
  <label className="block text-gray-400 mb-2">สีธีมของทีม (การ์ดโปรไฟล์)</label>
  <select 
    name="colorClass" 
    value={formData.colorClass} 
    className="w-full bg-gray-900 border border-gray-700 p-3 rounded cursor-pointer text-white" 
    onChange={handleChange}
  >
    <option value="bg-blue-600">🔵 น้ำเงินเข้ม (Warriors / Mavs / Wolves / 76ers / Clippers / Pacers)</option>
    <option value="bg-sky-500">🌀 ฟ้า/น้ำเงินสว่าง (Nuggets / Thunder / Grizzlies / Magic)</option>
    <option value="bg-red-600">🔴 แดง (Bulls / Heat / Rockets / Raptors / Hawks / Wizards / Blazers)</option>
    <option value="bg-green-600">🟢 เขียว (Celtics / Bucks)</option>
    <option value="bg-purple-600">🟣 ม่วง (Lakers / Kings)</option>
    <option value="bg-orange-500">🟠 ส้ม (Suns / Knicks)</option>
    <option value="bg-amber-500">🟡 ทอง/เหลือง/ไวน์ (Cavs / Jazz / Pelicans)</option>
    <option value="bg-black">⚫ ดำ/เทา (Nets / Spurs)</option>
  </select>
</div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-400 mb-2">แต้ม (PPG)</label>
              <input type="number" step="0.1" name="ppg" required className="w-full bg-gray-900 border border-gray-700 p-3 rounded" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">แอสซิสต์ (APG)</label>
              <input type="number" step="0.1" name="apg" required className="w-full bg-gray-900 border border-gray-700 p-3 rounded" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">รีบาวน์ (RPG)</label>
              <input type="number" step="0.1" name="rpg" required className="w-full bg-gray-900 border border-gray-700 p-3 rounded" onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-4 transition">
            บันทึกข้อมูล
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddPlayer