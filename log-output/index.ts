import * as uuid from 'uuid'
import axios from 'axios'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const string = uuid.v7();

const PORT = process.env.PORT || 3001
const pingPongUrl = process.env.PING_PONG_URL || 'http://localhost:3000'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fileLocation = path.join(__dirname, 'config', 'information.txt')
const getFileContents = () => {
    if (!fs.existsSync(fileLocation)) return 'No information available!'

    const fileContents = fs.readFileSync(fileLocation)
    return `file content: ${fileContents}`
}

const getMessage = () => {
    return `env variable: MESSAGE=${process.env.MESSAGE || 'undefined'}`
}

const getStatus = () => {
    const timeStampDate = new Date(Date.now())

    return `${timeStampDate.toUTCString()}: ${string}`
}

const getPingPongs = async () => {
    const pingPongs = await axios.get(`${pingPongUrl}/pings`)
    return `Ping / Pongs: ${pingPongs.data}`
}

const app = express()

app.get('/log', async (req, res) => {
    res.send(`${getFileContents()} <br/> ${getMessage()} <br/> ${getStatus()} <br/> ${await getPingPongs()}`)
})

app.listen(PORT, () => {
    console.log('Logger running on port', PORT)
})