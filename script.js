document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        // Ordena as tarefas por data e hora
        tasks.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

        taskList.innerHTML = '';
        const now = new Date();
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            if (task.completed) {
                li.classList.add('completed');
            }
            const taskDate = new Date(task.dateTime);
            const isOverdue = !task.completed && taskDate <= now;

            let buttonClass = task.completed ? 'done' : (isOverdue ? 'overdue' : 'todo');
            let buttonText = task.completed ? 'Feita' : (isOverdue ? 'Atrasada' : 'Concluir');

            li.innerHTML = `
                <div class="task-text">
                    <span>${task.text}</span>
                    <div class="task-date">${taskDate.toLocaleString()}</div>
                </div>
                <div class="task-buttons">
                    <button onclick="toggleTask(${index})" class="${buttonClass}">${buttonText}</button>
                    <button onclick="deleteTask(${index})" class="delete">Eliminar</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    function addTask(text, dateTime) {
        tasks.push({ text, dateTime, completed: false });
        saveTasks();
        renderTasks();
    }

    window.toggleTask = function(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    window.deleteTask = function(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskInput = document.getElementById('taskInput');
        const taskDateTime = document.getElementById('taskDateTime');
        addTask(taskInput.value, taskDateTime.value);
        taskInput.value = '';
        taskDateTime.value = '';
    });

    function checkTasks() {
        const now = new Date();
        let tasksChanged = false;
        tasks.forEach((task, index) => {
            if (!task.completed && new Date(task.dateTime) <= now) {
                tasksChanged = true;
            }
        });
        if (tasksChanged) {
            renderTasks();
        }
    }

    setInterval(checkTasks, 60000); // Verifica a cada minuto

    renderTasks();
});