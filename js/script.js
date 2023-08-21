const tasksTable = document.getElementById('tasksTable');

tasksTable.addEventListener('change', function(event) {
    if (event.target.classList.contains('checkbox')) {
        const spanElement = event.target.nextElementSibling;
        spanElement.classList.toggle('checked', event.target.checked);
    }
});
