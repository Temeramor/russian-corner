// js/config.js: Отдельный файл для настроек интерфейса (CONFIG), данных уроков и переменных. Добавлена функция showSettings() и changeTheme() для демонстрации.

const CONFIG = {
    appName: "Russian corner",
    primaryColor: "#3b82f6",
    successColor: "#10b981",
    errorColor: "#ef4444",
    // Добавляй сюда свои стили, если нужно
};

// Данные уроков
let lessons = [
    {
        id: 1,
        title: "Урок 1: Приветствия",
        subtitle: "Основные слова и фразы",
        tasks: [
            {
                id: 1,
                type: "scramble",
                title: "Собери слово",
                question: "Как сказать «привет» на русском?",
                data: { word: "ПРИВЕТ" }
            },
            {
                id: 2,
                type: "multiple",
                title: "Выбери правильный перевод",
                question: "Что значит слово «спасибо»?",
                data: {
                    options: ["Hello", "Thank you", "Goodbye", "Please"],
                    correctIndex: 1,
                    image: "https://picsum.photos/id/1015/800/400"   // ← пример картинки
                }
            },
            {
                id: 3,
                type: "scramble",
                title: "Собери слово",
                question: "Как сказать «пока»?",
                data: { word: "ПОКА" }
            }
        ]
    },
    {
        id: 2,
        title: "Урок 2: Еда и напитки",
        subtitle: "Учимся заказывать в кафе",
        tasks: [
            {
                id: 1,
                type: "multiple",
                title: "Выбери правильный перевод",
                question: "Как будет «яблоко» на русском?",
                data: {
                    options: ["Banana", "Apple", "Orange", "Water"],
                    correctIndex: 1
                }
            },
            {
                id: 2,
                type: "scramble",
                title: "Собери слово",
                question: "Как называется этот напиток?",
                data: { word: "ЧАЙ" }
            }
        ]
    }
];

// Прогресс (сохраняется в localStorage)
let progress = {};

// Текущие данные
let currentLessonId = null;
let currentTaskId = null;
let currentTask = null;

// Функция для показа экрана настроек (новая)
function showSettings() {
    showScreen('settings-screen');
}

// Пример функции для смены темы (можно расширять)
function changeTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.remove('light-theme');
    } else if (theme === 'light') {
        document.body.classList.add('light-theme');
        // Добавьте в styles.css .light-theme { ... } для стилей светлой темы
    }
    showToast(`Тема изменена на ${theme === 'dark' ? 'тёмную' : 'светлую'}!`);
}
