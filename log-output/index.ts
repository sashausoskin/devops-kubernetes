import * as uuid from 'uuid'
import path from 'path'
import fs from 'fs'
import express from 'express'

const string = uuid.v7();

const PORT = process.env.PORT || 3001

const directory = path.join('/', 'usr', 'src', 'app', 'pingpong')
const filePath = path.join(directory, 'counter.txt')

const getStatus = () => {
    const timeStampDate = new Date(Date.now())

    return `${timeStampDate.toUTCString()}: ${string}`
}

const getPingPongs = () => {
    const counter = fs.existsSync(filePath)
        ? fs.readFileSync(filePath)
        : '-1'
    
    return `Ping / Pongs: ${counter}`
}

const app = express()

app.get('/', (req, res) => {
    res.send(`${getStatus()} <br/> ${getPingPongs()}`)
})

app.listen(PORT, () => {
    console.log('Logger running on port', PORT)
})