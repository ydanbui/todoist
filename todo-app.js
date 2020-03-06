const todos = [{
    text: 'You have no tasks! Add one!',
    completed: false,
    label: [],
    dueDate: 'Feb 28'
}]

// Print each todo text
todos.forEach(todo => {
    const p = document.createElement('p')
    p.textContent = todo.text
    document.querySelector('.todo').appendChild(p)
})

// Add new task buttom
const addTaskBtn = document.querySelector('.btn--add-task')
addTaskBtn.addEventListener('click', e => {
    console.log('add new task')
})