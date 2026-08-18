export type Language = 'uz' | 'ru';

export const translations = {
  uz: {
    // App & Nav
    appName: "My Farm Boshqaruvi",
    dashboard: "Bosh Sahifa",
    livestock: "Hayvonlar",
    feed: "Yem-Xashak",
    fields: "Yer va Ekinlar",
    reports: "Hisobotlar",
    finance: "Moliya",
    settings: "Sozlamalar",
    tasks: "Vazifalar",

    // Common UI
    save: "Saqlash",
    cancel: "Bekor qilish",
    delete: "O'chirish",
    edit: "Tahrirlash",
    add: "Qo'shish",
    back: "Orqaga",
    search: "Qidirish...",
    all: "Barchasi",
    actions: "Amallar",
    status: "Holati",
    notes: "Izohlar",
    date: "Sana",
    amount: "Summa",
    quantity: "Miqdori",
    price: "Narxi",
    unit: "Birligi",
    total: "Jami",
    retry: "Qayta urinish",
    confirm: "Tasdiqlash",
    success: "Muvaffaqiyatli",
    error: "Xatolik",
    noData: "Ma'lumot topilmadi",

    // Language Switcher
    language: "Tizim Tili (Language)",
    selectLanguage: "Tilni tanlang",
    langUz: "O'zbekcha 🇺🇿",
    langRu: "Русский 🇷🇺",

    // Animal Types
    typeSHEEP: "Qo'y",
    typeCOW: "Mol / Sig'ir",
    typeGOAT: "Echki",
    typeHORSE: "Ot",
    typeCHICKEN: "Tovuq / Parranda",
    typeOTHER: "Boshqa",

    // Animal Status
    statusACTIVE: "Faol (Suruvda)",
    statusSOLD: "Sotilgan",
    statusDEAD: "Nobud bo'lgan",
    statusARCHIVED: "Arxivlangan",

    // Health Status
    healthHEALTHY: "Sog'lom",
    healthSICK: "Kasal",
    healthTREATMENT: "Davolanishda",
    healthPREGNANT: "Homilador",
    healthUNKNOWN: "Noma'lum",

    // Feed Transaction Types
    transIN: "Kirim (Satib olindi)",
    transOUT: "Chiqim (Yedirildi)",
    transWASTE: "Isrofgarchilik (Zarar)",
    transADJUSTMENT: "Tuzatish (Qayta hisob)",

    // Crop Status
    cropPLANNED: "Rejalashtirilgan",
    cropPLANTED: "Ekilgan",
    cropGROWING: "O'smoqda",
    cropHARVESTED: "Yig'ib olingan",
    cropFAILED: "Hosil bermadi (Zarar)",
    cropARCHIVED: "Arxivlangan",

    // Harvest Quality
    qualityHIGH: "Yuqori Sifat (A+)",
    qualityMEDIUM: "O'rta Sifat",
    qualityLOW: "Past Sifat",
    qualityMIXED: "Aralash Sifat",

    // Area Units
    unitHECTARE: "Gektar (ga)",
    unitSOTIX: "Sotix",
    unitSQM: "Kvadrat metr (m²)",

    // Expense Categories
    expFEED: "Ozuqa / Yem xarajati",
    expMEDICINE: "Dori-darmon xarajati",
    expVET: "Veterinariya xizmati",
    expWORKER: "Ishchilar maoshi",
    expSEED: "Urug'lik xarajati",
    expFERTILIZER: "O'g'it va minerallar",
    expWATER: "Suv va sug'orish",
    expTRANSPORT: "Transport / Yoqilg'i",
    expEQUIPMENT: "Texnika va uskuna",
    expOTHER: "Boshqa xarajat",

    // Income Categories
    incANIMAL_SALE: "Chorva sotuvidan",
    incMILK: "Sut sotuvidan",
    incMEAT: "Go'sht sotuvidan",
    incWOOL: "Yung sotuvidan",
    incEGG: "Tuxum sotuvidan",
    incHARVEST: "Hosil sotuvidan",
    incOTHER: "Boshqa daromad",

    // User Roles
    roleOWNER: "Ega (Owner)",
    roleMANAGER: "Boshqaruvchi (Manager)",
    roleWORKER: "Ishchi (Worker)",
    roleVET: "Veterinar (Vet)",
    roleVIEWER: "Kuzatuvchi (Viewer)",

    // Sync Status
    syncSYNCED: "Sinxronlangan 🟢",
    syncSYNCING: "Sinxronlanmoqda 🟡",
    syncFAILED: "Xatolik yuz berdi 🔴",
    syncOFFLINE: "Offline rejim 🔴",

    // Dashboard Titles
    welcome: "Xush kelibsiz",
    quickActions: "Tezkor Amallar",
    reminders: "Eslatmalar va Taqvim",
    totalAnimals: "Chorva Bosh Soni",
    sheepCowRatio: "Qo'y / Mol",
    sickPregnant: "Kasal / Homilador",
    lowStockFeed: "Kam Qolgan Yemlar",
    activeLand: "Faol Yer Maydoni",
    netProfit: "Sof Oylik Foyda",

    // Sub-screens & Forms
    addAnimal: "Hayvon Qo'shish",
    editAnimal: "Hayvonni Tahrirlash",
    feedKirimChiqim: "Yem Kirim/Chiqim",
    financeAction: "Xarajat / Daromad",
    healthAction: "Sog'liq Yozuvi",
    confirmDelete: "O'chirishni tasdiqlaysizmi?",
    confirmDeleteMsg: "Ushbu ma'lumot qayta tiklanmaydi.",
    expensesList: "Xarajatlar Ro'yxati",
    incomesList: "Daromadlar Ro'yxati",
    addExpense: "Xarajat Yozish",
    addIncome: "Daromad Yozish",
    addField: "Yangi Yer Qo'shish",
    addCrop: "Ekin Ekish (Crop Season)",
    addHarvest: "Hosil Yig'imini Kiritish",
    cropHistory: "Ekin Mavsumlari Tarixi",
    expectedHarvest: "Kutilgan Yig'im",
    expectedYield: "Kutilayotgan hosil",
    soilType: "Tuproq Turi",
    waterSource: "Suv Manbai",
    location: "Joylashuv",
    tagNumber: "Teg Raqami",
    breed: "Zoti",
    gender: "Jinsi",
    weight: "Vazni (kg)",
    birthDate: "Tug'ilgan sanasi",
    purchasePrice: "Xarid narxi",
    genderMALE: "Erkak",
    genderFEMALE: "Urg'ochi",
    genderUNKNOWN: "Noma'lum",
    lowStockWarning: "Ombordagi ayrim yemlar minimal miqdordan kam qoldi.",
  },

  ru: {
    // App & Nav
    appName: "Управление Фермой",
    dashboard: "Главная",
    livestock: "Скот / Животные",
    feed: "Корма и Запасы",
    fields: "Поля и Урожай",
    reports: "Отчеты",
    finance: "Финансы",
    settings: "Настройки",
    tasks: "Задачи",

    // Common UI
    save: "Сохранить",
    cancel: "Отмена",
    delete: "Удалить",
    edit: "Редактировать",
    add: "Добавить",
    back: "Назад",
    search: "Поиск...",
    all: "Все",
    actions: "Действия",
    status: "Статус",
    notes: "Заметки",
    date: "Дата",
    amount: "Сумма",
    quantity: "Количество",
    price: "Цена",
    unit: "Ед. изм.",
    total: "Итого",
    retry: "Повторить",
    confirm: "Подтвердить",
    success: "Успешно",
    error: "Ошибка",
    noData: "Данные не найдены",

    // Language Switcher
    language: "Язык системы (Language)",
    selectLanguage: "Выберите язык",
    langUz: "O'zbekcha 🇺🇿",
    langRu: "Русский 🇷🇺",

    // Animal Types
    typeSHEEP: "Овцы / Овца",
    typeCOW: "Корова / КРС",
    typeGOAT: "Коза",
    typeHORSE: "Лошадь",
    typeCHICKEN: "Птица / Куры",
    typeOTHER: "Другое",

    // Animal Status
    statusACTIVE: "Активен (В стаде)",
    statusSOLD: "Продан",
    statusDEAD: "Падеж",
    statusARCHIVED: "В архиве",

    // Health Status
    healthHEALTHY: "Здоров",
    healthSICK: "Болен",
    healthTREATMENT: "На лечении",
    healthPREGNANT: "Стельность/Стельность",
    healthUNKNOWN: "Неизвестно",

    // Feed Transaction Types
    transIN: "Приход (Закупка)",
    transOUT: "Расход (Кормление)",
    transWASTE: "Потери (Порча)",
    transADJUSTMENT: "Корректировка",

    // Crop Status
    cropPLANNED: "Запланировано",
    cropPLANTED: "Посеяно",
    cropGROWING: "Растет",
    cropHARVESTED: "Урожай собран",
    cropFAILED: "Неурожай",
    cropARCHIVED: "В архиве",

    // Harvest Quality
    qualityHIGH: "Высокое качество (A+)",
    qualityMEDIUM: "Среднее качество",
    qualityLOW: "Низкое качество",
    qualityMIXED: "Смешанное качество",

    // Area Units
    unitHECTARE: "Гектар (га)",
    unitSOTIX: "Сотка",
    unitSQM: "Кв. метр (м²)",

    // Expense Categories
    expFEED: "Расходы на корм",
    expMEDICINE: "Лекарства и ветпрепараты",
    expVET: "Услуги ветеринара",
    expWORKER: "Зарплата рабочих",
    expSEED: "Семена и саженцы",
    expFERTILIZER: "Удобрения",
    expWATER: "Полив и вода",
    expTRANSPORT: "Транспорт / Топливо",
    expEQUIPMENT: "Техника и оборудование",
    expOTHER: "Прочие расходы",

    // Income Categories
    incANIMAL_SALE: "Продажа скота",
    incMILK: "Продажа молока",
    incMEAT: "Продажа мяса",
    incWOOL: "Продажа шерсти",
    incEGG: "Продажа яиц",
    incHARVEST: "Продажа урожая",
    incOTHER: "Прочие доходы",

    // User Roles
    roleOWNER: "Владелец (Owner)",
    roleMANAGER: "Управляющий (Manager)",
    roleWORKER: "Рабочий (Worker)",
    roleVET: "Ветеринар (Vet)",
    roleVIEWER: "Наблюдатель (Viewer)",

    // Sync Status
    syncSYNCED: "Синхронизировано 🟢",
    syncSYNCING: "Синхронизация 🟡",
    syncFAILED: "Ошибка синхронизации 🔴",
    syncOFFLINE: "Офлайн режим 🔴",

    // Dashboard Titles
    welcome: "Добро пожаловать",
    quickActions: "Быстрые Действия",
    reminders: "Напоминания и Календарь",
    totalAnimals: "Поголовье Скота",
    sheepCowRatio: "Овцы / Коровы",
    sickPregnant: "Больные / Стельные",
    lowStockFeed: "Низкий Запас Корма",
    activeLand: "Активные Поля",
    netProfit: "Чистая Прибыль за Месяц",

    // Sub-screens & Forms
    addAnimal: "Добавить Животное",
    editAnimal: "Редактировать Животное",
    feedKirimChiqim: "Приход/Расход Корма",
    financeAction: "Расход / Доход",
    healthAction: "Запись о Здоровье",
    confirmDelete: "Подтвердите удаление?",
    confirmDeleteMsg: "Данное действие нельзя будет отменить.",
    expensesList: "Список Расходов",
    incomesList: "Список Доходов",
    addExpense: "Внести Расход",
    addIncome: "Внести Доход",
    addField: "Добавить Поле",
    addCrop: "Посев Культуры (Crop Season)",
    addHarvest: "Внести Урожай",
    cropHistory: "История Посевов",
    expectedHarvest: "Ожидаемый Сбор",
    expectedYield: "Планируемый Урожай",
    soilType: "Тип Почвы",
    waterSource: "Источник Воды",
    location: "Локация",
    tagNumber: "Номер бирки",
    breed: "Порода",
    gender: "Пол",
    weight: "Вес (кг)",
    birthDate: "Дата рождения",
    purchasePrice: "Цена покупки",
    genderMALE: "Самец",
    genderFEMALE: "Самка",
    genderUNKNOWN: "Неизвестно",
    lowStockWarning: "Запас некоторых кормов на исходе. Пополните склад.",
  },
};
