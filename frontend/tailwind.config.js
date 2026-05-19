/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // 👇 เพิ่ม safelist ตรงนี้ เพื่อบังคับไม่ให้ Tailwind ลบสีเหล่านี้ทิ้ง
  safelist: [
    'bg-blue-600',   // น้ำเงินเข้ม (Warriors, Mavericks, Timberwolves, 76ers, Clippers, Pacers)
    'bg-sky-500',    // ฟ้า/น้ำเงินสว่าง (Nuggets, Grizzlies, Thunder, Magic)
    'bg-red-600',    // แดง (Bulls, Heat, Rockets, Raptors, Hawks, Wizards, Trail Blazers)
    'bg-green-600',  // เขียว (Celtics, Bucks)
    'bg-purple-600', // ม่วง (Lakers, Kings)
    'bg-orange-500', // ส้ม (Suns, Knicks)
    'bg-black',      // ดำ/เทาเข้ม (Nets, Spurs)
    'bg-amber-500',  // เหลือง/ทอง/ไวน์แดง (Cavaliers, Jazz, Pelicans)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}