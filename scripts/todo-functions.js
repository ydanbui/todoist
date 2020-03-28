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

        // Create the label elements the this element has labels
        if (this.label.length > 0) {
            const labelsContainer = document.createElement('div')
            labelsContainer.classList.add('todo__labels-container')

            // Loop through labels and generate badge
            this.label.forEach(lab => {
                generateLabelBadgeDom(labelsContainer, lab)
            })

            todoCard.appendChild(labelsContainer)

        }


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

            // Re-create the prototype chain for each todo object
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

// Generates the todo label badge DOM for each label added to the todo
const generateLabelBadgeDom = (container, label) => {
    const badgeEl = document.createElement('div')
    badgeEl.classList.add('todo__label')
    badgeEl.textContent = label.name
    badgeEl.style.backgroundColor = label.color

    container.appendChild(badgeEl)
}

// Fills the edit module with content from the correct todo
const fillEditModule = currentTodo => {
    editHistory.innerHTML = ''
    editTitle.value = currentTodo.title
    editDate.value = currentTodo.dueDate
    editDescription.value = currentTodo.description

    editLabelBadgeContainer.innerHTML = ''

    // If the current todo has a label
    if (currentTodo.label.length > 0) {
        currentTodo.label.forEach(lab => {
            generateLabelBadgeDom(editLabelBadgeContainer, lab)
        })
    }

    currentTodo.generateHistoryDOM()
}

// Display edit module
const displayEditModule = () => {
    editModule.style.display = "block"
}

const toggleDisplay = (el) => {
    el.classList.toggle('show')
} 

// Close the edit module
const closeEditModule = () => {
    editModule.style.display = "none"
}

// Set the correct todo to fill edit module
const setEditTodo = todo => {
    currentTodo = todo
}

// Generate the individual add label dropdown menu elements in the edit module
const generateLabelLiDOM = (labelArg) => {
    const li = document.createElement('li')

    const ind = currentTodo.label.findIndex(lab => lab.id === labelArg.id)
    
    // If this todo already has that label
    if (ind > -1) {
        //  add a checkmark
        li.innerHTML = `<button>check</button>${labelArg.name}`

        // When the label option is clicked
        li.addEventListener('click', e => {
            // Remove the label from the todo
            currentTodo.label.splice(ind, 1)
            saveTodos(todos)
            renderTodos(todos, filters)
            fillEditModule(currentTodo)
        })
    } else {
        // If the todo does not have the label

        // No checkm,ark
        li.textContent = labelArg.name

        li.addEventListener('click', e => {
            // Add the correct label when the menu item is clicked
            currentTodo.label.push(labels.find(lab => lab.name === labelArg.name))
            saveTodos(todos)
            renderTodos(todos, filters)
            fillEditModule(currentTodo)
        })
    }

    editTodoUL.appendChild(li)
}

// Generate menu for add label to todo in edit module
const generateAddLabelMenuDOM = (labels, editTodoUL, e) => {
    // If user has not entered input
    if (!e.target.value.trim()) {
        // Generate a menu element for each created label
        labels.forEach(label => {
            generateLabelLiDOM(label)
        })
    } else {
        // Generate a menu element for each created label that matches user input
        labels.forEach(label => {
            if (label.name.toLowerCase().trim().startsWith(e.target.value.toLowerCase().trim())) {
                generateLabelLiDOM(label)    
            }
        })

        // Check if there are labels that exactly match user input (if there array will have elements)
        const arr = labels.filter(label => label.name.trim().toLowerCase() === e.target.value.trim().toLowerCase())

        // If there are no labels matching the user's input
        if (arr.length === 0) {
            console.log('no matching label')
            const createNewLabelEl = document.createElement('li')
            createNewLabelEl.textContent = `Create new ${e.target.value} label`

            // Click event for adding new label
            createNewLabelEl.addEventListener('click', () => {
                // Create new label based on users input
                const newLabel = new Label(e.target.value)
                labels.push(newLabel)
                saveLabels(labels)
                renderLabels(labels)

                // Clear input field when label added
                e.target.value = ''

                // Add that label to the current todo
                currentTodo.label.push(newLabel)
                saveTodos(todos)
                renderTodos(todos, filters)
                fillEditModule(currentTodo)
            })

            editTodoUL.appendChild(createNewLabelEl)
        }
    }
}

// BORED API REQUEST
const getRandomTodo = async () => {
    const response = await fetch('http://www.boredapi.com/api/activity/')
    if (!response.ok) {
        throw Error('Unable to fetch random activity')
    }

    const data = await response.json()
    
    return data.activity
}