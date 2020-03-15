// Create the time string for the todo activity timeline
const generateTimeString = momentArg => {
    return `<span class = "edit__timestamp">${momentArg.calendar(moment(), {
        sameElse:'MMM D'
    })}</span>`
}

// Add an update to the todo's history
const updateTodoHistory = (todo, updateString) => {
    // Add given string argument to beginning of history property array
    todo.history.unshift(updateString)
}

// Add change to or remove change from todo history
const changeCompletedHistory = todo => {
     if (todo.completed) {
        // if being marked completed
        updateTodoHistory(todo, `Task completed. ${generateTimeString(moment())}`)
    } else {
        // if being marked incomplete
        const index = todo.history.findIndex(update => {
            // Remove the completed update from task history
            return update.includes('complete')
        })
        todo.history.splice(index, 1)
    }
}

// Generate timeine dom elements in edit module
const generateHistoryDOM = todo => {
    // loop through todo.history array and generate p elements for each update
    todo.history.forEach(change => {
        const p = document.createElement('p') 
        p.innerHTML = change
        editHistory.appendChild(p)
    })
}

// Check if todo property was updated within the past hours
const wasUpdatedRecently = (property) => {
    // example of property todo.updatedAt.title
    return moment().diff(moment(property), 'hours') < 1
}

