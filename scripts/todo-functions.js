// Retried saved todos from localStorage if they exist
const getSavedTodos = () => {
    const storedTodos = localStorage.getItem('todos')
    return storedTodos ? JSON.parse(storedTodos) : []
}

// Save todos array to local storage
const saveTodos = todos => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

const deleteTodo = (todosArg, index) => {
    // For deleting from the edit module. If we directly pass in a todo object, not the todos array
    if (!Array.isArray(todosArg)) {
        const ind = todos.findIndex( todo => todo === currentTodo)
        console.log(ind)
        todos.splice(ind, 1)
        console.log('deleting object from array')
        return
    }
    todosArg.splice(index, 1)
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
        changeCompletedHistory(todo)

        saveTodos(todos)
        
        //  Rerender so that card will be removed from inprogress/completed when checked/unchecked
        renderBadges(todos)
        renderTodos(todos, filters)


        // Fill the edit module with the current todo (may not be this one)
        fillEditModule(currentTodo)
    })

    return todoCheckbox
}

// Function to translate the due daye into formated string to display
const getDueDate = todo => {
    if (!todo.dueDate) {
         // if the due daye has not been set
        return todo.dueDate
    // } else if (moment(todo.dueDate).valueOf() > moment().add(1, 'y').valueOf()) {
    } else if (moment(todo.dueDate).year() !== moment().year()) {
        // If the due date is not this year, display the year
        return moment(todo.dueDate).format('MMM D YYYY')
    } else {
        // don't display the year
        return moment(todo.dueDate).format('MMM D')
    }
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
    const todoTitle = document.createElement('span')
    todoTitle.textContent = todo.title ? todo.title : 'Write task'
    todoCard.appendChild(todoTitle)

    // Create the due date element
    const dateEl = document.createElement('span')
    dateEl.textContent = getDueDate(todo)
    todoCard.appendChild(dateEl)

    // Create the delete button
    const deleteTodoEl = document.createElement('button')
    deleteTodoEl.textContent = 'X'
    deleteTodoEl.addEventListener('click', e => {
        deleteTodo(todos, index)
        saveTodos(todos)
        renderTodos(todos, filters)
        renderBadges(todos)

        // If this todo is currently being edited, close that when this gets deleted
        if (currentTodo === todo) {
            closeEditModule()
        }
    })
    todoCard.appendChild(deleteTodoEl)

    // Open edit modul if card is clicked
    todoCard.addEventListener('click', function(e) {
        // Don't open it if checkbox or icon button clicked
        if (e.target !== this && e.target !== todoTitle) {
            return
        }
        setEditTodo(todo)
        fillEditModule(todo)
        displayEditModule()
    })

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
            return todo.title.toLowerCase().includes(filters.searchText.toLowerCase()) && !todo.completed
        } else if (filters.tab === 2) { // When completed tab is clicked
            return todo.title.toLowerCase().includes(filters.searchText.toLowerCase()) && todo.completed
        } else { // When all tab is clicked (default)
            return todo.title.toLowerCase().includes(filters.searchText.toLowerCase())
        }
    })

    // Clear existing todo elements before rendering
    todoSection.innerHTML = ''

    // Print each todo in the filtered todo array
    filteredTodos.forEach((todo, index) => {
        const todoCard = generateTodoCardDom(todo, index)
        todoSection.appendChild(todoCard)
    })
}

// Add new todo to end of todo array
const addTodo = todos => {
    // const id = uuidv4()
    const timestamp = moment().valueOf()

    currentTodo = {
        id: uuidv4(),
        title:'',
        completed: false,
        label: [],
        dueDate: '',
        description: '',
        createdAt: timestamp,
        updatedAt: {
            title: null,
            completed: null,
            dueDate: null,
            description: null
        },
        history: ['Task created. ']
    }

    todos.push(currentTodo)

    return currentTodo
}

// Fills the edit module with content from the correct todo
const fillEditModule = currentTodo => {
    editHistory.innerHTML = ''
    editTitle.value = currentTodo.title
    editDate.value = currentTodo.dueDate
    editDescription.value = currentTodo.description
    generateHistoryDOM(currentTodo)
}

// Display edit module
const displayEditModule = () => {
    editModule.style.display = "block"
}

// Close the edit module
const closeEditModule = () => {
    editModule.style.display = "none"
}

// Set the correct todo to fill edit module
const setEditTodo = todo => {
    currentTodo = todo
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