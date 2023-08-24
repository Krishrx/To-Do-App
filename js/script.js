displayTables();

function displayTables(){
    let toDoArray = getToDoTasksFromDb();
    if(toDoArray){
        sortTasks(toDoArray)
        updateTasksTable(toDoArray);
    }
}

const sectionTwo = document.getElementById('section-two');

sectionTwo.addEventListener('change', function(event) {
    if (event.target.classList.contains("checkbox")) {
        const taskId = parseInt(event.target.closest("tr").querySelector(".hidden").textContent);
        toggleTaskCompletion(taskId);

        displayTables();
      }
});


const toggleButton = document.getElementById('completeToggleButton');
const completedDiv = document.getElementById('completedDiv');
const comArrow = document.getElementById('comArrow');

toggleButton.addEventListener('click', () => {
  completedDiv.classList.toggle('hidden');
  completedDiv.classList.toggle('completed-transition');
  comArrow.classList.toggle('fa-caret-down');
});


const tooltipBtn = document.querySelector('.tooltip-btn');
const tooltip = document.querySelector('.tooltip');

tooltipBtn.addEventListener('mouseenter', () => {
  tooltip.classList.remove('hidden');
});

tooltipBtn.addEventListener('mouseleave', () => {
  tooltip.classList.add('hidden');
});


const info = document.getElementById('info-help');
const infoText = document.getElementById('info-text');

info.addEventListener('click',()=>{
  infoText.classList.toggle('hidden');
})


function toggleTaskCompletion(taskId) {
    const tasks = JSON.parse(localStorage.getItem("toDoTasks")) || [];
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        localStorage.setItem("toDoTasks", JSON.stringify(tasks));
    }
  }


function addTask(){
    if(!validate()) return;

    let fieldValues = getFields();
    addTasksToDb(fieldValues);

    displayTables();

    clearFields();

    showToast(`<div id="toast-success" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">

    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
    </svg>
    <span class="sr-only">Check icon</span>
</div>
<div class="ml-3 text-sm font-normal lg:text-md">You've successfully added the task!</div>

</div>`)

}

function validate(){
    const taskField = document.getElementById('task').value;
    if(taskField.trim()===''){
showToast(`<div id="toast-warning" class="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
    </svg>
    <span class="sr-only">Warning icon</span>
</div>
<div class="ml-3 text-sm font-normal lg:text-lg">Oops!! task can't be empty!</div>
</div>`)
    return false;
    } 
    else return true;
}

function getFields(){
    let id = generateId();
    let taskField = document.getElementById('task').value;
    taskField = taskField.trim();
    let due = document.getElementById('due').value;
    due = (due==='')?currDateAsStr():due;

    let priority = document.querySelector('input[name="priority"]:checked');
    let priorityValue;
    if (priority) priorityValue = priority.value;
    else priorityValue = 'high';

    

    let obj = {
        "id":id,
        "taskField":taskField,
        "due":due,
        "priorityValue":priorityValue,
        "completed":false
    }
    return obj;
}

function clearFields(){
    const sectionOne = document.querySelector('.section-one');
    const radioButtons = sectionOne.querySelectorAll('input[type="radio"]');
    document.getElementById('task').value = '';
    document.getElementById('due').value = '';
    radioButtons.forEach(radio => {
        radio.checked = false;
    });
}

function getPriorityColor(priorityValue){
    if(priorityValue==='high') return 'red';
    if(priorityValue==='moderate') return 'yellow';
    else return 'green';
}

function currDateAsStr(){
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;

}

function sortTasks(tasks) {
    tasks.sort((a, b) => {
      const priorityOrder = { high: 3, moderate: 2, low: 1 };
      const priorityComparison = priorityOrder[b.priorityValue] - priorityOrder[a.priorityValue];
      
      if (priorityComparison !== 0) {
        return priorityComparison;
      }

      return new Date(a.due) - new Date(b.due);
    });
}

function generateId(){
    return new Date().getTime();
}
  

function addTasksToDb(obj){
    if(localStorage.getItem("toDoTasks")===null){
        let toDoList = [];
        toDoList.push(obj);
        localStorage.setItem("toDoTasks",JSON.stringify(toDoList))
    }
    else{
        let Sample = localStorage.getItem("toDoTasks");
        let toDoList = JSON.parse(Sample);
        toDoList.push(obj);
        localStorage.setItem("toDoTasks",JSON.stringify(toDoList))
    }
}

function getToDoTasksFromDb(){
    let toDoList;
    if(localStorage.getItem("toDoTasks")!==null){
        let Sample = localStorage.getItem("toDoTasks");
        toDoList = JSON.parse(Sample);
    }
    return toDoList===undefined?[]:toDoList;
}

