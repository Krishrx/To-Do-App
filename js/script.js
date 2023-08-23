let toDoArray = getToDoTasksFromDb();
if(toDoArray){
    sortTasks(toDoArray)
    updateTasksTable(toDoArray);
}


const sectionTwo = document.getElementById('section-two');

sectionTwo.addEventListener('change', function(event) {
    if (event.target.classList.contains('checkbox')) {
        const spanElement = event.target.nextElementSibling;
        spanElement.classList.toggle('checked', event.target.checked);
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





function addTask(){
    if(!validate()) return;

    let fieldValues = getFields();
    addTasksToDb(fieldValues);

    let toDoArray = getToDoTasksFromDb();
    sortTasks(toDoArray)
    updateTasksTable(toDoArray);

    clearFields();

}

function validate(){
    const taskField = document.getElementById('task').value;
    if(taskField==='') return false;
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
        "priorityValue":priorityValue
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
    return toDoList;
}

function updateTasksTable(tasks){
    let taskTable = document.querySelector('#tasksTable tbody');
    taskTable.innerHTML = "";

    tasks.forEach(task => {
        const row = document.createElement("tr");
        row.className = "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";
        row.innerHTML = `<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-normal dark:text-white" style="width: 40%;">
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-2 checkbox w-4 h-4">
                                <span>${task.taskField}</span>
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
                            <i class="fa-solid fa-pen"></i>
                            <i class="fa-regular fa-trash-can"></i>
                            </td>`
        taskTable.appendChild(row);
    });

}




















// function addTaskToTable(id,taskField,priorityColor,due){
//     let taskTable = document.querySelector('#tasksTable tbody');

//     const row = document.createElement("tr");
//     row.className = "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";
//     row.innerHTML = `<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-normal dark:text-white">
//                         <label class="flex items-center">
//                             <input type="checkbox" class="mr-2 checkbox w-4 h-4">
//                             <span>${taskField}</span>
//                         </label>
//                         </th>
//                         <td class="px-6 py-4 hidden">
//                             ${id}
//                         </td>
//                         <td class="px-6 py-4">
//                         <div class="w-4 h-4 bg-${priorityColor}-500"></div>
//                         </td>
//                         <td class="px-6 py-4">
//                             ${due}
//                         </td>

//                         <td class="px-6 py-4">
//                         <i class="fa-solid fa-pen"></i>
//                         <i class="fa-regular fa-trash-can"></i>
//                         </td>`

//     taskTable.appendChild(row);
// }

// const tasksTable = document.getElementById('tasksTable');

// tasksTable.addEventListener('change', function(event) {
//     if (event.target.classList.contains('checkbox')) {
//         const spanElement = event.target.nextElementSibling;
//         spanElement.classList.toggle('checked', event.target.checked);
//     }
// });


// const completedTasksTable = document.getElementById('completedTasksTable');

// completedTasksTable.addEventListener('change', function(event) {
//     if (event.target.classList.contains('checkbox')) {
//         const spanElement = event.target.nextElementSibling;
//         spanElement.classList.toggle('checked', event.target.checked);
//     }
// });