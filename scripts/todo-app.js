// Initialize todos with localstorage data if it exists
const todos = getSavedTodos()

// Current todo to be displayed by edit module
let currentTodo = null

// todos = [{
//     text: 'You have no tasks! Add one!',
//     completed: false,
//     label: [],
//     dueDate: 'Feb 28'
// }, {
//     text: 'Second task!',
//     completed: false,
//     label: [],
//     dueDate: 'Feb 28'
// }, {
//     text: 'You have aid!',
//     completed: true,
//     label: [],
//     dueDate: 'Feb 28'
// }]

const filters = {
    searchText: '',
    tab: 0, // 0 = all tab, 1 = in progress, 2 = completed
    labelTag: null
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

// Set filter when tab is clicked
allTab.addEventListener('click', e => {
    filters.tab = 0
    headingEl.textContent = 'All'

    renderTodos(todos, filters)
})

inProgressTab.addEventListener('click', e => {
    filters.tab = 1
    headingEl.textContent = 'In Progress'
    renderTodos(todos, filters)
})

completedTab.addEventListener('click', e => {
    filters.tab = 2
    headingEl.textContent = 'Completed'
    renderTodos(todos, filters)
})