'use strict'

// Create the time string for the todo activity timeline
const generateTimeString = momentArg => {
    return `<span class = "edit__timestamp">${momentArg.calendar(moment(), {
        sameElse:'MMM D'
    })}</span>`
}

// Add the time stamp to each history string relative to the moment of generation
const appendTimestamp = (p, changeObj) => {
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
    console.log(todo)
    todo.history.forEach(changeObj => {
        const p = document.createElement('p') 

        appendTimestamp(p, changeObj)
        
        editHistory.appendChild(p)
    })
}

// Check if todo property was updated within the past hours
const wasUpdatedRecently = (property) => {
    // example of property todo.updatedAt.title
    return moment().diff(moment(property), 'hours') < 1
}

