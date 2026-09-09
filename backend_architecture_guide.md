# 🌾 My Farm — Python Backend Texnik Topshiriq va Arxitektura Hujjati

Ushbu hujjat **"My Farm"** mobil ilovasi uchun **Python** tilida yuqori unumdorlikka ega, xavfsiz va **Offline-Sync (Sinxronizatsiya)** mexanizmiga mos keluvchi Backend serverini qurish uchun to'liq texnik qo'llanma hisoblanadi.

---

## 🛠️ 1. Tavsiya Etiladigan Python Texnologiyalar Steki (Tech Stack)

| Qatlam | Tavsiya Etilgan Texnologiya | Sababi va Afzalligi |
|---|---|---|
| **Framework** | **FastAPI** *(yoki Django REST Framework)* | Asinxron (async/await) tezlik, avtomatik Pydantic va Swagger UI (`/docs`) hujjatlanishi. |
| **Ma'lumotlar Bazasi** | **PostgreSQL** (+ PostGIS kengaytmasi) | Relatsion relieshonlik, SQL tranzaksiyalar xavfsizligi, va yer maydonlari ko'rinishini saqlash. |
| **ORM (DB Layer)** | **SQLAlchemy v2.0** + **Alembic** | Bazani Python obyektlari sifatida boshqarish va migratsiyalarni avtomatlashtirish. |
| **Authentication** | **PyJWT** + **Passlib (Bcrypt)** | JWT (Access + Refresh Token) va parollarni xavfsiz heshlash. |
| **Caching & Queue** | **Redis** + **Celery** | Sekin topshiriqlarni (bildirishnomalar, sinxronlash va ogohlantirishlarni) fonda bajarish. |
| **Konteynerlashtirish**| **Docker** + **Docker Compose** | Server va muhitni bitta buyruq bilan ishga tushirish. |

---

## 🔐 2. Autentifikatsiya va Rollar Boshqaruvi (Auth & RBAC)

Backend **JWT (JSON Web Token)** standarti bo'yicha ishlaydi.

