import express from 'express'
import cors from 'cors'
import { Client, Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3003
const MAX_LENGTH = Number(process.env.MAX_TODO_LENGTH) || 140

const dbPool = await new Pool({connectionString: process.env.POSTGRES_URL}).connect()

const app = express()

app.use(cors())
app.use(express.json())

const initDb = async () => {
    await dbPool.query(
        `
        CREATE TABLE IF NOT EXISTS todos (ID SERIAL PRIMARY KEY, todo VARCHAR(140), done BOOLEAN);
        ALTER TABLE todos ADD COLUMN IF NOT EXISTS id SERIAL PRIMARY KEY;
        ALTER TABLE todos ADD COLUMN IF NOT EXISTS done BOOLEAN DEFAULT false;
        `
    )
}

const getTodos = async () => {
    const res = await dbPool.query('SELECT id, todo, done FROM todos;')
    return res.rows
}

const addTodo = async (todo: string) => {
    const res = await dbPool.query('INSERT INTO todos (todo, done) VALUES ($1::text, false) RETURNING id, todo, done;', [todo])
    return res.rows[0]
}

const markTodoAsDone = async (id: string) => {
    await dbPool.query('UPDATE todos SET done = true WHERE id=$1::int', [id])
}

app.get('/todos', async (req, res) => {
    return res.json(await getTodos())
})

app.post('/todos', async (req, res) => {
    const todo: string = req.body.todo

    if (Array.isArray(todo) || typeof todo === 'object' || todo === null) {
        return res.status(400).send('Make sure to only send a single string to add.')
    }

    console.log('Adding a todo:', todo)

    if (todo.length > MAX_LENGTH) {
        console.error('ERROR: todo is too long')
        return res.status(413).send(`The maximum length of a todo is ${MAX_LENGTH} characters`)
    }

    const result = await addTodo(todo)
    return res.status(200).json(result)
})

app.put('/todos/:id', async (req, res) => {
    await markTodoAsDone(req.params.id)
    res.sendStatus(200)
})

app.get('/', (req, res) => {
    return res.send("Welcome to the Todos backend API!")
})

let isHealthy = true

app.get('/healthz', async (req, res) => {
    if (!isHealthy) return res.sendStatus(500)

    try {
        await dbPool.query('SELECT 1 FROM todos LIMIT 1;')
        return res.sendStatus(200)
    } catch (e) {
        console.error('The DB connection failed', e)
        return res.sendStatus(500)
    }
})

app.post('/healthz/break', async (req, res) => {
    isHealthy = false

    return res.sendStatus(200)
})

app.listen(PORT, async () => {
    console.log(`App listening on port ${PORT}`)
    await initDb()
})