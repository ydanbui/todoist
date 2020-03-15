// Add new task button click event handler
addTaskBtn.addEventListener('click', e => {
    // Adds todos and passes in that todo to fill edit module
    fillEditModule(addTodo(todos))
    saveTodos(todos)
    renderTodos(todos, filters)
    renderBadges(todos)

    displayEditModule()
})


editTitle.addEventListener('input', e => {
    currentTodo.title = e.target.value
    saveTodos(todos)
    renderTodos(todos, filters)
})

editTitle.addEventListener('change', e => {
    // If title is being changed
    if (currentTodo.updatedAt.title) { // Check if title has been set
        // Check if change log exists
        const index = currentTodo.history.findIndex(change => {
            return change.includes('Title')
        })
        
        // If index is -1, then changelog doesn't exist and we know the title has only been initialized once
        // Check if change log exists and if it was changed withint the last hour
        if (index >= 0 && wasUpdatedRecently(currentTodo.updatedAt.title)) {
            // If it was changed within last hour, override the change log rather than add another
            currentTodo.history.splice(index,1)
        }
        updateTodoHistory(currentTodo, `Title changed to "${e.target.value}". ${generateTimeString(moment())}`)
        fillEditModule(currentTodo)
    } 
        
    // Don't add initial titling to history (skip of above code block if initializing)
    currentTodo.updatedAt.title = moment().valueOf()
    saveTodos(todos)
})

editComplete.addEventListener('click', e => {
    currentTodo.completed = !currentTodo.completed
    changeCompletedHistory(currentTodo)

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

    // If the due date has already been set and was updated recently
    if (currentTodo.updatedAt.dueDate && wasUpdatedRecently(currentTodo.updatedAt.dueDate)) {
        const index = currentTodo.history.findIndex(change => {
            return change.includes('date')
        })
        // Delete the existing change log.
        currentTodo.history.splice(index, 1)
    }

    currentTodo.updatedAt.dueDate = moment().valueOf()
    updateTodoHistory(currentTodo, `Due date changed to ${getDueDate(currentTodo)}. ${generateTimeString(moment())}`)

    saveTodos(todos)
    renderTodos(todos, filters)
    fillEditModule(currentTodo)
})

editDescription.addEventListener('input', e => {
    currentTodo.description = e.target.value
    saveTodos(todos)
})

editDescription.addEventListener('change', e => {
    // If description was updated recently
    if (currentTodo.updatedAt.description && wasUpdatedRecently(currentTodo.updatedAt.description)) {
        const index = currentTodo.history.findIndex(change => {
            return change.includes('description')
        })
        // Delete the existing change log.
        currentTodo.history.splice(index, 1)
    }

    updateTodoHistory(currentTodo, `Task description changed. ${generateTimeString(moment())}`)
    currentTodo.updatedAt.description = moment()
    fillEditModule(currentTodo)
})
