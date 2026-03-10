// js/tasks.js: Логика заданий (открытие, инициализация scramble/multiple, проверка ответов, feedback, сохранение результатов). Шаблоны заданий остаются в HTML, но логика здесь. Для добавления новых типов заданий (например, "matching") можно расширять этот файл.

// Для scramble
let shuffledLetters = [];
let currentAnswer = [];
let usedIndices = [];

// Для multiple
let selectedMultipleIndex = null;

function openTask(lessonId, taskId) {
    currentLessonId = lessonId;
    currentTaskId = taskId;
    
    const lesson = lessons.find(l => l.id === lessonId);
    currentTask = lesson.tasks.find(t => t.id === taskId);
    
    // Заголовок
    document.getElementById('task-number').innerHTML = `
        Задание ${lesson.tasks.findIndex(t => t.id === taskId) + 1} / ${lesson.tasks.length}
    `;
    document.getElementById('task-type-badge').innerHTML = `
        ${currentTask.type === 'scramble' ? 
            '<i class="fas fa-random"></i> БУКВЫ' : 
            '<i class="fas fa-list"></i> ВЫБОР'}
    `;
    document.getElementById('task-title').textContent = currentTask.title;
    document.getElementById('task-question').textContent = currentTask.question;
    
    // Картинка (новая возможность!)
    const imgContainer = document.getElementById('task-image-container');
    const imgEl = document.getElementById('task-image');
    if (currentTask.data.image) {
        imgEl.src = currentTask.data.image;
        imgContainer.classList.remove('hidden');
    } else {
        imgContainer.classList.add('hidden');
    }
    
    // Скрываем шаблоны
    document.getElementById('scramble-template').classList.add('hidden');
    document.getElementById('multiple-template').classList.add('hidden');
    document.getElementById('feedback').classList.add('hidden');
    
    selectedMultipleIndex = null;
    
    if (currentTask.type === 'scramble') {
        initScrambleTask();
        document.getElementById('scramble-template').classList.remove('hidden');
    } else if (currentTask.type === 'multiple') {
        initMultipleTask();
        document.getElementById('multiple-template').classList.remove('hidden');
    }
    
    showScreen('task-screen');
}

function initScrambleTask() {
    const word = currentTask.data.word;
    shuffledLetters = shuffle(word.split(''));
    currentAnswer = [];
    usedIndices = [];
    
    const container = document.getElementById('shuffled-letters');
    container.innerHTML = '';
    
    shuffledLetters.forEach((letter, i) => {
        const btn = document.createElement('button');
        btn.className = `letter-btn w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold text-3xl rounded-2xl flex items-center justify-center shadow-inner`;
        btn.textContent = letter;
        btn.onclick = () => selectLetter(i, btn);
        container.appendChild(btn);
    });
    
    renderAnswerArea();
}

function selectLetter(index, btn) {
    if (usedIndices.includes(index)) return;
    usedIndices.push(index);
    currentAnswer.push(shuffledLetters[index]);
    btn.style.opacity = '0.3';
    btn.style.pointerEvents = 'none';
    renderAnswerArea();
}

function renderAnswerArea() {
    const area = document.getElementById('answer-area');
    area.innerHTML = '';
    
    if (currentAnswer.length === 0) {
        area.innerHTML = `<div class="text-slate-500 text-sm italic">Нажимай на буквы сверху...</div>`;
        return;
    }
    
    currentAnswer.forEach((letter) => {
        const slot = document.createElement('div');
        slot.className = `answer-slot bg-slate-800 text-white rounded-2xl font-bold text-4xl border-2 border-blue-500/40`;
        slot.textContent = letter;
        area.appendChild(slot);
    });
}

function removeLastLetter() {
    if (currentAnswer.length === 0) return;
    currentAnswer.pop();
    const lastIndex = usedIndices.pop();
    
    const buttons = document.querySelectorAll('#shuffled-letters button');
    if (buttons[lastIndex]) {
        buttons[lastIndex].style.opacity = '1';
        buttons[lastIndex].style.pointerEvents = 'auto';
    }
    
    renderAnswerArea();
}

function checkScrambleAnswer() {
    const userWord = currentAnswer.join('');
    const correctWord = currentTask.data.word;
    const isCorrect = userWord === correctWord;
    
    saveTaskResult(isCorrect, userWord);
    showFeedback(isCorrect, correctWord, userWord);
}

