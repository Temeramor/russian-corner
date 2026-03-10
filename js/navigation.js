// js/navigation.js: Функции навигации (showScreen, goHome, backToLesson).

function showScreen(screenId) {
    document.querySelectorAll('#screens > div').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

function goHome() {
    renderLessons();
    showScreen('home-screen');
}

function backToLesson() {
    if (!currentLessonId) return;
    renderTasks(currentLessonId);
    showScreen('lesson-screen');
}