'use strict'

class Todo {
    constructor() {
        this.id = uuidv4(),
        this.title ='',
        this.completed = false,
        this.label = [],
        this.dueDate = '',
        this.description = '',
        this.history = [{
            field: 'created',
            text: 'Task created. ',
            createdAt: moment().valueOf()
        }]
    }

    // Create todo checkbox DOM and add event handler to checkbox
    generateCheckboxDom() {
        // Create the checkbox
        const todoCheckbox = document.createElement('input')
        todoCheckbox.type = 'checkbox'
        todoCheckbox.classList.add('todo__checkbox')
        todoCheckbox.checked = this.completed

        const thisTodo = this
    
        // Event handler for checking checkbox
        todoCheckbox.addEventListener('change', e => {
            thisTodo.completed = !thisTodo.completed
            thisTodo.changeCompletedHistory()
            saveTodos(todos)
            
            //  Rerender so that card will be removed from inprogress/completed when checked/unchecked
            renderBadges(todos)
            renderTodos(todos, filters)

            // Fill the edit module with the current todo (may not be this one)
            fillEditModule(currentTodo)
        })

        return todoCheckbox
    }

    // Function to translate the due date into formated string to display
    getDueDate() {
        const date = this.dueDate
        if (!date) {
            // if the due daye has not been set
            return date
        } else if (moment(date).year() !== moment().year()) {
            // If the due date is not this year, display the year
            return moment(date).format('MMM D YYYY')
        } else {
            // don't display the year
            return moment(date).format('MMM D')
        }
    }

    // Create the todo card element
    generateCardDom(index) {
        // Create the parent card
        const todoCard = document.createElement('article')
        todoCard.classList.add('todo__card')

        // Create the checkbox
        const todoCheckbox = this.generateCheckboxDom()
        todoCard.appendChild(todoCheckbox)

        // Create the text content
        const todoTitle = document.createElement('span')
        todoTitle.textContent = this.title ? this.title : 'Write task'
        todoCard.appendChild(todoTitle)

        // Create the due date element
        const dateEl = document.createElement('span')
        dateEl.textContent = this.getDueDate()
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
            if (currentTodo === this) {
                closeEditModule()
            }
        })
        todoCard.appendChild(deleteTodoEl)

        const thisTodo = this
        // Open edit modal if card is clicked
        todoCard.addEventListener('click', function(e) {
            // Don't open it if checkbox or icon button clicked
            if (e.target !== this && e.target !== todoTitle && e.target !== dateEl) {
                return
            }
            setEditTodo(thisTodo)
            fillEditModule(thisTodo)
            displayEditModule()
        })

        return todoCard
    }

    // Add an update to the todo's history
    addHistory(updateObj) {
        // Add given update object argument to beginning of history property array
        this.history.unshift(updateObj)
    }

    // Add change to or remove change from todo history
    changeCompletedHistory() {
        if (this.completed) {
            // if being marked completed
            // Add update object to the todo history array
            this.addHistory(new Update('completed', 'Task completed. '))
        } else {
            // if being marked incomplete
            const index = this.history.findIndex(updateObj => {
                // Remove the completed update from task history
                return updateObj.field === 'completed'
            })
            this.history.splice(index, 1)
        }
    }

    // Generate timeine dom elements in edit module
    generateHistoryDOM() {
        // loop through todo.history array and generate p elements for each update
        this.history.forEach(changeObj => {
            const p = document.createElement('p') 
            p.innerHTML = changeObj.text + getTimeSinceUpdate(changeObj)
            editHistory.appendChild(p)
        })
    }
}

class Update {
    constructor(field, text) {
        this.field = field,
        this.text = text,
        this.updatedAt = moment().valueOf()
    }
}

// Retrieve saved todos from localStorage if they exist
const getSavedTodos = () => {
    const storedTodos = localStorage.getItem('todos')
    
    try {
        if (storedTodos) { 
            // When retrieving JSON, we need to re-create the prototype change to use the Todo methods
            const todos = JSON.parse(storedTodos)

            // Re-create the chain for each todo object
            todos.forEach(todo => {
                Object.setPrototypeOf(todo, Todo.prototype)
            })
            return todos
        } else {
            return []
        }
    } catch(e) {
        return []
    }
}

// Save todos array to local storage
const saveTodos = todos => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

const deleteTodo = (todosArg, index) => {
    // For deleting from the edit module. If we directly pass in a todo object, not the todos array
    if (!Array.isArray(todosArg)) {
        const ind = todos.findIndex( todo => todo === currentTodo)
        todos.splice(ind, 1)
    } else {
        todosArg.splice(index, 1)
    }
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
        const todoCard = todo.generateCardDom(index)
        todoSection.appendChild(todoCard)
    })
}

// Add new todo to end of todo array
const addTodo = todos => {
    currentTodo = new Todo()
    todos.push(currentTodo)
    return currentTodo
}

// Fills the edit module with content from the correct todo
const fillEditModule = currentTodo => {
    editHistory.innerHTML = ''
    editTitle.value = currentTodo.title
    editDate.value = currentTodo.dueDate
    editDescription.value = currentTodo.description
    currentTodo.generateHistoryDOM()
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