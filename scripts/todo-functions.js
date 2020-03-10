// Retried saved todos from localStorage if they exist
const getSavedTodos = () => {
    const storedTodos = localStorage.getItem('todos')
    return storedTodos ? JSON.parse(storedTodos) : []
}

// Save todos array to local storage
const saveTodos = todos => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

const deleteTodo = (todos, index) => {
    todos.splice(index, 1)
}

// Create todo checkbox DOM and add event handler to checkbox
const generateTodoCheckboxDom = (todo) => {
    // Create the checkbox
    const todoCheckbox = document.createElement('input')
    todoCheckbox.type = 'checkbox'
    todoCheckbox.classList.add('todo__checkbox')
    todoCheckbox.checked = todo.completed
 
    // Event handler for checking checkbox
    todoCheckbox.addEventListener('change', e => {
        todo.completed = !todo.completed
        saveTodos(todos)
        
    //  Rerender so that card will be removed from inprogress/completed when checked/unchecked
        renderBadges(todos)
        renderTodos(todos, filters)
    })

    return todoCheckbox
}

// Create the todo card element
const generateTodoCardDom = (todo, index) => {
    // Create the parent card
    const todoCard = document.createElement('article')
    todoCard.classList.add('todo__card')

    // Create the checkbox
    const todoCheckbox = generateTodoCheckboxDom(todo)
    todoCard.appendChild(todoCheckbox)

    // Create the text content
    const todoText = document.createElement('span')
    todoText.textContent = todo.text
    todoCard.appendChild(todoText)

    // Create the delete button
    const deleteTodoEl = document.createElement('button')
    deleteTodoEl.textContent = 'X'
    deleteTodoEl.addEventListener('click', e => {
        deleteTodo(todos, index)
        saveTodos(todos)
        renderTodos(todos, filters)
        renderBadges(todos)
    })
    todoCard.appendChild(deleteTodoEl)

    return todoCard
}

// Render badges in header
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

// Render todos cards in .todo section based on filters
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
    filteredTodos.forEach((todo, index) => {
        const todoCard = generateTodoCardDom(todo, index)
        todoSection.appendChild(todoCard)
        console.log(index)
    })
}

// Add new todo to end of todo array
const addTodo = todos => {
    todos.push({
        id: uuidv4(),
        text:'Write task',
        completed: false,
        label: [],
        dueDate: null
    })
}

/*REMOVED since we can just rerender the todos each time the checkbox is changed
// Functionality so that changing the checkbox on the in progress/completed tabs removes the todo card
const handleTodoCardWhenChecked = (checkboxes) => {
    // If todo is checked, it is completed and the card is removed from this tab
    // If todo is unchecked, it is in progress and is removed from this tab

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', e => {
            checkbox.parentElement.remove()
        })
    })
}*/