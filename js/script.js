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
    console.log(taskField);
    console.log(due);
    console.log(priorityValue);

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
    due = (due==='')?'-':due;

    let priority = document.querySelector('input[name="priority"]:checked');
    let priorityValue;
    if (priority) priorityValue = priority.value;
    else priorityValue = 'high';


    let obj = {
        "taskField":taskField,
        "due":due,
        "priorityValue":priorityValue,
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