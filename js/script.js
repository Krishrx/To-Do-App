const tasksTable = document.getElementById('tasksTable');

tasksTable.addEventListener('change', function(event) {
    if (event.target.classList.contains('checkbox')) {
        const spanElement = event.target.nextElementSibling;
        spanElement.classList.toggle('checked', event.target.checked);
    }
});


function addTask(){
    if(!validate()) return;

    let fieldValues = getFields();
    let {taskField,due,priorityValue} = fieldValues;
    let priorityColor = getPriorityColor(priorityValue);
    
    addTaskToTable(taskField,priorityColor,due)

    clearFields();

}

function validate(){
    const taskField = document.getElementById('task').value;
    if(taskField==='') return false;
    else return true;
}

function getFields(){
    let taskField = document.getElementById('task').value;
    taskField = taskField.trim();
    let due = document.getElementById('due').value;
    due = (due==='')?currDateAsStr():due;

    let priority = document.querySelector('input[name="priority"]:checked');
    let priorityValue;
    if (priority) priorityValue = priority.value;
    else priorityValue = 'high';


    let obj = {
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

function addTaskToTable(taskField,priorityColor,due){
    let taskTable = document.querySelector('#tasksTable tbody');

    const row = document.createElement("tr");
    row.className = "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";
    row.innerHTML = `<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-normal dark:text-white">
                        <label class="flex items-center">
                            <input type="checkbox" class="mr-2 checkbox w-4 h-4">
                            <span>${taskField}</span>
                        </label>
                        </th>

                        <td class="px-6 py-4">
                        <div class="w-4 h-4 bg-${priorityColor}-500"></div>
                        </td>
                        <td class="px-6 py-4">
                            ${due}
                        </td>

                        <td class="px-6 py-4">
                        <i class="fa-solid fa-pen"></i>
                        <i class="fa-regular fa-trash-can"></i>
                        </td>`

    taskTable.appendChild(row);
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
  