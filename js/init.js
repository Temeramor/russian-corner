// js/init.js: Инициализация приложения.

function initApp() {
    loadProgress();
    renderLessons();
    showScreen('home-screen');
}

window.onload = initApp;