'use strict'

const searchBar = document.querySelector('.header__search')
const addTaskBtn = document.querySelector('.btn--add-task')
const todoSection = document.querySelector('.todo')
const headerBadgeAll = document.querySelector('#headerBadgeAll') 
const headerBadgeInProgress = document.querySelector('#headerBadgeInProgress') 
const headerBadgeCompleted = document.querySelector('#headerBadgeCompleted') 
const allTab = document.querySelector('#allTab')
const inProgressTab = document.querySelector('#inProgressTab')
const completedTab = document.querySelector('#completedTab')
const headingEl = document.querySelector('.heading')

// EDIT MODULE
const editModule = document.querySelector('.edit')
const editComplete = document.querySelector('.edit__complete')
const editDelete = document.querySelector('.edit__delete')
const editClose = document.querySelector('.edit__close')
const editTitle = document.querySelector('.edit__title')
const editDate = document.querySelector('.edit__date')
const editLabel = document.querySelector('.edit__label')
const editDescription = document.querySelector('.edit__description')
const editHistory = document.querySelector('.edit__history')