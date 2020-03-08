const searchBar = document.querySelector('.header__search')
const addTaskBtn = document.querySelector('.btn--add-task')
const todoSection = document.querySelector('.todo')
const editModule = document.querySelector('.edit')
const headerBadgeAll = document.querySelector('#headerBadgeAll') 
const headerBadgeInProgress = document.querySelector('#headerBadgeInProgress') 
const headerBadgeCompleted = document.querySelector('#headerBadgeCompleted') 
const allTab = document.querySelector('#allTab')
const inProgressTab = document.querySelector('#inProgressTab')
const completedTab = document.querySelector('#completedTab')

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
    tab: 0, // 0 = all tab, 1 = in progress, 2 = completed
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
        if (filters.tab === 1) { // When in progress tab is clicked
            return todo.text.toLowerCase().includes(filters.searchText.toLowerCase()) && !todo.completed
        } else if (filters.tab === 2) { // When completed tab is clicked
            return todo.text.toLowerCase().includes(filters.searchText.toLowerCase()) && todo.completed
        } else { // When all tab is clicked (default)
            return todo.text.toLowerCase().includes(filters.searchText.toLowerCase())
        }
    })

    // Clear existing todo elements before rendering
    todoSection.innerHTML = ''

    // Print each todo in the filtered todo array
    filteredTodos.forEach(todo => {
        // Create the parent card
        const todoCard = document.createElement('article')
        todoCard.classList.add('todo__card')

        // Create the checkbox
        const todoCheckbox = document.createElement('input')
        todoCheckbox.type = 'checkbox'
        todoCheckbox.classList.add('todo__checkbox')
        if (todo.completed) {
            todoCheckbox.checked = true
        }
        todoCheckbox.addEventListener('change', e => {
            console.log(todo.text)
            todo.completed = !todo.completed
            renderBadges(todos)
            console.log(todo.completed)
            // renderTodos(todos, filters)
        })
        todoCard.appendChild(todoCheckbox)

        // Create the text content
        const todoText = document.createElement('span')
        todoText.textContent = todo.text
        todoCard.appendChild(todoText)

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

// Set filter when tab is clicked
allTab.addEventListener('click', e => {
    filters.tab = 0
    document.querySelector('.heading').textContent = 'All'

    renderTodos(todos, filters)
})

inProgressTab.addEventListener('click', e => {
    filters.tab = 1
    document.querySelector('.heading').textContent = 'In Progress'
    renderTodos(todos, filters)

    const checkboxes = document.querySelectorAll('.todo__checkbox')

    // If todo is checked, it is completed and the card is removed from this tab
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', e => {
            checkbox.parentElement.remove()
        })
    })

})

completedTab.addEventListener('click', e => {
    filters.tab = 2
    document.querySelector('.heading').textContent = 'Completed'

    renderTodos(todos, filters)

    const checkboxes = document.querySelectorAll('.todo__checkbox')

    // If todo is unchecked, it is in progress and is removed from this tab
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', e => {
            checkbox.parentElement.remove()
        })
    })
})