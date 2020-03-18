'use strict'

// Create the time string for the todo activity timeline
const generateTimeString = momentArg => {
    return `<span class = "edit__timestamp">${momentArg.calendar(moment(), {
        sameElse:'MMM D'
    })}</span>`
}

// Add an update to the todo's history
const updateTodoHistory = (todo, updateObj) => {
    // Add given update object argument to beginning of history property array
    todo.history.unshift(updateObj)
}

// Add change to or remove change from todo history
const changeCompletedHistory = todo => {
     if (todo.completed) {
        // if being marked completed
        // Add update object to the todo history array
        updateTodoHistory(todo, {
            field: 'completed',
            text: 'Task completed. ',
            updatedAt: moment().valueOf()
        })
    } else {
        // if being marked incomplete
        const index = todo.history.findIndex(updateObj => {
            // Remove the completed update from task history
            return updateObj.field === 'completed'
        })
        todo.history.splice(index, 1)
    }
}

// Add the time stamp to each history string relative to the moment of generation
const appendTimestamp = (p, todo, changeObj) => {
    if (changeObj.field === 'created') {
        p.innerHTML = changeObj.text + generateTimeString(moment(changeObj.createdAt))
    } else if (changeObj.field === 'completed') {
        p.innerHTML = changeObj.text + generateTimeString(moment(changeObj.updatedAt))
    } else if (changeObj.field === 'title') {
        p.innerHTML = changeObj.text + generateTimeString(moment(changeObj.updatedAt))
    } else if (changeObj.field === 'dueDate') {
        p.innerHTML = changeObj.text + generateTimeString(moment(changeObj.updatedAt))
    } else if (changeObj.field === 'description') {
        p.innerHTML = changeObj.text + generateTimeString(moment(changeObj.updatedAt))
    }
}

// Generate timeine dom elements in edit module
const generateHistoryDOM = todo => {
    // loop through todo.history array and generate p elements for each update
    todo.history.forEach(changeObj => {
        const p = document.createElement('p') 

        appendTimestamp(p, todo, changeObj)
        
        editHistory.appendChild(p)
    })
}

// Check if todo property was updated within the past hours
const wasUpdatedRecently = (property) => {
    // example of property todo.updatedAt.title
    return moment().diff(moment(property), 'hours') < 1
}

