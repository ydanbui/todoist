// Add new task button click event handler
addTaskBtn.addEventListener('click', e => {
    // Adds todos and passes in that todo to fill edit module
    fillEditModule(addTodo(todos))
    saveTodos(todos)
    renderTodos(todos, filters)
    renderBadges(todos)

    displayEditModule(editModule)
})


editTitle.addEventListener('input', e => {
    currentTodo.text = e.target.value
    saveTodos(todos)
    renderTodos(todos, filters)
})

editComplete.addEventListener('click', e => {
    currentTodo.completed = !currentTodo.completed
    saveTodos(todos)
    renderTodos(todos, filters)
    renderBadges(todos)
})

editDelete.addEventListener('click', e => {
    deleteTodo(currentTodo)
    saveTodos(todos)
    renderTodos(todos, filters)
    renderBadges(todos)
    closeEditModule(editModule)
})

editClose.addEventListener('click', e => {
    closeEditModule(editModule)
})

editDate.addEventListener('input', e => {
    currentTodo.dueDate = e.target.value
    saveTodos(todos)
    renderTodos(todos, filters)
})

editDescription.addEventListener('input', e => {
    currentTodo.description = e.target.value
    saveTodos(todos)
})
