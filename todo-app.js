const searchBar = document.querySelector('.header__search')
const addTaskBtn = document.querySelector('.btn--add-task')
const todoSection = document.querySelector('.todo')

const todos = [{
    text: 'You have no tasks! Add one!',
    completed: false,
    label: [],
    dueDate: 'Feb 28'
}, {
    text: 'Second task!',
    completed: false,
    label: [],
    dueDate: 'Feb 28'
}, {
    text: 'You have aid!',
    completed: false,
    label: [],
    dueDate: 'Feb 28'
}]

const filters = {
    searchText: ''
}

// Render todos cards in .todo section
const renderTodos = (todos, filters) => {
    const filteredTodos = todos.filter(todo => {
        return todo.text.toLowerCase().includes(filters.searchText.toLowerCase())
    })

    // Clear existing todos before rendering
    todoSection.innerHTML = ''

    // Print each todo text
    filteredTodos.forEach(todo => {
        const todoCard = document.createElement('article')
        todoCard.textContent = todo.text
        todoSection.appendChild(todoCard)
    })
}

renderTodos(todos, filters)

// Search bar event handler
searchBar.addEventListener('input', e => {
    console.log(e.target.value)
    filters.searchText = e.target.value
    renderTodos(todos, filters)
})

// Add new task buttom
addTaskBtn.addEventListener('click', e => {
    console.log('add new task')
})