'use strict'

const sidebar = document.querySelector('.sidebar__body')
const sidebarLabels = document.querySelector('.sidebar__labels')
const createLabelBtn = document.querySelector('.btn--create-label')

class Label {
    // Default name follows the Label, Label 2, Label 3 pattern
    constructor(name = `Label ${labels.length > 0 ? labels.length + 1 : ''}`) {
            const col = labelColors[labels.length % 8]
            this.id = uuidv4(),
            this.name = name,
            // Set colors according to labelColors array. Loop through it
            this.color = col,
            this.textColor = LightenDarkenColor(col, -150)
    }

    // Generate the label bullet point
    generateBulletDom() {
        const bullet = document.createElement('div')
        bullet.classList.add('sidebar__bullet')
        bullet.style.backgroundColor = `${this.color}`

        return bullet
    }

    // Generate the label sidebar text
    generateTextDom() {
        const labelText = document.createElement('div')
        labelText.classList.add('sidebar__label-name')

        // Save changes when label is renamed
        labelText.addEventListener('input', e => {
            this.name = labelText.textContent
            saveLabels(labels)
            console.log('todos saved and rendered')
            saveTodos(todos)
            renderTodos(todos, filters)
            fillEditModule(currentTodo)
        })

        const currentLabel = this

        // If the label text is blank, delete it
        labelText.addEventListener('blur', e => {
            if (!labelText.textContent.trim()) {
                // Delete the label from the labels array
                const i = labels.findIndex(label => label === currentLabel)
                deleteLabel(labels, i)
                saveLabels(labels)
                renderLabels(labels)
            }
        })

        // Don't start new line if user presses enter when editing
        labelText.addEventListener('keydown', e => {
            // If user presses enter
            if (e.keyCode === 13) {
                // Unfocus
                labelText.blur()
                // Clear highlighted text
                window.getSelection().removeAllRanges()
            }
        })

        labelText.contentEditable = 'true'
        labelText.textContent = this.name

        return labelText
    }

    // Generate the label menu
    generateMenuDom() {
        const menu = document.createElement('div')
        menu.classList.add('menu')

        const menuBtn = document.createElement('button')
        menuBtn.classList.add('menu__btn')
        menuBtn.innerHTML = '<svg class="icon" id="menuIconEl"><use id = "menuUseEl" xlink:href="/img/icons.svg#icon-menu"></use></svg>'
        menuBtn.addEventListener('click', e=> {
            // Set the currentlabel variable to this so menu populates with correct label data
            globalCurrentLabel = this
            fillLabelMenu(document.querySelector('.menu__list'), globalCurrentLabel)
            displayDropdown('.menu__list')
        })

        const menuList = document.createElement('ul')
        menuList.classList.add('menu__list')
        menuList.classList.add('dropdown')

        // Stop bubbling so that clicking in dropdown won't bubble up to window and close it
        menuList.addEventListener('click', e => {
            console.log('click')
            event.stopPropagation();
        })

        // const currentLabel = this

        fillLabelMenu(menuList, globalCurrentLabel)
        
        menu.appendChild(menuBtn)
        menu.appendChild(menuList)

        return menu
    }
}

