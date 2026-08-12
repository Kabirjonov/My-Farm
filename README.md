# My Farm — Agrotexnik va Chorvachilik Boshqaruv Appi

`My Farm` — Zamonaviy fermerlar, chorvadorlar va agronomlar uchun mo'ljallangan offlayn rejimda ishlovchi (Offline-First) React Native & Expo mobile ilovasi.

---

## 🚀 Texnologik Stak va Arxitektura

- **Framework:** Expo (SDK 54) & React Native 0.81.5
- **Routing:** Expo Router v6 (File-based routing)
- **Local Database:** Expo SQLite (`expo-sqlite`)
- **Offline Sync:** Custom `sync_queue` engine with Last-Write-Wins (LWW) conflict resolution strategy.
- **State Management:** TanStack React Query v5 & Zustand v5
- **Forms & Validation:** React Hook Form & Zod
- **Notifications:** Expo Notifications (`expo-notifications`)
- **Testing:** Jest & ts-jest

---

## 📂 Loyiha Tuzilishi (`src/`)

```
src/
├── app/                  # Expo Router ekranlari (Dashboard, Animals, Feed, Fields, Finance, Reports, Settings)
├── components/           # Qayta ishlatiluvchi UI komponentlar (StatCard, QuickActionButton, AppSelect, etc.)
├── constants/            # Ranglar va dizayn tokenlari (Colors, Spacing)
├── features/             # Domen modullari (auth, livestock, feed, crops, health, finance, sync, notifications)
├── lib/
│   └── db/              # SQLite ma'lumotlar bazasi, migratsiyalar hamda repozitoriy qatlami
├── types/                # Domain TypeScript interfeyslari (Animal, FeedItem, LandField, Expense, etc.)
└── utils/                # Yordamchi instrumentlar (UUID generator, formaterlar)
```

---

## 🛠️ O'rnatish va Ishga Tushirish (Installation & Run)

### 1. Talablar
- Node.js >= 18.0.0
- npm >= 9.0.0
- Expo Go App (Android telefoningizda v54.0.8 ga mos keladi) yoki Android Studio Emulator.

### 2. O'rnatish
```bash
# Modullarni o'rnatish
npm install --legacy-peer-deps
```

### 3. Ilovani Ishga Tushirish
```bash
# Metro Bundler ni yaratish
npm start

# Android qurilma/emulyatorda native build
npm run android

# Web versiyasini tekshirish
npm run web
```

---

## 🧪 Testlash va Sifat Tekshiruvi (Testing & Quality)

```bash
# TypeScript strict turni tekshirish
npm run typecheck

# ESLint linter tekshiruvi
npm run lint

# Jest Unit va Schema testlarini yuritish
npm test
```

---

## 📱 Release va Build Yo'riqnomasi (EAS Build)

Ilovani Android `.apk` yoki `.aab` formatida yig'ish uchun:

```bash
# Expo CLI ga kirish
npx eas-cli login

# Android Preview APK yaratish (Telefon testlari uchun)
npx eas-cli build --profile preview --platform android

# Android Production AAB yaratish (Google Play Store uchun)
npx eas-cli build --profile production --platform android
```

---

## 📶 Offline Sync & Konfliktlarni Hal Qilish (Architecture Note)

Ilova **Offline-First** tamoyiliga asoslangan:
1. Har qanday yaratish, yangilash yoki arxivlash amallari avval mahalliy **SQLite** bazasiga saqlanadi.
2. Har bir operatsiya `sync_queue` jadvaliga `PENDING` holatida yoziladi.
3. Internet tarmog'i tiklanganda `syncService.processSyncQueue()` chaqirilib, o'zgarishlar bulutli backend bilan sinxronlanadi.
4. **Conflict Resolution Strategy:** Bitta ma'lumot bir vaqtning o'zida bir nechta qurilmada o'zgarsa, oxirgi kiritilgan o'zgarish (`updatedAt` timestamp) **Last-Write-Wins (LWW)** tamoyili bo'yicha saqlanib qoladi.

---

## 📋 Manual QA Tekshiruv Ro'yxati (Checklist)

| № | Modul | Tekshiruv Sharti | Natija |
|---|---|---|---|
| 1 | **Dashboard** | Bosh ekranda chorva, yem va oylik sof foyda kartalari to'g'ri ko'rinishi | ✅ O'tdi |
| 2 | **Auth/Roles** | `OWNER`, `MANAGER`, `WORKER` rollari o'zgarganda ruxsatlar cheklanishi | ✅ O'tdi |
| 3 | **Chorvachilik** | Yangi hayvon qo'shish, zot/teg takrorlanmasligi va filterlar ishlashi | ✅ O'tdi |
| 4 | **Sog'liq/Emlash** | Emlash sanasi kiritilganda taqvim eslatmasi yaratilishi | ✅ O'tdi |
| 5 | **Ozuqa Boshqaruvi** | Chiqim (`OUT`) tranzaksiyasi yem miqdorini kamaytirishi va kam qolganda ogohlantirish | ✅ O'tdi |
| 6 | **Yer & Ekinlar** | Hosil yig'imi sotilganda tushum avtomatik moliya daromadlariga o'tishi | ✅ O'tdi |
| 7 | **Moliya/Hisobot** | Oylik xarajat, daromad hamda 5 xil tahliliy hisobotlarning real ko'rinishi | ✅ O'tdi |
| 8 | **Offline Sync** | Internet o'chirilganda SQLite saqlanishi va online bo'lganda navbat sinxronlanishi | ✅ O'tdi |
