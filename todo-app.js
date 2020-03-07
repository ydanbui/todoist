const searchBar = document.querySelector('.header__search')
const addTaskBtn = document.querySelector('.btn--add-task')
const todoSection = document.querySelector('.todo')
const editModule = document.querySelector('.edit')
const headerBadgeAll = document.querySelector('#headerBadgeAll') 
const headerBadgeInProgress = document.querySelector('#headerBadgeInProgress') 
const headerBadgeCompleted = document.querySelector('#headerBadgeCompleted') 

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
    completed: true,
    label: [],
    dueDate: 'Feb 28'
}]

const filters = {
    searchText: '',
    labelTag: null
}

// Function to render badges in header
const renderBadges = todos => {
    const total = todos.length
    let inProgress = 0
    let completed = 0

    // Count number of todos that are in progress and completed
    todos.forEach(todo => {
        todo.completed ? completed++ : inProgress++
    })

    // Set badges text content
    headerBadgeAll.textContent = total
    headerBadgeInProgress.textContent = inProgress
    headerBadgeCompleted.textContent = completed
}

// Function to render todos cards in .todo section
const renderTodos = (todos, filters) => {
    // New array of filtered todos
    const filteredTodos = todos.filter(todo => {
        return todo.text.toLowerCase().includes(filters.searchText.toLowerCase())
    })

    // Clear existing todo elements before rendering
    todoSection.innerHTML = ''

    // Print each todo in the filtered todo array
    filteredTodos.forEach(todo => {
        const todoCard = document.createElement('article')
        todoCard.textContent = todo.text
        todoSection.appendChild(todoCard)
    })
}

renderTodos(todos, filters)
renderBadges(todos)

// Search bar input event handler
searchBar.addEventListener('input', e => {
    console.log(e.target.value)
    // Set filter to be search input
    filters.searchText = e.target.value
    // Render todos with new filter
    renderTodos(todos, filters)
})

// Add new task button click event handler
addTaskBtn.addEventListener('click', e => {
    console.log('add new task')

    // Add new todo to end of todo array
    todos.push({
        text:'Write task',
        completed: false,
        label: [],
        dueDate: null
    })

    // Rerender todos and badge
    renderTodos(todos, filters)
    renderBadges(todos)

    // Display edit module
    editModule.style.display = "block"

})