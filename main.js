let list = document.querySelector(".list");
let add = document.querySelector(".input button");
let inputText = document.querySelector(".input input");
let message = document.querySelector(".input .message");
let footer = document.querySelector(".list .footer");
let clear = document.querySelector(".footer .clear");
let active = document.querySelector(".footer .active");
let all = document.querySelector(".footer .all");
let done = document.querySelector(".footer .completed");
let spans = document.querySelectorAll(".footer .choice span");
let total = document.querySelector(".total");
const mode = document.getElementById("toggle");
let body = document.querySelector("body")
let current = 1;
document.addEventListener("DOMContentLoaded", () => {
    loadTasksFromLocalStorage();
    totalLeft();
    loadColorsFromLocalStorage();
});
inputText.addEventListener("keydown",  (event)=> {
    if (event.key === "Enter" || event.keyCode === 13) {
        addNew();
    }
});
function loadColorsFromLocalStorage(){
    const savedColors = JSON.parse(localStorage.getItem('colors'));
    if (savedColors) {
        mode.classList.remove("fa-moon");
        mode.classList.remove("fa-sun");
        mode.classList.add(savedColors.icon);
        if(mode.classList.contains("fa-moon")){
            inputText.classList.add("light-theme");
            list.classList.add("light-theme");
            body.classList.add("light-theme");
            message.classList.add("light-theme");
        } else{
            inputText.classList.remove("light-theme");
            list.classList.remove("light-theme");
            body.classList.remove("light-theme");
            message.classList.remove("light-theme");
        }
        document.querySelector(".img img").src = savedColors.imgSrc;
    }
}
function loadTasksFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        current = savedTasks.length + 1;
        savedTasks.forEach((taskData) => {
            createTaskElement(taskData.text, taskData.checked);
        });
    }
    let lb = document.querySelectorAll(".task input");
    completed(lb);
    removeTask();
}
function saveColorsToLocalStorage(){
    if(mode.classList.contains("fa-sun")){
        const colors = {
            icon : "fa-sun",
            imgSrc : "images/bg-desktop-dark.jpg"
        };
        localStorage.setItem("colors", JSON.stringify(colors));
    }
    else{
        const colors = {
            icon : "fa-moon",
            imgSrc: "images/bg-desktop-light.jpg"
        };
        localStorage.setItem("colors", JSON.stringify(colors));
    }
}
function saveTasksToLocalStorage() {
    let tasks = Array.from(document.querySelectorAll(".task"));
    let taskData = tasks.map(task => ({
        text: task.querySelector("label").textContent,
        checked: task.querySelector("input").checked,
    }));
    localStorage.setItem('tasks', JSON.stringify(taskData));
};
mode.addEventListener("click", ()=>{
    mode.classList.toggle("fa-moon");
    mode.classList.toggle("fa-sun");
    saveColorsToLocalStorage();
    loadColorsFromLocalStorage();
});
function completed(lb){
    let tasks = Array.from(document.querySelectorAll(".task"));
    for (let index = 0; index < lb.length; index++) {
        lb[index].addEventListener("click", ()=>{
            lb.checked = true;
            if(tasks[index].querySelector(".task input").checked){
                tasks[index].querySelector(".task label").classList.add("deleted-text");
            }
            else{
                tasks[index].querySelector(".task label").classList.remove("deleted-text");
            }
            saveTasksToLocalStorage();
            totalLeft();
        })
        saveTasksToLocalStorage();
    }
    totalLeft();
}
function createTaskElement(text, checked) {
    let task = document.createElement("div");
    task.className = "task";
    let input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute('id', `task${current}`);
    input.checked = checked;
    task.appendChild(input);
    let label = document.createElement("label");
    if(checked) label.classList.add("deleted-text");
    label.setAttribute('for', `task${current}`);
    label.textContent = text;
    const i = document.createElement("i");
    i.className = "fa-thin fa-xmark wrong";
    label.appendChild(i);
    task.appendChild(label);
    list.insertBefore(task, footer);
    current++;
    removeTask();
}
add.addEventListener("click", addNew);
function addNew(){
    if (inputText.value === '' || inputText.value === null) {
        message.style.display = 'flex';
    } else {
        message.style.display = 'none';
        createTaskElement(inputText.value, false);
        saveTasksToLocalStorage();
        inputText.value = '';
    }
    let lb = document.querySelectorAll(".task input");
    completed(lb);
    totalLeft();
}
clear.addEventListener("click" , ()=>{
    let tasks = Array.from(document.querySelectorAll(".task"));
    for (let index = 0; index < tasks.length; index++) {
        if(tasks[index].querySelector(".task input").checked){
            tasks[index].remove();
            saveTasksToLocalStorage();
        }
    }
    totalLeft();
});
active.addEventListener("click", ()=>{
    spans.forEach(span => {
        span.classList.remove("on")
    });
    active.classList.add("on");
    let tasks = Array.from(document.querySelectorAll(".task"));
    for (let index = 0; index < tasks.length; index++) {
        tasks[index].style.display = "flex";
        if(tasks[index].querySelector(".task input").checked){
            tasks[index].style.display = "none";
        }
    }
});
all.addEventListener("click", ()=>{
    spans.forEach(span => {
        span.classList.remove("on")
    });
    all.classList.add("on");
    let tasks = Array.from(document.querySelectorAll(".task"));
    for (let index = 0; index < tasks.length; index++) {
        tasks[index].style.display = "flex";
    }
});
done.addEventListener("click", ()=>{
    spans.forEach(span => {
        span.classList.remove("on")
    });
    done.classList.add("on");
    let tasks = Array.from(document.querySelectorAll(".task"));
    for (let index = 0; index < tasks.length; index++) {
        tasks[index].style.display = "flex";
        if(!tasks[index].querySelector(".task input").checked){
            tasks[index].style.display = "none";
        }   
    }
});
function removeTask(){
    let deleteIcons = Array.from(document.querySelectorAll(".wrong"));
    deleteIcons.forEach( (icon, index) => {
        let tasks = Array.from(document.querySelectorAll(".task"));
        icon.addEventListener("click", ()=>{
            tasks[index].remove();
            saveTasksToLocalStorage();
            totalLeft();
        })
    });
}
function totalLeft(){
    let tasks = Array.from(document.querySelectorAll(".task"));
    let left = tasks.length;
    for (let index = 0; index < tasks.length; index++) {
        if(tasks[index].querySelector(".task input").checked){
            left--;
        }
        total.innerHTML = `${left} items left`;
    }
}