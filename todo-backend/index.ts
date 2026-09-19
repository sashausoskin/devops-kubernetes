import express from 'express'
import cors from 'cors'

let todos: string[] = []

const PORT = process.env.PORT || 3003

const app = express()

app.use(cors())
app.use(express.json())

app.get('/todos', (req, res) => {
    return res.json(todos)
})

app.post('/todos', (req, res) => {
    const todo = req.body.todo

    if (Array.isArray(todo) || typeof todo === 'object' || todo === null) {
        return res.status(400).send('Make sure to only send a single string to add.')
    }

    todos.push(todo)
    return res.status(200).json(todo)
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})