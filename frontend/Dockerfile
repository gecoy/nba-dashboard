# --- Stage 1: สร้างหน้าเว็บ ---
FROM node:20-alpine AS build
WORKDIR /app
# ก๊อปปี้ package.json ไปลง dependencies ก่อน
COPY package*.json ./
RUN npm install
# ก๊อปปี้โค้ด React ทั้งหมดไป Build (แปลงเป็นไฟล์ HTML/CSS/JS ธรรมดา)
COPY . .
RUN npm run build

# --- Stage 2: เอาเว็บไปรันบน Nginx ---
FROM nginx:alpine
# ก๊อปปี้ไฟล์ที่ Build เสร็จจาก Stage 1 มาใส่ในโฟลเดอร์ของ Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# เปิดประตูหมายเลข 80 (พอร์ตมาตรฐานของเว็บไซต์)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]