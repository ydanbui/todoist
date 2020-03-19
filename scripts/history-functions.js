'use strict'

// Create the time string for the todo activity timeline
const generateTimeString = momentArg => {
    return `<span class = "edit__timestamp">${momentArg.calendar(moment(), {
        sameElse:'MMM D'
    })}</span>`
}

// Add the time stamp to each history string relative to the moment of generation
const getTimeSinceUpdate = changeObj => {
    if (changeObj.field === 'created') {
        return generateTimeString(moment(changeObj.createdAt))
    } else {
        return generateTimeString(moment(changeObj.updatedAt))
    }
}

// Check if todo property was updated within the past hours
const wasUpdatedRecently = property => {
    // example of property todo.updatedAt.title
    return moment().diff(moment(property), 'hours') < 1
}