'use strict'

/*
- Sort by functionality
- Timeline of changes. May need to ad change event listener since input fires too much when making changes
- For timeline, function that checks how far away date was and outputs either calendar date or relative days ago
*/

// Initialize todos with localstorage data if it exists
let todos = getSavedTodos()

// Current todo to be displayed by edit module
let currentTodo = todos[0]

const labelss = [{
    name: 'Design',
    color: '#FFB45e'
}, {
    name: 'Web Development',
    color: '#B7DDAC'
}]

const labels = getSavedLabels()

const labelColors = ['#FFB45E', '#B7DDAC','#B1DBF7', 'purple', 'red', 'pink', 'blue', 'yellow']

const filters = {
    searchText: '',
    tab: 0, // 0 = all tab, 1 = in progress, 2 = completed
    labelTag: null
}

renderTodos(todos, filters)
renderBadges(todos)
renderLabels(labels)

// Search bar input event handler
searchBar.addEventListener('input', function(e) {
    // Set filter to be search input
    filters.searchText = e.target.value

    // Render todos with new filter
    renderTodos(todos, filters)
})

// Set filter when tab is clicked
allTab.addEventListener('click', function(e) {
    filters.tab = 0
    headingEl.textContent = 'All'
    setActiveTab(this)
    renderTodos(todos, filters)
})

inProgressTab.addEventListener('click', function(e) {
    filters.tab = 1
    headingEl.textContent = 'In Progress'
    setActiveTab(this)
    renderTodos(todos, filters)
})

completedTab.addEventListener('click', function(e) {
    filters.tab = 2
    headingEl.textContent = 'Completed' 
    setActiveTab(this)
    renderTodos(todos, filters)
})

// Add new task button click event handler
addTaskBtn.addEventListener('click', e => {
    // Adds todos and passes in that todo to fill edit module
    fillEditModule(addTodo(todos))
    saveTodos(todos)
    renderTodos(todos, filters)
    renderBadges(todos)

    displayEditModule()
})

// Fetch random activity from API and add it as todo
addRandomTaskBtn.addEventListener('click', e => {
    closeEditModule()
    addTodo(todos)

    getRandomTodo().then(activity => {
        currentTodo.title = activity
        saveTodos(todos)
        renderTodos(todos, filters)
        renderBadges(todos)
    }).catch(err => {
        console.log(`Error: ${err}`)
    })

})

// Sync data across windows
window.addEventListener('storage', e => {
    if (e.key === 'todos') {
        todos = JSON.parse(e.newValue)
        renderTodos(todos, filters)
        renderBadges(todos)

        // If the edit module for the same todo are open in both window
        if (currentTodo) {
            // Update currentTodo to the newest version by searching the updates todos array
            currentTodo = todos.find(todo => todo.id === currentTodo.id)
        } 
        // If we delete the todo while the edit module is open in the other window. The currentTodo will be undefined after the code above runs
        if (!currentTodo) {
            // Close the edit module
            closeEditModule()
            // don't run fillEditModule below
            return
        }
        fillEditModule(currentTodo)
    }
})