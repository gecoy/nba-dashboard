package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"golang.org/x/crypto/bcrypt"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

// สร้างโครงสร้างข้อมูลให้ตรงกับ Database
type Player struct {
	ID         int     `json:"id"`
	Name       string  `json:"name"`
	Team       string  `json:"team"`
	Position   string  `json:"position"`
	Number     int     `json:"number"`
	PPG        float64 `json:"ppg"`
	APG        float64 `json:"apg"`
	RPG        float64 `json:"rpg"`
	ColorClass string  `json:"colorClass"` // ฝั่ง JSON จะเรียก colorClass แบบ camelCase
}

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

var db *sql.DB
var jwtKey = []byte("my_ultra_secret_key_2026")

func main() {
	// 1. ดึงค่าจาก Environment Variables
	dbHost := os.Getenv("DB_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	// 2. ถ้าเผลอรันในเครื่อง แล้วค่าว่าง ให้ใช้ค่า Default เดิม
	if dbHost == "" {
		dbHost = "db"
	}
	if dbUser == "" {
		dbUser = "postgres"
	}
	if dbPass == "" {
		dbPass = "password"
	}
	if dbName == "" {
		dbName = "nba_db"
	}

	// 3. ประกอบร่าง string เชื่อมต่อ
	dbinfo := fmt.Sprintf("host=%s port=5432 user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbUser, dbPass, dbName)

	var err error
	// เปิดการเชื่อมต่อด้วย dbinfo ตัวใหม่ตัวเดียว
	db, err = sql.Open("postgres", dbinfo)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	r := mux.NewRouter()

	// --- ส่วนงาน API ---
	r.HandleFunc("/api/players", getPlayers).Methods("GET")
	r.HandleFunc("/api/players/{id}", getPlayerByID).Methods("GET")
	r.HandleFunc("/api/register", registerUser).Methods("POST")
	r.HandleFunc("/api/login", loginUser).Methods("POST")

	r.HandleFunc("/api/players", authMiddleware(createPlayer)).Methods("POST")
	r.HandleFunc("/api/players/{id}", authMiddleware(deletePlayer)).Methods("DELETE")
	r.HandleFunc("/api/players/{id}", authMiddleware(updatePlayer)).Methods("PUT")

	// ตั้งค่า CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})
	handler := c.Handler(r)

	fmt.Println("🚀 Backend Go รันอยู่บนพอร์ต 8080...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

// ฟังก์ชันดึงข้อมูลนักบาสทั้งหมด
// ฟังก์ชันดึงข้อมูลนักบาส (แบบมีค้นหาและจัดเรียง)
func getPlayers(w http.ResponseWriter, r *http.Request) {
	// 1. อ่านค่าจาก URL (Query Parameters)
	search := r.URL.Query().Get("search")
	sortType := r.URL.Query().Get("sort")

	// 2. เตรียมคำสั่ง SQL (ใช้ ILIKE เพื่อค้นหาชื่อแบบไม่สนใจตัวพิมพ์เล็ก/ใหญ่)
	query := "SELECT id, name, team, position, number, ppg, apg, rpg, color_class FROM players WHERE name ILIKE $1"

	// 3. เช็คว่าต้องเรียงลำดับแบบไหน แล้วต่อท้ายคำสั่ง SQL
	if sortType == "ppg" {
		query += " ORDER BY ppg DESC"
	} else if sortType == "apg" {
		query += " ORDER BY apg DESC"
	} else if sortType == "rpg" {
		query += " ORDER BY rpg DESC"
	} else {
		query += " ORDER BY id ASC" // ค่าเริ่มต้นเรียงตาม ID
	}

	// 4. ยิงคำสั่ง SQL ไปที่ Database (ใส่ "%" คร่อมคำค้นหาเพื่อให้หาคำที่อยู่ตรงกลางชื่อได้)
	rows, err := db.Query(query, "%"+search+"%")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var players []Player
	for rows.Next() {
		var p Player
		if err := rows.Scan(&p.ID, &p.Name, &p.Team, &p.Position, &p.Number, &p.PPG, &p.APG, &p.RPG, &p.ColorClass); err != nil {
			log.Fatal(err)
		}
		players = append(players, p)
	}

	// ถ้าไม่เจอใครเลย ให้ส่ง Array เปล่าๆ กลับไปแทนที่จะส่ง null
	if players == nil {
		players = []Player{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(players)
}

// ฟังก์ชันดึงข้อมูลนักบาสตาม ID (แค่คนเดียว)
func getPlayerByID(w http.ResponseWriter, r *http.Request) {
	// 1. อ่านค่า id จาก URL
	vars := mux.Vars(r)
	id := vars["id"]

	var p Player

	// 2. ไปหาใน Database ว่ามี id นี้ไหม (ใช้ $1 เพื่อป้องกัน SQL Injection)
	err := db.QueryRow("SELECT id, name, team, position, number, ppg, apg, rpg, color_class FROM players WHERE id = $1", id).
		Scan(&p.ID, &p.Name, &p.Team, &p.Position, &p.Number, &p.PPG, &p.APG, &p.RPG, &p.ColorClass)

	// 3. ถ้าหาไม่เจอ หรือพัง
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "ไม่พบข้อมูลนักกีฬา", http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	// 4. ถ้าหาเจอ ส่งข้อมูลกลับไปเป็น JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

// ฟังก์ชันเพิ่มนักบาสใหม่ลง Database
func createPlayer(w http.ResponseWriter, r *http.Request) {
	var p Player

	// 1. แกะกล่อง JSON ที่ React ส่งมา แล้วเอาไปใส่ในตัวแปร p
	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// 2. เตรียมคำสั่ง SQL (ใช้ RETURNING id เพื่อให้มันส่ง ID ที่เพิ่งสร้างกลับมาให้เราด้วย)
	sqlStatement := `
		INSERT INTO players (name, team, position, number, ppg, apg, rpg, color_class)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id`

	// 3. ยิงเข้า Database
	err = db.QueryRow(sqlStatement, p.Name, p.Team, p.Position, p.Number, p.PPG, p.APG, p.RPG, p.ColorClass).Scan(&p.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// 4. ส่งข้อมูลที่สร้างเสร็จแล้ว (พร้อม ID ใหม่) กลับไปให้ React
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

// ฟังก์ชันลบข้อมูลนักบาส
func deletePlayer(w http.ResponseWriter, r *http.Request) {
	// 1. อ่านค่า id จาก URL
	vars := mux.Vars(r)
	id := vars["id"]

	// 2. สั่ง SQL ลบแถวที่มี id ตรงกัน
	_, err := db.Exec("DELETE FROM players WHERE id = $1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// 3. ส่งสถานะ 200 OK กลับไปบอก React ว่าลบสำเร็จแล้ว
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "ลบข้อมูลสำเร็จ"}`))
}

// ฟังก์ชันแก้ไขข้อมูลนักบาส
func updatePlayer(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var p Player
	// แกะกล่อง JSON ที่ส่งมา
	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// สั่ง SQL ให้อัปเดตข้อมูลตาม id
	// ⭐️ เพิ่ม color_class = $8 และขยับ id ไปเป็น $9
	sqlStatement := `
		UPDATE players
		SET name = $1, team = $2, position = $3, number = $4, ppg = $5, apg = $6, rpg = $7, color_class = $8
		WHERE id = $9`

	// ⭐️ อย่าลืมเพิ่ม p.ColorClass เข้าไปในวงเล็บด้วย
	_, err = db.Exec(sqlStatement, p.Name, p.Team, p.Position, p.Number, p.PPG, p.APG, p.RPG, p.ColorClass, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "อัปเดตข้อมูลสำเร็จ"}`))
}

// 1. ฟังก์ชันสมัครสมาชิก
func registerUser(w http.ResponseWriter, r *http.Request) {
	var creds User
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, "ข้อมูลไม่ถูกต้อง", http.StatusBadRequest)
		return
	}

	// แฮชรหัสผ่านก่อนบันทึก (ห้ามเก็บรหัสตรงๆ เด็ดขาด!)
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "เซฟรหัสผ่านพัง", http.StatusInternalServerError)
		return
	}

	// บันทึกลงฐานข้อมูล
	_, err = db.Exec("INSERT INTO users (username, password) VALUES ($1, $2)", creds.Username, string(hashedPassword))
	if err != nil {
		http.Error(w, "Username นี้ถูกใช้ไปแล้ว", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(`{"message": "สมัครสมาชิกสำเร็จ"}`))
}

// 2. ฟังก์ชันเข้าสู่ระบบ
func loginUser(w http.ResponseWriter, r *http.Request) {
	var creds User
	json.NewDecoder(r.Body).Decode(&creds)

	var dbPassword string
	err := db.QueryRow("SELECT password FROM users WHERE username = $1", creds.Username).Scan(&dbPassword)
	if err != nil {
		http.Error(w, "ไม่พบชื่อผู้ใช้งานนี้ หรือรหัสผ่านผิด", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(dbPassword), []byte(creds.Password))
	if err != nil {
		http.Error(w, "รหัสผ่านไม่ถูกต้อง", http.StatusUnauthorized)
		return
	}

	// ⭐️--- เริ่มต้นสร้างตั๋ว JWT ตัวจริง ตรงนี้ ---
	// 1. ตั้งเวลาหมดอายุของตั๋ว (ตัวอย่างนี้ให้หมดอายุภายใน 24 ชั่วโมง)
	expirationTime := time.Now().Add(24 * time.Hour)

	// 2. ใส่ข้อมูลเคลมลงไปในตั๋ว (ใส่ชื่อ username และเวลาหมดอายุลงไป)
	claims := jwt.MapClaims{
		"username": creds.Username,
		"exp":      expirationTime.Unix(),
	}

	// 3. ใช้ Algorithm วิธีการเข้ารหัสแบบ HS256 ปิดผนึกตั๋ว
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// 4. เซ็นชื่อกำกับด้วย Secret Key ของเรา ออกมาเป็นข้อความ String ยาวๆ
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "สร้างตั๋วพัง", http.StatusInternalServerError)
		return
	}

	// 5. ส่ง Token กลับไปให้ฝั่ง React นำไปใช้งาน
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":   "success",
		"message":  "เข้าสู่ระบบสำเร็จ!",
		"token":    tokenString, // 👈 ส่งตั๋วนี้ไปให้ React
		"username": creds.Username,
	})
}

// ฟังก์ชัน Middleware สำหรับตรวจตั๋ว JWT
func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 1. ดึงข้อมูลจาก Header ที่ชื่อว่า "Authorization"
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "กรุณาเข้าสู่ระบบก่อนทำรายการ (ไม่มี Token)", http.StatusUnauthorized)
			return
		}

		// ปกติหน้าบ้านจะส่งมาในรูปแบบ "Bearer <token_string>" เราต้องตัดคำว่า "Bearer " ออกก่อน
		tokenString := authHeader
		if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
			tokenString = authHeader[7:]
		}

		// 2. แกะกล่องและตรวจสอบความถูกต้องของ Token ด้วย Secret Key ของเรา
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		// 3. ถ้าตั๋วปลอม ตั๋วหมดอายุ หรือพัง
		if err != nil || !token.Valid {
			http.Error(w, "ตั๋วหมดอายุหรือไม่มีสิทธิ์ใช้งาน", http.StatusUnauthorized)
			return
		}

		// 4. ถ้าตั๋วผ่านฉลุย ให้เดินไปทำงานที่ฟังก์ชันถัดไปได้เลย
		next.ServeHTTP(w, r)
	}
}
