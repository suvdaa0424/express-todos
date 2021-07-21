const http = require('http');
const express = require('express');
const db = require('./model/db')

const hostname = '127.0.0.1';
const port = 3000;

// set up server
const app = express();
const server = http.createServer(app)

let id = 6;

// include middleware

app.use(express.static('./public'));
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

// get all Todos
app.get('/api/v1/todos', (req, res) => {
    res.json(db.todos)
})
// Create new Todo
app.post('/api/v1/todos', (req, res) => {
    if (!req.body || !req.body.text) {
        // respond with an error
        res.status(422).json({
            error: "must include todo text"
        })
        return
    }
    const newTodo = {
        id: id++,
        text: req.body.text,
        completed: false
    }
    db.todos.push(newTodo)
    res.status(201).json(newTodo)
})

// Update existing todo by id
app.patch('/api/v1/todos/:id', (req, res) => {
    // get the id from the route
    const id = parseInt(req.params.id)
    // find the existing todo
    const todoIndex = db.todos.findIndex((todo) => {
        return todo.id === id
    })
    if (todoIndex === -1) {
        res.status(404).json({ error: 'could not find todo with that id '})
        return
    }
    // update the todo
    if (req.body && req.body.text) {
        db.todos[todoIndex].text = req.body.text
    }
    if (req.body && req.body.completed !== undefined) {
    db.todos[todoIndex].completed = req.body.completed
    }
    // respond with updated item
    res.json(db.todos[todoIndex])
})

// Delete existing todo by id
app.delete('/api/v1/todos/:id', (req, res) => {
    // get the id
    const id = parseInt(req.params.id)
    // find the existing todo
    const todoIndex = db.todos.findIndex((todo) => {
        return todo.id === id
    })
    // if we could not find the todo with that id
    if (todoIndex === -1) {
        res.status(404).json({ error: 'could not find todo with that id '})
        return
    }
    // delete the todo
    db.todos.splice(todoIndex, 1)
    
    // alternatively save
    // db.todos = db.todos.filter((todo) => {
    //     return todo.id !== id
    // })
    // respond with 204 and empty response
    res.status(204).json()
})



// listen for requests
server.listen(port, hostname, () => {
    console.log(`Server Running at http://${hostname}:${port}`);
})