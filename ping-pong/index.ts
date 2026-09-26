import express from 'express'
import fs from 'node:fs'
import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
    
const PORT = process.env.PORT || 3000

const dbClient = await new Client({connectionString: process.env.POSTGRES_URL}).connect()

const initDb = async () => {
    await dbClient.query('CREATE TABLE IF NOT EXISTS counter (counter INT);')
}

const incrementCounter = async (currentCounter: number) => {
    await dbClient.query('DELETE FROM counter *')
    await dbClient.query('INSERT INTO counter (counter) VALUES ($1::int)', [currentCounter + 1])
}

const getCounter = async () => {
    const res = await dbClient.query('SELECT counter FROM counter')

    if (res.rowCount === 0) return 0

    return res.rows[0].counter
}

app.get('/pingpong', async (req, res) => {
    const counter = await getCounter()
    await incrementCounter(counter)
    return res.send(`pong ${counter}`)
})

app.get('/pings', async (req, res) => {
    return res.send(await getCounter())
})

app.listen(PORT, async () => {
    console.log('Listening on port', PORT)
    await initDb();
})