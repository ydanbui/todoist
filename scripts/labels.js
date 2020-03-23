'use strict'

const sidebar = document.querySelector('.sidebar__body')
const sidebarLabels = document.querySelector('.sidebar__labels')
const createLabelBtn = document.querySelector('.btn--create-label')

class Label {
    constructor(numLabels) {
        this.name = `Label ${numLabels > 0 ? numLabels + 1 : ''}`,
        // Set colors according to labelColors array. Loop through it
        this.color = labelColors[numLabels % 8]
    }

    // Generate the label bullet point
    generateBulletDom() {
        const bullet = document.createElement('div')
        bullet.classList.add('sidebar__bullet')
        bullet.style.backgroundColor = `${this.color}`

        return bullet
    }

    generateTextDom() {
        const labelText = document.createElement('div')
        labelText.classList.add('sidebar__label-name')

        // Save changes when label is renamed
        labelText.addEventListener('input', e => {
            this.name = labelText.textContent
            saveLabels(labels)
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

    generateMenuDom(label) {
        const container = document.createElement('div')
        container.classList.add('menu')

        const btn = document.createElement('button')
        btn.classList.add('menu__btn')
        btn.textContent = '...'

        const ul = document.createElement('ul')
        ul.classList.add('menu__content')
        // ul.innerHTML = '<li>Set color</li><li class = "deleteEl">Delete label</li>'
        
        const setColorEl = document.createElement('li')
        setColorEl.textContent = 'Set color'

        const deleteLabelEl = document.createElement('li')
        deleteLabelEl.textContent = 'Delete label'

        deleteLabelEl.addEventListener('click', e=> {
            const ind = labels.findIndex(el => el === label)
            deleteLabel(labels, ind)
            saveLabels(labels)
            console.log(labels)
            renderLabels(labels)
        })

        ul.appendChild(setColorEl)
        ul.appendChild(deleteLabelEl)
        
        container.appendChild(btn)
        container.appendChild(ul)

        return container
    }
}

const deleteLabel = (labels, index) => {
    labels.splice(index, 1)
}

// Render all created labels
const renderLabels = labels => {
    // Check any labels have been created
    if (labels.length > 0) {
        sidebarLabels.innerHTML = ''
        // const ul = document.createElement('ul')

        labels.forEach((label, index) => {
            const labelEl = document.createElement('li')
            labelEl.classList.add('sidebar__label')
            
            labelEl.appendChild(label.generateBulletDom())
            labelEl.appendChild(label.generateTextDom())
            labelEl.appendChild(label.generateMenuDom(label))
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
    const length = labels.length
    labels.push(new Label(length))
    saveLabels(labels)
    renderLabels(labels)

    // Highlight newly created label
    const arr = document.querySelectorAll('.sidebar__label-name')
    highlight(arr[arr.length-1])
})