// Fill the label menu with the standard menu
const fillLabelMenu = (menuList, label) => {
    debugger
    menuList.innerHTML = ''
    const setColorEl = document.createElement('li')
    // const divEl = document.createElement('div')
    // divEl.classList.add('menu__color')
    // divEl.style.backgroundColor = label.color
    // debugger
    // const spanEl = document.createElement('span')
    // spanEl.textContent = 'nig'
    setColorEl.innerHTML = `<div class = "menu__color" style = "background-color: ${globalCurrentLabel.color};"></div><span>Set color</span>`
    // console.log(typeof label.color)
    // setColorEl.appendChild(divEl)
    // setColorEl.appendChild(spanEl)

    // Event listener to change menu when set color is clicked
    setColorEl.addEventListener('click', e => {
        menuList.innerHTML = ''

        const backBtn = document.createElement('button')
        backBtn.innerHTML = '<svg class="icon icon--back"><use xlink:href="/img/icons.svg#icon-back-arrow"></use></svg>'
        
        // Move back to previous menu when clicked
        backBtn.addEventListener('click', e => {
            menuList.innerHTML = ''
            fillLabelMenu(menuList, globalCurrentLabel)
        })
        
        const setColorEl = document.createElement('li')
        setColorEl.classList.add('menu__set-color')
        const colorDiv = document.createElement('div')
        colorDiv.classList.add('menu__color')
        colorDiv.style.backgroundColor = globalCurrentLabel.color

        const spanEl = document.createElement('span')
        spanEl.textContent = 'Set color'

        setColorEl.appendChild(backBtn)
        setColorEl.appendChild(colorDiv)
        setColorEl.appendChild(spanEl)
        
        const colorsEl = document.createElement('li')
        colorsEl.classList.add('change-color-container')

        // Loop through label colors and render them
        labelColors.forEach(color => {
            const labelColorsEl = document.createElement('div')
            labelColorsEl.classList.add('menu__color')
            labelColorsEl.style.backgroundColor = color
            colorsEl.appendChild(labelColorsEl)
            
            // Change the selected label's color when new color is clicked
            labelColorsEl.addEventListener('click', e => {
                globalCurrentLabel.color = color
                saveLabels(labels)
                renderLabels(labels)
                saveTodos(todos)
                renderTodos(todos, filters)
                fillEditModule(currentTodo)
            })
        })
        
        menuList.appendChild(setColorEl)
        menuList.appendChild(colorsEl)
    })

    const deleteLabelEl = document.createElement('li')
    deleteLabelEl.textContent = 'Delete label'

    deleteLabelEl.addEventListener('click', e=> {
        const ind = labels.findIndex(el => el === globalCurrentLabel)
        deleteLabel(labels, ind)
        saveLabels(labels)
        console.log(labels)
        renderLabels(labels)
    })

    menuList.appendChild(setColorEl)
    menuList.appendChild(deleteLabelEl)
}

// Delete label
const deleteLabel = (labels, index) => {
    
    // Remove label from todos that have that label
    todos.forEach(todo => {
        // If the todo has a label
        if (todo.label.length > 0) {
            // Check to see if it has the deleted label
            const labelIndex = todo.label.findIndex(lab => lab.id === labels[index].id)
            if (labelIndex > -1) {
                todo.label.splice(labelIndex, 1)
            }
            saveTodos(todos)
            renderTodos(todos, filters)
            fillEditModule(currentTodo)
        }
    })

    labels.splice(index, 1)
}

// Render all created labels
const renderLabels = labels => {
    // Check any labels have been created
    if (labels.length > 0) {
        sidebarLabels.innerHTML = ''
        // const ul = document.createElement('ul')

        labels.forEach((label) => {
            const labelEl = document.createElement('li')
            labelEl.classList.add('sidebar__label')
            
            labelEl.appendChild(label.generateBulletDom())
            labelEl.appendChild(label.generateTextDom())
            labelEl.appendChild(label.generateMenuDom())
            sidebarLabels.appendChild(labelEl)
        })
    } else {
        sidebarLabels.innerHTML = '<p>Create labels to organize your tasks</p>'
    }
}

const getSavedLabels = () => {
    try {
        if (localStorage.getItem('labels')) {
            const labels = JSON.parse(localStorage.getItem('labels'))

            // Re-create the prototype chain for each label object
            labels.forEach(label => {
                Object.setPrototypeOf(label, Label.prototype)
            })
            return labels
        } else {
            return []
        }
    } catch(e) {
        return []
    }
}

const saveLabels = labels => {
    localStorage.setItem('labels', JSON.stringify(labels))
}

// Focus and select all text on element
const highlight = el => {
    // If the element isn't contenteditable, we can use select()
    if (el.contentEditable != 'true') {
        el.focus()
        el.select()
        console.log(el.contentEditable)
    } else {
        // If it is contenteditabl, special code needed to select the text
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        console.log(el.contentEditable)

    }
}

// Add new label and highlight it when button clicked
createLabelBtn.addEventListener('click', e => {
    // const length = labels.length
    labels.push(new Label())
    saveLabels(labels)
    renderLabels(labels)

    // Highlight newly created label
    const arr = document.querySelectorAll('.sidebar__label-name')
    highlight(arr[arr.length-1])
})