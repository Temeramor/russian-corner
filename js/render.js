// js/render.js: Функции рендеринга (уроки, задания).

function renderLessons() {
    const container = document.getElementById('lessons-list');
    container.innerHTML = '';

    lessons.forEach(lesson => {
        const completed = getLessonProgress(lesson.id);
        const percent = Math.round((completed.completed / completed.total) * 100) || 0;

        const card = document.createElement('div');
        card.className = `bg-slate-900 rounded-3xl p-6 task-card cursor-pointer border border-transparent hover:border-blue-500/40`;
        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <div class="title-font text-2xl font-bold">${lesson.title}</div>
                    <div class="text-slate-400 mt-1">${lesson.subtitle}</div>
                </div>
                <div class="text-right">
                    <div class="text-emerald-400 text-3xl font-bold">${percent}<span class="text-base">%</span></div>
                </div>
            </div>
            
            <div class="h-2.5 bg-slate-800 rounded-3xl mt-7 overflow-hidden">
                <div class="progress-bar h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-3xl" 
                     style="width: ${percent}%"></div>
            </div>
            
            <div class="mt-4 flex items-center justify-between text-sm">
                <div class="flex items-center gap-4 text-slate-400">
                    <div><i class="fas fa-tasks"></i> ${lesson.tasks.length} заданий</div>
                    <div class="text-emerald-400">${completed.completed} выполнено</div>
                </div>
                <div class="text-blue-400 text-xs font-medium flex items-center gap-1">
                    НАЧАТЬ 
                    <i class="fas fa-arrow-right"></i>
                </div>
            </div>
        `;
        card.onclick = () => openLesson(lesson.id);
        container.appendChild(card);
    });
}

function getLessonProgress(lessonId) {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return { total: 0, completed: 0 };
    
    let completed = 0;
    lesson.tasks.forEach(task => {
        const key = getTaskKey(lessonId, task.id);
        if (progress[key] && progress[key].isCorrect !== undefined) completed++;
    });
    return { total: lesson.tasks.length, completed };
}

function openLesson(lessonId) {
    currentLessonId = lessonId;
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    document.getElementById('lesson-title').textContent = lesson.title;
    document.getElementById('lesson-subtitle').textContent = lesson.subtitle;
    
    renderTasks(lessonId);
    showScreen('lesson-screen');
}

function renderTasks(lessonId) {
    const container = document.getElementById('tasks-list');
    container.innerHTML = '';
    
    const lesson = lessons.find(l => l.id === lessonId);
    
    lesson.tasks.forEach((task, index) => {
        const key = getTaskKey(lessonId, task.id);
        const done = progress[key];
        const isCorrect = done ? done.isCorrect : false;
        
        const div = document.createElement('div');
        div.className = `task-card bg-slate-900 rounded-3xl p-6 flex items-center gap-6 cursor-pointer border ${done ? (isCorrect ? 'border-emerald-400' : 'border-red-400') : 'border-transparent hover:border-blue-400'}`;
        
        div.innerHTML = `
            <div class="w-12 h-12 flex-shrink-0 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl">
                ${task.type === 'scramble' ? '🔤' : '❔'}
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3">
                    <span class="font-mono text-xs bg-slate-800 px-3 py-1 rounded-2xl text-slate-400">${String(index+1).padStart(2,'0')}</span>
                    <span class="font-medium text-lg">${task.title}</span>
                </div>
                <div class="text-slate-400 text-sm line-clamp-2 mt-1">${task.question}</div>
            </div>
            ${done ? `
            <div class="${isCorrect ? 'text-emerald-400' : 'text-red-400'}">
                ${isCorrect ? '<i class="fas fa-check-circle text-3xl"></i>' : '<i class="fas fa-times-circle text-3xl"></i>'}
            </div>` : ''}
        `;
        div.onclick = () => openTask(lessonId, task.id);
        container.appendChild(div);
    });
}