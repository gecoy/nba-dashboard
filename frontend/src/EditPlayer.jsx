import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

function EditPlayer() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '', team: '', position: 'G', number: '', ppg: '', apg: '', rpg: '', colorClass: 'bg-blue-600'
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch(`http://localhost:8080/api/players/${id}`)
            .then(res => res.json())
            .then(data => {
                setFormData(data)
                setIsLoading(false)
            })
            .catch(err => console.error("ดึงข้อมูลพัง:", err))
    }, [id])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const playerToUpdate = {
            ...formData,
            number: parseInt(formData.number),
            ppg: parseFloat(formData.ppg),
            apg: parseFloat(formData.apg),
            rpg: parseFloat(formData.rpg),
        }

        const token = localStorage.getItem('token')

        fetch(`http://localhost:8080/api/players/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(playerToUpdate)
        })
            .then(res => {
                if (!res.ok) {
                    return res.text().then(text => { throw new Error(text) })
                }
                alert("แก้ไขข้อมูลสำเร็จ! 🏀")
                navigate(`/player/${id}`)
            })
            .catch(err => alert(`แก้ไขไม่สำเร็จ: ${err.message}`))
    }

    if (isLoading) return <div className="text-center text-white mt-20 text-2xl">กำลังโหลดข้อมูลเดิม...</div>

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-2xl mx-auto">
                <Link to={`/player/${id}`} className="text-gray-400 hover:text-white mb-8 inline-block font-bold">
                    ← ยกเลิกและกลับไปหน้าโปรไฟล์
                </Link>
                <h1 className="text-4xl font-black mb-8 text-yellow-500">✏️ แก้ไขข้อมูลนักกีฬา</h1>

                <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2">ชื่อนักกีฬา</label>
                        <input type="text" name="name" value={formData.name} required className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-white" onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2">
                            <label className="block text-gray-400 mb-2">ทีม</label>
                            <input type="text" name="team" value={formData.team} required className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-white" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">ตำแหน่ง</label>
                            <select name="position" value={formData.position} className="w-full bg-gray-900 border border-gray-700 p-3 rounded cursor-pointer" onChange={handleChange}>
                                <option value="G">Guard (G)</option>
                                <option value="F">Forward (F)</option>
                                <option value="C">Center (C)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">หมายเลขเสื้อ</label>
                            <input type="number" name="number" value={formData.number} required className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-white" onChange={handleChange} />
                        </div>

                        {/* 👇 เพิ่มตัวเลือกสีในหน้าแก้ไขด้วย */}
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
                            <input type="number" step="0.1" name="ppg" value={formData.ppg} required className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-white" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">แอสซิสต์ (APG)</label>
                            <input type="number" step="0.1" name="apg" value={formData.apg} required className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-white" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">รีบาวน์ (RPG)</label>
                            <input type="number" step="0.1" name="rpg" value={formData.rpg} required className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-white" onChange={handleChange} />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 rounded-xl mt-4 transition">
                        💾 บันทึกการแก้ไข
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EditPlayer