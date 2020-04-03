'use strict'

editTitle.addEventListener('input', e => {
    currentTodo.title = e.target.value
    saveTodos(todos)
    renderTodos(todos, filters)
})

editTitle.addEventListener('change', e => {
    // If title is being changed
    if (currentTodo.history.find(changeObj => changeObj.field === 'title')) { // Check if title has been set
        // Check if change log exists
        const index = currentTodo.history.findIndex(changeObj => {
            return changeObj.field === 'title'
        })

        // If index is -1, then changelog doesn't exist and we know the title has only been initialized once
        // Check if change log exists and if it was changed withint the last hour
        if (index >= 0 && wasUpdatedRecently(currentTodo.history[index].updatedAt)) {
            // If it was changed within last hour, override the change log rather than add another
            currentTodo.history.splice(index,1)
        }

        currentTodo.addHistory(new Update('title', `Title changed to "${e.target.value}". `))
        
        fillEditModule(currentTodo)
    } else {
        // If this is the first time we are naming task or we haven't changed the name recently, them create a new log without removing the previous
        currentTodo.addHistory(new Update('title', `Title changed to "${e.target.value}". `))
    }
    
    // Don't add initial titling to history (skip of above code block if initializing)
    saveTodos(todos)
})

editComplete.addEventListener('click', e => {
    currentTodo.completed = !currentTodo.completed
    currentTodo.changeCompletedHistory()

    saveTodos(todos)
    renderTodos(todos, filters)
    renderBadges(todos)

    fillEditModule(currentTodo)
})

editDelete.addEventListener('click', e => {
    deleteTodo(currentTodo)
    saveTodos(todos)
    renderTodos(todos, filters)
    renderBadges(todos)
    closeEditModule()
})

editClose.addEventListener('click', e => {
    closeEditModule()
})

editDate.addEventListener('input', e => {
    currentTodo.dueDate = e.target.value
    
    // Search the history array for a due date change log
    const index = currentTodo.history.findIndex(changeObj => changeObj.field === 'dueDate')

    // If the due date has already been set and was updated recently
    if (index >= 0 && wasUpdatedRecently(currentTodo.history[index].updatedAt)) {
        // Delete the existing change log.
        currentTodo.history.splice(index, 1)
    }

    currentTodo.addHistory(new Update('dueDate', `Due date changed to ${currentTodo.getDueDate()}. `))

    saveTodos(todos)
    renderTodos(todos, filters)
    fillEditModule(currentTodo)
})

// Generate label menu when user clicks to add label
editTodoLabel.addEventListener('focus', e => {
    console.log('focus event fire')
    if (e.target.value) {
        // Don't generate menu if clicked when there's text entered
        return
    }

    // Clear menu elements
    editTodoDropdown.innerHTML = ''

    generateAddLabelMenuDOM(labels, editTodoDropdown, e)
    // displayDropdown('.edit__todo-dropdown')

})

// Filters label menu on user input
editTodoLabel.addEventListener('input', e => {
    // Clear menu elements
    editTodoDropdown.innerHTML = ''

    generateAddLabelMenuDOM(labels, editTodoDropdown, e)
})

editDescription.addEventListener('input', e => {
    currentTodo.description = e.target.value
    saveTodos(todos)
})

editDescription.addEventListener('change', e => {
     // Search the history array for a description change log
     const index = currentTodo.history.findIndex(changeObj => changeObj.field === 'description')

    // If description was updated recently
    if (index >= 0 && wasUpdatedRecently(currentTodo.history[index].updatedAt)) {
        // Delete the existing change log.
        currentTodo.history.splice(index, 1)
    }

    currentTodo.addHistory(new Update ('description', 'Task description changed. '))

    fillEditModule(currentTodo)
})

// Display dropdown when label input is clicked
document.querySelector('#editLabelInput').addEventListener('click', e => {
    console.log('edit label input clicked')
    displayDropdown('.edit__todo-dropdown')

})