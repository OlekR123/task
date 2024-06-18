document.addEventListener('DOMContentLoaded', () => {
    let tasksToDo = 0;
    let tasksDone = 0;

    const taskInput = document.querySelector('.new_task_input');
    const addButton = document.querySelector('.new_task_button');
    const toDoContainer = document.querySelector('.tasks_todo_container');
    const doneContainer = document.querySelector('.tasks_done_container');
    const taskCounter = document.getElementById('task_counter');
    const doneCounter = document.getElementById('done_counter');

    const updateCounters = () => {
        taskCounter.textContent = `Tasks to do - ${tasksToDo}`;
        doneCounter.textContent = `Done - ${tasksDone}`;
    };

    const saveTasks = () => {
        const tasks = {
            toDo: [],
            done: []
        };

        toDoContainer.querySelectorAll('.item').forEach(task => {
            tasks.toDo.push(task.querySelector('.task_description').textContent);
        });

        doneContainer.querySelectorAll('.item').forEach(task => {
            tasks.done.push(task.querySelector('.done_task_description').textContent.replace(/<\/?s>/g, ''));
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.toDo.forEach(taskText => {
                tasksToDo++;
                const taskElement = createTaskElement(taskText);
                toDoContainer.appendChild(taskElement);
            });
            tasks.done.forEach(taskText => {
                tasksDone++;
                const doneTaskElement = createDoneTaskElement(taskText);
                doneContainer.appendChild(doneTaskElement);
            });
            updateCounters();
        }
    };

    const createTaskElement = (text) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'item';

        const taskText = document.createElement('p');
        taskText.className = 'task_description';
        taskText.textContent = text;

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'task_buttons';

        const completeButton = document.createElement('button');
        completeButton.className = 'task_button';
        const completeButtonImg = document.createElement('img');
        completeButtonImg.src = 'pictures/check.png';
        completeButtonImg.alt = 'Complete';
        completeButton.appendChild(completeButtonImg);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'task_button';
        const deleteButtonImg = document.createElement('img');
        deleteButtonImg.src = 'pictures/trashsimple.png';
        deleteButtonImg.alt = 'Delete';
        deleteButton.appendChild(deleteButtonImg);

        buttonGroup.appendChild(completeButton);
        buttonGroup.appendChild(deleteButton);
        taskElement.appendChild(taskText);
        taskElement.appendChild(buttonGroup);

        completeButton.addEventListener('click', () => {
            tasksToDo--;
            tasksDone++;
            taskElement.remove();
            const doneTaskElement = createDoneTaskElement(text);
            doneContainer.appendChild(doneTaskElement);
            updateCounters();
            saveTasks();
        });
        deleteButton.addEventListener('click', () => {
            tasksToDo--;
            taskElement.remove();
            updateCounters();
            saveTasks();
        });
        return taskElement;
    };

    const createDoneTaskElement = (text) => {
        const doneTaskElement = document.createElement('div');
        doneTaskElement.className = 'item';

        const doneTaskText = document.createElement('p');
        doneTaskText.className = 'done_task_description';
        doneTaskText.innerHTML = `<s>${text}</s>`;

        doneTaskElement.appendChild(doneTaskText);
        return doneTaskElement;
    };

    addButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasksToDo++;
            const taskElement = createTaskElement(taskText);
            toDoContainer.appendChild(taskElement);
            taskInput.value = '';
            updateCounters();
            saveTasks();
        }
    });
    loadTasks();
    updateCounters();
});
