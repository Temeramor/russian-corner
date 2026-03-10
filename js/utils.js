// js/utils.js: Утилитарные функции (shuffle, showToast, save/load progress, getTaskKey).

function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function showToast(text, isError = false) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    toastText.textContent = text;
    if (isError) {
        toast.classList.add('!border-red-400', '!text-red-400');
    } else {
        toast.classList.remove('!border-red-400', '!text-red-400');
    }
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2800);
}

function saveProgress() {
    localStorage.setItem('russianHomeworkProgress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('russianHomeworkProgress');
    if (saved) progress = JSON.parse(saved);
}

function getTaskKey(lessonId, taskId) {
    return `(\( {lessonId}- \){taskId})`;
}