### A) Token Tuzilishi:
- **Access Token:** Umri 15 daqiqa - 1 soat (har bir API so'rovining `Authorization: Bearer <token>` sarlavhasida yuboriladi).
- **Refresh Token:** Umri 30 kun (yangi access token olish uchun).

### B) Rollar Boshqaruvi Matrix (RBAC):
- **`OWNER` (Fermer/Ega):** Barcha huquqlarga ega (xodim qo'shish, moliyaviy o'chirishlar, ferma yaratish).
- **`MANAGER` (Boshqaruvchi):** Hayvonlar, yem va yer amallarini bajaradi, lekin o'chirish huquqi cheklangan.
- **`WORKER` (Ishchi):** Faqat belgilangan yer va chorva yozuvlarini o'qish hamda ozuqa chiqimini kiritish huquqiga ega.
- **`VET` (Veterinar):** Hayvonlar sog'lig'i, emlash va dori xarajatlarini kiritish huquqiga ega.
- **`VIEWER` (Kuzatuvchi):** Faqat ko'rish huquqi (`READ_ONLY`).

---

## 🗄️ 3. Ma'lumotlar Bazasi Strukturasi (Database Schema / ERD)

PostgreSQL bazasida yaratiladigan asosiy jadvallar va ularning maydonlari:

### 1. `users` (Foydalanuvchilar)
- `id` (UUID, PK)
- `email` (String, Unique)
- `hashed_password` (String)
- `full_name` (String)
- `phone` (String, Optional)
- `role` (Enum: `OWNER`, `MANAGER`, `WORKER`, `VET`, `VIEWER`)
- `created_at` (Timestamp)

### 2. `farms` (Fermalar)
- `id` (UUID, PK)
- `owner_id` (UUID, FK -> `users.id`)
- `name` (String)
- `location` (String)
- `created_at` (Timestamp)

### 3. `animals` (Chorva Mollari)
- `id` (UUID, PK) — *Mobil ilova yaratgan UUID bilan bir xil saqlanadi*
- `farm_id` (UUID, FK -> `farms.id`)
- `tag_number` (String, Unique per farm) — Masalan: `QOY-001`
- `name` (String, Optional)
- `type` (Enum: `SHEEP`, `COW`, `GOAT`, `HORSE`, `CHICKEN`, `OTHER`)
- `breed` (String)
- `gender` (Enum: `MALE`, `FEMALE`, `UNKNOWN`)
- `birth_date` (Date)
- `weight_kg` (Float)
- `purchase_price` (Float, Optional)
- `status` (Enum: `ACTIVE`, `SOLD`, `DEAD`, `ARCHIVED`)
- `health_status` (Enum: `HEALTHY`, `SICK`, `TREATMENT`, `PREGNANT`, `UNKNOWN`)
- `updated_at` (Timestamp)

### 4. `health_records` (Sog'liq va Veterinar Yozuvlari)
- `id` (UUID, PK)
- `animal_id` (UUID, FK -> `animals.id`)
- `diagnosis` (String)
- `treatment` (Text)
- `cost` (Float)
- `veterinarian_name` (String)
- `check_date` (Date)

### 5. `vaccination_records` (Emlash Yozuvlari)
- `id` (UUID, PK)
- `animal_id` (UUID, FK -> `animals.id`)
- `vaccine_name` (String)
- `administered_date` (Date)
- `next_due_date` (Date, Optional)

### 6. `breeding_records` (Urchitish/Tug'ish)
- `id` (UUID, PK)
- `mother_id` (UUID, FK -> `animals.id`)
- `father_id` (UUID, FK -> `animals.id`, Optional)
- `mating_date` (Date)
- `expected_birth_date` (Date)
- `actual_birth_date` (Date, Optional)

### 7. `feed_items` (Ozuqa Zaxirasi)
- `id` (UUID, PK)
- `farm_id` (UUID, FK -> `farms.id`)
- `name` (String) — Masalan: `Yorib beriladigan bezi`, `Silos`
- `current_quantity` (Float)
- `min_quantity` (Float) — Minimal ogohlantirish chegarasi
- `unit` (Enum: `KG`, `TON`, `BALE`, `LITER`)

### 8. `feed_transactions` (Yem Kirim/Chiqimi)
- `id` (UUID, PK)
- `feed_id` (UUID, FK -> `feed_items.id`)
- `type` (Enum: `IN`, `OUT`, `WASTE`, `ADJUSTMENT`)
- `quantity` (Float)
- `cost_per_unit` (Float, Optional)
- `date` (Date)
- `notes` (Text)

### 9. `land_fields` (Yer Maydonlari)
- `id` (UUID, PK)
- `farm_id` (UUID, FK -> `farms.id`)
- `name` (String) — Masalan: `Janubiy Dala #1`
- `area` (Float)
- `area_unit` (Enum: `HECTARE`, `SOTIX`, `SQM`)
- `soil_type` (String)
- `water_source` (String)

### 10. `crop_seasons` (Ekin Mavsumlari)
- `id` (UUID, PK)
- `field_id` (UUID, FK -> `land_fields.id`)
- `crop_name` (String) — Masalan: `Bug'doy`, `Makkajo'xori`
- `planted_date` (Date)
- `expected_harvest_date` (Date)
- `status` (Enum: `PLANTED`, `GROWING`, `HARVESTED`, `FAILED`)

### 11. `harvest_records` (Hosil Yig'im Yozuvlari)
- `id` (UUID, PK)
- `crop_season_id` (UUID, FK -> `crop_seasons.id`)
- `yield_quantity` (Float)
- `quality` (Enum: `HIGH`, `MEDIUM`, `LOW`)
- `revenue` (Float, Optional)

### 12. `expenses` (Xarajatlar) & `incomes` (Daromadlar)
- `id` (UUID, PK)
- `farm_id` (UUID, FK -> `farms.id`)
- `title` (String)
- `category` (Enum: `FEED`, `MEDICINE`, `VET`, `WORKER`, `SEED`, `FERTILIZER`, `ANIMAL_SALE`, `MILK`, `MEAT`, `HARVEST`, `OTHER`)
- `amount` (Float)
- `date` (Date)
- `related_entity_id` (UUID, Optional)

---

## 📡 4. RESTful API Endpoints Ro'yxati

### 🔑 Auth API (`/api/v1/auth`)
- `POST /api/v1/auth/register` — Yangi fermer va ferma yaratish
- `POST /api/v1/auth/login` — E-mail va parol orqali tizimga kirish (Returns JWT Tokens)
- `POST /api/v1/auth/refresh` — Access tokenni yangilash
- `GET /api/v1/auth/me` — Joriy foydalanuvchi va uning rolini olish

### 🐄 Animals API (`/api/v1/animals`)
- `GET /api/v1/animals` — Fermaning barcha faol hayvonlarini olish (Query params: `search`, `type`, `health_status`, `page`)
- `GET /api/v1/animals/{id}` — Hayvon tafsilotlari, emlash va sog'liq tarixi bilan
- `POST /api/v1/animals` — Yangi hayvon ro'yxatga olish
- `PUT /api/v1/animals/{id}` — Hayvon ma'lumotlarini tahrirlash
- `DELETE /api/v1/animals/{id}` — Hayvonni arxivlash/sotildi deb belgilash

### 🌾 Feed API (`/api/v1/feed`)
- `GET /api/v1/feed` — Yem-xashak zaxiralari ro'yxati va kam qolganlar statistikasi
- `POST /api/v1/feed` — Yangi ozuqa turini kiritish
- `POST /api/v1/feed/transactions` — Yem kirim/chiqim tranzaksiyasi kiritish (Zaxira avtomatik kamayadi/ko'payadi)

### 🌱 Land & Crops API (`/api/v1/fields`)
- `GET /api/v1/fields` — Yer maydonlari ro'yxati
- `POST /api/v1/fields` — Yangi yer qo'shish
- `POST /api/v1/fields/{id}/crops` — Yerga ekin ekish mavsumini boshlash
- `POST /api/v1/fields/harvests` — Hosil yig'imi va sotuv daromadlarini kiritish

### 💰 Finance & Reports API (`/api/v1/finance`)
- `GET /api/v1/finance/summary` — Oylik xarajat, daromad va sof foydani hisoblash
- `POST /api/v1/finance/expenses` — Yangi xarajat kiritish
- `POST /api/v1/finance/incomes` — Yangi daromad kiritish
- `GET /api/v1/finance/reports` — 5 xil tahliliy hisobot ma'lumotlarini olish

### 🔄 Sync API (`/api/v1/sync`) — **ENG MUHIM ENDPOINT**
- `POST /api/v1/sync/batch` — Offline navbatdagi barcha poyezdlarni bitta so'rovda serverga yuborish (Batch Sync)
- `GET /api/v1/sync/delta?last_synced_at=TIMESTAMP` — Oxirgi sinxronlanishdan berli serverda o'zgargan yangi ma'lumotlarni yuklab olish.

---

## ⚡ 5. Offline Sinxronizatsiya va Konfliktlarni Hal Qilish (Sync Engine Logic)

Mobil ilova internetsiz ishlashi va internet ulaganda server bilan muammosiz ma'lumot almashishi uchun Backend quyidagi mantiqqa rioya qilishi kerak:

### A) Idempotentlik (Idempotent Requests):
Har bir mobil so'rov o'zi bilan `client_mutation_id` (UUID) yuboradi. Agar tarmoq uzilib qayta yuborilsa, backend bir xil tranzaksiyani bazaga ikki marta yozib qo'ymaydi (Deduplication).

### B) Id (UUID) Generatsiya:
Barcha obyekt ID lari (`animal_id`, `expense_id`, va h.k.) **mobil ilovaning o'zida UUID v4** ko'rinishida yaratiladi. Backend ularni o'zgartirmasdan xuddi shu ID bilan bazaga saqlaydi.

### C) Last-Write-Wins (So'nggi O'zgarish G'olib):
Agar bitta hayvon ma'lumotini ikkita ishchi har xil telefonda bir vaqtda o'zgartirgan bo'lsa, backend serverga eng oxirida yetib kelgan `updated_at` timestampsiga ega ma'lumotni ustun deb biladi.

---

## 🚀 6. Backend Dasturchi uchun Boshlash Ketma-ketligi (Action Plan)

1. **Loyihani sozlash:** FastAPI va SQLAlchemy 2.0 bilan loyiha strukturasini yaratish.
2. **PostgreSQL DB Migratsiya:** `Alembic` orqali yuqoridagi 12 ta jadval schema-larini yaratish.
3. **JWT Auth & Role Middleware:** `/register`, `/login` hamda `@require_role(["OWNER", "MANAGER"])` dekoratorini yozish.
4. **CRUD APIdelarni yozish:** Animals, Feed, Fields, Finance bo'limlari uchun REST endpointlarni yakunlash.
5. **`/api/v1/sync/batch` endpointini yozish:** Mobil ilovadan kelayotgan JSON navbatini tranzaksiya ichida bazaga yozish.
6. **Swagger UI orqali test qilish:** `http://localhost:8000/docs` da barcha endpointlarni tekshirish va mobil ilovaning `syncService.ts` faylidagi URL ga ulash!

---

*Hujjat "My Farm" loyihasi doirasida barcha texnik talablar va standartlarga javob beradigan tarzda shakllantirildi.*