function updateTasksTable(tasks){
    let taskTable = document.querySelector('#tasksTable tbody');
    let completedTable = document.querySelector('#completedTasksTable tbody');

    let completedTasksCount = 0;

    taskTable.innerHTML = "";
    completedTable.innerHTML = "";

    tasks.forEach(task => {
        const row = document.createElement("tr");
        row.className = "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";
        row.innerHTML = `<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-normal dark:text-white" style="width: 40%;">
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-2 checkbox w-4 h-4" ${task.completed ? "checked" : ""}>
                                <span ${task.completed ? 'class="checked" style="text-decoration: line-through;"' : ''}>${task.taskField}</span>
                            </label>
                            </th>
                            <td class="px-6 py-4 hidden">
                                ${task.id}
                            </td>
                            <td class="px-6 py-4" style="width: 20%;">
                            <div class="w-4 h-4 bg-${getPriorityColor(task.priorityValue)}-500"></div>
                            </td>
                            <td class="px-6 py-4" style="width: 20%;">
                                ${task.due}
                            </td>

                            <td class="px-6 py-4" style="width: 20%;">
                            <i class="fa-solid fa-pen edit cursor-pointer" onclick="editTask()"></i>
                            <i class="fa-regular fa-trash-can delete cursor-pointer ml-2" onclick="deleteTask()"></i>
                            </td>`
        if(task.completed){
            completedTable.appendChild(row);
            completedTasksCount++;
        } 
        else taskTable.appendChild(row);
    });
    const completeDiv = document.getElementById('completeToggleButton');
    if(completedTasksCount>0){
        completeDiv.classList.remove('hidden');
        document.getElementById('finishCount').textContent = completedTasksCount;
    }
    else completeDiv.classList.add('hidden');
}

let editId = 0;

function editTask() {
    const editCancelBtn = document.getElementById('editAndCancel');
    if(editCancelBtn.classList.contains('hidden')){
        toggleAddEditButtons();
        const tableRow = event.target.closest("tr");
        const taskId = parseInt(tableRow.querySelector(".hidden").textContent);
        editId = taskId;

        const tasks = getToDoTasksFromDb();

        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            populateFields(tasks[taskIndex]);
        }
    }
}

function editBtnFn(){
    if(!validate()) return;
    let taskId;
    if(editId!==0) taskId = editId;
    const tasks = getToDoTasksFromDb();

    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        let updatedTask = getEditFields(taskId,tasks[taskIndex].completed);
        tasks[taskIndex] = updatedTask;
      localStorage.setItem("toDoTasks", JSON.stringify(tasks));
    }
    editId = 0;
    clearFields();
    toggleAddEditButtons();
    displayTables();

    showToast(`<div id="toast-success" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">

    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
    </svg>
    <span class="sr-only">Check icon</span>
</div>
<div class="ml-3 text-sm font-normal lg:text-lg">Task updated successfully!</div>

</div>`)
}
  
function deleteTask() {
    if(editId===0){
    const tableRow = event.target.closest("tr");
    const taskId = parseInt(tableRow.querySelector(".hidden").textContent);

    const tasks = getToDoTasksFromDb();

    const updatedTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem("toDoTasks", JSON.stringify(updatedTasks));
    clearFields();
    displayTables();

    
showToast(`<div id="toast-danger" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
    </svg>
    <span class="sr-only">Error icon</span>
</div>
<div class="ml-3 text-sm font-normal lg:text-lg">Task removed!</div>
</div>`)
    }
}

function cancel(){
    editId = 0;
    clearFields();
    toggleAddEditButtons();
}

function toggleAddEditButtons() {
    const addBtn = document.getElementById('add-btn');
    const editCancelBtn = document.getElementById('editAndCancel');
  
    addBtn.classList.toggle('hidden');
    editCancelBtn.classList.toggle('hidden');
}
  
  
function getEditFields(id,completed){
    let taskField = document.getElementById('task').value;
    taskField = taskField.trim();
    let due = document.getElementById('due').value;
    due = (due==='')?currDateAsStr():due;

    let priority = document.querySelector('input[name="priority"]:checked');
    let priorityValue;
    if (priority) priorityValue = priority.value;
    else priorityValue = 'high';

    

    let obj = {
        "id":id,
        "taskField":taskField,
        "due":due,
        "priorityValue":priorityValue,
        "completed":completed
    }
    return obj;
}

function populateFields(task) {
    const taskInput = document.getElementById("task");
    const dueInput = document.getElementById("due");
  
    taskInput.value = task.taskField;
    dueInput.value = task.due;
  
    const priorityRadios = document.getElementsByName("priority");
    for (const radio of priorityRadios) {
      if (radio.value === task.priorityValue) {
        radio.checked = true;
      } else {
        radio.checked = false;
      }
    }
}
  

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerHTML = message;
    toast.classList.remove('invisible');

    setTimeout(() => {
      toast.classList.add('invisible');
    }, 3000);
  }
  
 



