import express from 'express'

const app = express()
let counter = -1
const PORT = 3000

app.get('/pingpong', (req, res) => {
    counter++
    return res.send(`pong ${counter}`)
})

console.log('Listening on port', PORT)
app.listen(PORT)