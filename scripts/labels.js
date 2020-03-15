const sidebar = document.querySelector('.sidebar__body')
const sidebarLabels = document.querySelector('.sidebar__labels')
const createLabelBtn = document.querySelector('.btn--create-label')

// Render all created labels
const renderLabels = labels => {
    // Check any labels have been created
    if (labels.length > 0) {
        sidebarLabels.innerHTML = ''
        // const ul = document.createElement('ul')

        labels.forEach(label => {
            const labelEl = document.createElement('li')
            labelEl.classList.add('sidebar__label')

            // Save changes when label is renamed
            labelEl.addEventListener('input', e => {
                label.name = labelEl.textContent
                saveLabels(labels)
            })

            // Don't start new line if user presses enter when editing
            labelEl.addEventListener('keydown', e => {
                // If user presses enter
                if (e.keyCode === 13) {
                    // Unfocus
                    labelEl.blur()
                    // Clear highlighted text
                    window.getSelection().removeAllRanges()
                }
            })

            labelEl.contentEditable = 'true'
            labelEl.textContent = label.name
    
            // ul.appendChild(labelEl)
            sidebarLabels.appendChild(labelEl)
        })
    }
}

const getSavedLabels = () => {
    return  localStorage.getItem('labels') ? JSON.parse(localStorage.getItem('labels')) : []
}

const saveLabels = labels => {
    localStorage.setItem('labels', JSON.stringify(labels))
}

// Focus and selct all text on element
const highlight = el => {
    // If the element isn't contenteditable, we can use select()
    if (el.contentEditable != 'true') {
        el.focus()
        el.select()
        console.log(el.contentEditable)
    } else {
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
    labels.push({
        name: `Label ${length > 0 ? length + 1 : ''}`,
        color: '#000'
    })
    saveLabels(labels)
    renderLabels(labels)

    // Highlight newly created label
    const arr = document.querySelectorAll('.sidebar__label')
    highlight(arr[arr.length-1])
})