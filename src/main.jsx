import React from 'react'
import ReactDOM from 'react-dom/client'
// นำเข้าเครื่องมือสร้างแผนที่
import { BrowserRouter, Routes, Route } from 'react-router-dom' 

import App from './App.jsx'
import PlayerProfile from './PlayerProfile.jsx'
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
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)