import * as uuid from 'uuid'
import express from 'express'

const string = uuid.v7();

const getStatus = () => {
    const timeStampDate = new Date(Date.now())

    return `${timeStampDate.toUTCString()}: ${string}`
}

setInterval(() => {
    console.log(getStatus())
}, 5000)


const app = express()
const port = 3000

app.get('/status', (req, res) => {
  res.send(getStatus())
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})