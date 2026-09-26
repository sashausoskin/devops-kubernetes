import express from 'express'
import cors from 'cors'
import { Client, Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3003

const dbPool = await new Pool({connectionString: process.env.POSTGRES_URL}).connect()

const app = express()

app.use(cors())
app.use(express.json())

const initDb = async () => {
    await dbPool.query('CREATE TABLE IF NOT EXISTS todos (todo VARCHAR(128));')
}

const getTodos = async () => {
    const res = await dbPool.query('SELECT todo FROM todos;')
    return res.rows.map((row) => row.todo)
}

const addTodo = async (todo: string) => {
    dbPool.query('INSERT INTO todos (todo) VALUES ($1::text);', [todo])
}

app.get('/todos', async (req, res) => {
    return res.json(await getTodos())
})

app.post('/todos', (req, res) => {
    const todo = req.body.todo

    if (Array.isArray(todo) || typeof todo === 'object' || todo === null) {
        return res.status(400).send('Make sure to only send a single string to add.')
    }

    addTodo(todo)
    return res.status(200).json(todo)
})

app.listen(PORT, async () => {
    console.log(`App listening on port ${PORT}`)
    await initDb()
})