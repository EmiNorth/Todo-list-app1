
const STORAGE_KEY = "myTodoListTasks";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

let currentFilter = "all";

const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const counts = document.getElementById("counts");

// Display today's date
document.getElementById("today").textContent =
    new Date().toDateString();

// Save tasks
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Display tasks
function renderTasks() {

    list.innerHTML = "";

    const completed = tasks.filter(task => task.done).length;
    const active = tasks.length - completed;

    counts.textContent = `${active} left · ${completed} completed`;

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.done;
        if (currentFilter === "completed") return task.done;
        return true;
    });

    if (filteredTasks.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent = "No tasks available. Add a task!";
        list.appendChild(empty);
        return;
    }

    filteredTasks.forEach(task => {

        const item = document.createElement("li");
        item.className = "task";

        if (task.done) {
            item.classList.add("done");
        }

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "check";
        checkbox.checked = task.done;

        checkbox.addEventListener("change", () => {
            task.done = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        // Task information
        const main = document.createElement("div");
        main.className = "task-main";

        const title = document.createElement("div");
        title.className = "task-title";
        title.textContent = task.title;

        const meta = document.createElement("div");
        meta.className = "meta";

        const priority = document.createElement("span");
        priority.className = "priority";
        priority.textContent = task.priority + " priority";

        const date = document.createElement("span");
        date.textContent = new Date(task.created).toLocaleDateString();

        meta.append(priority, date);
        main.append(title, meta);

        // Edit and delete buttons
        const actions = document.createElement("div");
        actions.className = "actions";

        const edit = document.createElement("button");
        edit.textContent = "✎";

        edit.addEventListener("click", () => {
            const updated = prompt("Edit task:", task.title);

            if (updated && updated.trim()) {
                task.title = updated.trim();
                saveTasks();
                renderTasks();
            }
        });

        const remove = document.createElement("button");
        remove.textContent = "×";

        remove.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        actions.append(edit, remove);

        item.append(checkbox, main, actions);
        list.appendChild(item);
    });
}

// Add new task
form.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = input.value.trim();

    if (!title) return;

    const newTask = {
        id: Date.now() + Math.random(),
        title: title,
        done: false,
        priority: "Medium",
        created: new Date().toISOString()
    };

    tasks.unshift(newTask);

    input.value = "";

    saveTasks();
    renderTasks();
});

// Filter tasks
document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        document.querySelectorAll(".filter").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});

// Clear completed tasks
document.getElementById("clearCompleted")
    .addEventListener("click", () => {

        tasks = tasks.filter(task => !task.done);

        saveTasks();
        renderTasks();
    });

// Initial display
renderTasks();