function initMultipleTask() {
    const container = document.getElementById('multiple-options');
    container.innerHTML = '';
    
    const options = currentTask.data.options;
    const key = getTaskKey(currentLessonId, currentTaskId);
    const result = progress[key]; // уже сохранённый результат
    
    options.forEach((option, i) => {
        const btn = document.createElement('button');
        btn.className = `option-btn w-full text-left p-6 rounded-3xl bg-slate-900 border-2 transition-all text-xl font-medium flex items-center`;
        
        btn.innerHTML = `
            <span class="inline-block w-9 h-9 bg-blue-500 text-white text-center leading-9 rounded-2xl mr-4 font-bold">${String.fromCharCode(65 + i)}</span>
            ${option}
        `;
        
        if (result) {
            // Уже отвечено — показываем результат
            btn.disabled = true;
            if (i === currentTask.data.correctIndex) {
                btn.classList.add('!border-emerald-400', '!bg-emerald-900/30');
            }
            if (i === result.userAnswerIndex) {
                btn.classList.add(result.isCorrect ? '!border-emerald-400' : '!border-red-400');
            }
        } else {
            // Можно выбирать
            btn.onclick = () => selectMultipleOption(i, btn);
        }
        
        container.appendChild(btn);
    });
}

function selectMultipleOption(index, clickedBtn) {
    selectedMultipleIndex = index;
    
    const allBtns = document.querySelectorAll('#multiple-options button');
    allBtns.forEach(b => b.classList.remove('!border-blue-400', 'ring-2', 'ring-blue-400'));
    
    clickedBtn.classList.add('!border-blue-400', 'ring-2', 'ring-blue-400');
}

function checkMultipleAnswer() {
    if (selectedMultipleIndex === null) {
        showToast("Выбери вариант ответа!", true);
        return;
    }
    
    const isCorrect = selectedMultipleIndex === currentTask.data.correctIndex;
    const userAnswerText = currentTask.data.options[selectedMultipleIndex];
    
    saveTaskResult(isCorrect, userAnswerText, selectedMultipleIndex);
    showFeedback(isCorrect, currentTask.data.options[currentTask.data.correctIndex], userAnswerText);
}

function showFeedback(isCorrect, correctAnswer, userAnswer) {
    document.getElementById('feedback').classList.remove('hidden');
    document.getElementById('scramble-template').classList.add('hidden');
    document.getElementById('multiple-template').classList.add('hidden');
    
    const fb = document.getElementById('feedback');
    
    if (isCorrect) {
        fb.innerHTML = `
            <div class="text-7xl mb-4">🎉</div>
            <div class="text-emerald-400 text-3xl font-bold mb-2">Отлично!</div>
            <div class="text-slate-300 text-xl">Ты ответил правильно</div>
            <div class="mt-8 text-sm text-slate-400">Правильный ответ: <span class="font-bold text-white">${correctAnswer}</span></div>
            <button onclick="finishTask()" 
                    class="mt-10 px-16 py-6 bg-emerald-500 hover:bg-emerald-600 rounded-3xl text-xl font-bold text-white">
                Продолжить
            </button>
        `;
    } else {
        fb.innerHTML = `
            <div class="text-7xl mb-4">😕</div>
            <div class="text-red-400 text-3xl font-bold mb-2">Не совсем...</div>
            <div class="text-slate-300">Твой ответ: <span class="line-through text-red-300">${userAnswer}</span></div>
            <div class="mt-6 text-emerald-400 font-medium text-xl">Правильно: ${correctAnswer}</div>
            <button onclick="finishTask()" 
                    class="mt-10 px-16 py-6 bg-slate-700 hover:bg-slate-600 rounded-3xl text-lg font-medium">
                Понял, продолжим
            </button>
        `;
    }
}

function finishTask() {
    renderTasks(currentLessonId);
    showScreen('lesson-screen');
}

function saveTaskResult(isCorrect, userAnswer, userAnswerIndex = null) {
    const key = getTaskKey(currentLessonId, currentTaskId);
    
    progress[key] = {
        taskTitle: currentTask.title,
        lessonTitle: lessons.find(l => l.id === currentLessonId).title,
        userAnswer: userAnswer,
        userAnswerIndex: userAnswerIndex,
        correctAnswer: currentTask.type === 'scramble' ? currentTask.data.word : currentTask.data.options[currentTask.data.correctIndex],
        isCorrect: isCorrect,
        timestamp: Date.now()
    };
    
    saveProgress();
    renderLessons(); // обновляем проценты на главной
}