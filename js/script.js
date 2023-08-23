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

}

function validate(){
    const taskField = document.getElementById('task').value;
    if(taskField.trim()==='') return false;
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
                            <i class="fa-regular fa-trash-can delete cursor-pointer" onclick="deleteTask()"></i>
                            </td>`
        if(task.completed){
            completedTable.appendChild(row);
            completedTasksCount++;
        } 
        else taskTable.appendChild(row);
    });
    completedTasksCount = (completedTasksCount==0)?'':completedTasksCount;
    document.getElementById('finishCount').textContent = completedTasksCount;
}

let editId = 0;

function editTask() {
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
}
  
function deleteTask() {
    const tableRow = event.target.closest("tr");
    const taskId = parseInt(tableRow.querySelector(".hidden").textContent);

    const tasks = getToDoTasksFromDb();

    const updatedTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem("toDoTasks", JSON.stringify(updatedTasks));
    displayTables();
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
  



