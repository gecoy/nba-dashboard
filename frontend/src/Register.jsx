import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    fetch('http://localhost:8080/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (res.status === 201) {
          alert('สมัครสมาชิกสำเร็จแล้ว! 🎉')
          navigate('/login') // สมัครเสร็จให้เด้งไปหน้าล็อกอิน
        } else {
          alert('Username นี้อาจถูกใช้ไปแล้ว ลองเปลี่ยนดูใหม่นะ')
        }
      })
      .catch(err => console.error(err))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-black mb-6 text-center text-blue-500">สมัครสมาชิก 🏀</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Username</label>
            <input type="text" required className="w-full bg-gray-900 border border-gray-700 p-3 rounded" onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Password</label>
            <input type="password" required className="w-full bg-gray-900 border border-gray-700 p-3 rounded" onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-3 rounded-xl transition mt-2">
            สร้างบัญชีผู้ใช้
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400 text-sm">
          มีบัญชีอยู่แล้ว? <Link to="/login" className="text-blue-400 hover:underline">เข้าสู่ระบบที่นี่</Link>
        </p>
      </div>
    </div>
  )
}

export default Register