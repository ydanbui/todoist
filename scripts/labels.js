const sidebar = document.querySelector('.sidebar__body')
const sidebarLabels = document.querySelector('.sidebar__labels')
const createLabelBtn = document.querySelector('.btn--create-label')

// Generate the label bullet point
const generateLabelBullet = (label) => {
    const bullet = document.createElement('div')
    bullet.classList.add('sidebar__bullet')
    bullet.style.backgroundColor = `${label.color}`

    return bullet
}

const generateLabelText = label => {
    const labelText = document.createElement('div')
    labelText.classList.add('sidebar__label-name')

    // Save changes when label is renamed
    labelText.addEventListener('input', e => {
        label.name = labelText.textContent
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
    labelText.textContent = label.name

    return labelText
}

// Render all created labels
const renderLabels = labels => {
    // Check any labels have been created
    if (labels.length > 0) {
        sidebarLabels.innerHTML = ''
        // const ul = document.createElement('ul')

        labels.forEach(label => {
            const labelEl = document.createElement('li')
            labelEl.classList.add('sidebar__label')
            
            labelEl.appendChild(generateLabelBullet(label))
            labelEl.appendChild(generateLabelText(label))
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
    labels.push({
        name: `Label ${length > 0 ? length + 1 : ''}`,
        color: '#FFF'
    })
    saveLabels(labels)
    renderLabels(labels)

    // Highlight newly created label
    const arr = document.querySelectorAll('.sidebar__label-name')
    highlight(arr[arr.length-1])
})