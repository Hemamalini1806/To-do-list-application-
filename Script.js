const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if(filter === "active")
            return !task.completed;

        if(filter === "completed")
            return task.completed;

        return true;
    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.dataset.id = task.id;

        if(task.completed){
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${task.text}</span>

            <div class="actions">
                <button class="complete-btn">
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button class="edit-btn">Edit</button>

                <button class="delete-btn">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function addTask() {

    const text = taskInput.value.trim();

    if(text === "") return;

    tasks.push({
        id: Date.now(),
        text,
        completed:false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e)=>{
    if(e.key === "Enter"){
        addTask();
    }
});

taskList.addEventListener("click", (e)=>{

    const li = e.target.closest("li");

    if(!li) return;

    const id = Number(li.dataset.id);

    const task = tasks.find(t => t.id === id);

    if(e.target.classList.contains("complete-btn")){

        task.completed = !task.completed;

        saveTasks();
        renderTasks(currentFilter);
    }

    if(e.target.classList.contains("delete-btn")){

        tasks = tasks.filter(t => t.id !== id);

        saveTasks();
        renderTasks(currentFilter);
    }

    if(e.target.classList.contains("edit-btn")){

        const updatedText = prompt("Edit Task", task.text);

        if(updatedText){

            task.text = updatedText.trim();

            saveTasks();
            renderTasks(currentFilter);
        }
    }
});

let currentFilter = "all";

filterButtons.forEach(btn => {

    btn.addEventListener("click", ()=>{

        currentFilter = btn.dataset.filter;

        renderTasks(currentFilter);
    });
});

renderTasks();
