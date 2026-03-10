// js/results.js: Отдельный файл для логики результатов (showAllResults).

function showAllResults() {
    showScreen('results-screen');
    
    let totalTasks = 0;
    let correctTasks = 0;
    const resultsHTML = [];
    
    lessons.forEach(lesson => {
        lesson.tasks.forEach(task => {
            totalTasks++;
            const key = getTaskKey(lesson.id, task.id);
            const res = progress[key];
            
            if (res) {
                if (res.isCorrect) correctTasks++;
                
                resultsHTML.push(`
                    <div class="bg-slate-900 rounded-3xl p-5 flex gap-5 items-center">
                        <div class="flex-1">
                            <div class="text-xs text-slate-400">${lesson.title}</div>
                            <div class="font-medium">${task.title}</div>
                        </div>
                        <div class="text-right">
                            ${res.isCorrect ? 
                                `<div class="text-emerald-400 text-xl"><i class="fas fa-check"></i></div>` : 
                                `<div>
                                    <div class="text-red-400 text-xs">Ты выбрал:</div>
                                    <div class="text-red-300">${res.userAnswer}</div>
                                </div>`}
                        </div>
                        <div class="w-px h-12 bg-slate-700"></div>
                        <div>
                            <div class="text-xs text-slate-400 text-right">Правильно</div>
                            <div class="font-bold text-white">${res.correctAnswer}</div>
                        </div>
                    </div>
                `);
            }
        });
    });
    
    const percent = totalTasks ? Math.round((correctTasks / totalTasks) * 100) : 0;
    
    document.getElementById('overall-stats').innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <div class="text-6xl font-bold text-white">${percent}<span class="text-3xl text-slate-400">%</span></div>
                <div class="text-slate-400">правильных ответов</div>
            </div>
            <div class="text-right">
                <div class="text-emerald-400 text-5xl font-bold">${correctTasks}</div>
                <div class="text-xs tracking-widest uppercase">из ${totalTasks} заданий</div>
            </div>
        </div>
    `;
    
    document.getElementById('all-results-list').innerHTML = resultsHTML.length ? resultsHTML.join('') : `
        <div class="text-center py-20 text-slate-400">
            <i class="fas fa-inbox text-6xl mb-4 block"></i>
            Пока нет выполненных заданий
        </div>
    `;
}