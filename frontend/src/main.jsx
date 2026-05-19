import React from 'react'
import ReactDOM from 'react-dom/client'

// นำเข้าเครื่องมือสร้างแผนที่
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.jsx'
import PlayerProfile from './PlayerProfile.jsx'

// 👇 จุดที่ 1: นำเข้าไฟล์ AddPlayer
import AddPlayer from './AddPlayer.jsx'
import EditPlayer from './EditPlayer.jsx'

import Register from './Register.jsx'
import Login from './Login.jsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* คลุมแอปของเราด้วย BrowserRouter เพื่อเปิดระบบเปลี่ยนหน้า */}
    <BrowserRouter>
      <Routes>
        {/* กฎข้อที่ 1: ถ้าผู้ใช้เข้าเว็บหน้าแรก ("/") ให้แสดงห้อง App (Dashboard) */}
        <Route path="/" element={<App />} />

        {/* กฎข้อที่ 2: ถ้าเข้าลิงก์ /player/ตามด้วยเลขอะไรก็ตาม ให้แสดงห้อง PlayerProfile */}
        <Route path="/player/:id" element={<PlayerProfile />} />

        {/* 👇 จุดที่ 2: เพิ่มกฎข้อที่ 3 ถ้าเข้าลิงก์ /add ให้ไปหน้าฟอร์มเพิ่มนักกีฬา */}
        <Route path="/add" element={<AddPlayer />} />

        <Route path="/edit/:id" element={<EditPlayer />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)