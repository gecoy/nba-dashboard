import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('รหัสผ่านผิดหรือไม่มีบัญชีนี้')
      })
      .then(data => {
        alert(data.message)
        
        // ⭐️ เปลี่ยนมาเก็บ Token ของจริงที่ส่งมาจาก Go ลงคลังข้อมูล Browser
        localStorage.setItem('token', data.token) 
        localStorage.setItem('username', data.username)
        
        navigate('/') // พาเด้งกลับหน้าหลัก
      })
      .catch(err => alert(err.message))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-black mb-6 text-center text-green-500">เข้าสู่ระบบ 🔒</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Username</label>
            <input type="text" required className="w-full bg-gray-900 border border-gray-700 p-3 rounded" onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Password</label>
            <input type="password" required className="w-full bg-gray-900 border border-gray-700 p-3 rounded" onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-500 font-bold py-3 rounded-xl transition mt-2">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400 text-sm">
          ยังไม่มีบัญชี? <Link to="/register" className="text-green-400 hover:underline">สมัครสมาชิกที่นี่</Link>
        </p>
      </div>
    </div>
  )
}

export default Login