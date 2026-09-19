import * as uuid from 'uuid'
import axios from 'axios'
import express from 'express'

const string = uuid.v7();

const PORT = process.env.PORT || 3001
const pingPongUrl = process.env.PING_PONG_URL || 'http://localhost:3000'

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
    res.send(`${getStatus()} <br/> ${await getPingPongs()}`)
})

app.listen(PORT, () => {
    console.log('Logger running on port', PORT)
})