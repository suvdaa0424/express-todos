// const e = require("express")

// const e = require("express")
// display the list on the page and make a line-through the todo when complete
function renderTodos(todosArray) {
    const todosHtmlArray = todosArray.map(todo => {
        return `<li class="${ todo.completed ? 'completed' : 'incomplete'}">
        <input class="edit-field" id="edit-${todo.id}" type="text" value="${todo.text}">
        <button class="update-button" data-id="${todo.id}">🗄</button>
        <button class="completed-button" data-id="${todo.id}"
        data-completed="${ todo.completed ? 'completed' : 'incomplete'}"
        >✅</button>
        <button class="delete-button" data-id="${todo.id}">🗑</button>
        </li>`
    })
    return todosHtmlArray.join('')
}
// grab the api data and display todos
function fetchTodos() {
    fetch('/api/v1/todos')
    .then(res => res.json())
    .then(data => {
        console.log(data)
        todos.innerHTML = renderTodos(data)
    })


}
fetchTodos()
const todos = document.getElementById('todos')
const todoForm = document.getElementById('todoForm')

// fetch('/api/v1/todos')
//     .then(res => res.json())
//     .then(data => {
//         console.log(data)
//         todos.innerHTML = renderTodos(data)
//     })
// add new todo
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const input = document.getElementById('todo_text')
        fetch('/api/v1/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: input.value
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error)
            }
            fetchTodos()
            // user type hiigeed submit darahad husnegtiig reset hiine
            todoForm.reset()
        })
    })
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-button')) {
            // delete behavior
            const id = e.target.dataset.id
            fetch(`/api/v1/todos/${id}`, {
                method: 'DELETE'
            })
                .then(res => !res.ok && res.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error)
                    }
                    fetchTodos()
                })
        }
        if (e.target.classList.contains('completed-button')) {
            const id = e.target.dataset.id
            const completed = e.target.dataset.completed
            
            // delete behavior
            fetch(`/api/v1/todos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    completed: completed === 'completed' ? false : true
                })
            })
                .then(res => !res.ok && res.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error)
                    }
                    fetchTodos()
                })
        }
        if (e.target.classList.contains('update-button')) {
            // get the id
            const id = e.target.dataset.id;
            // get input
            const editField = document.getElementById(`edit-${id}`)
            // get the text from the edit field
            const newValue = editField.value
            // send a PATCH request to /api/v1/todos/{id}
                // then refresh
                fetch(`/api/v1/todos/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: newValue
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.error) {
                            alert(data.error)
                        }
                        fetchTodos()
                    })
        }
    })