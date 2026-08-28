import express from 'express'
import fs from 'node:fs'
import path from 'node:path'

const directory = path.join('/', 'usr', 'src', 'app', 'pingpong')
const filePath = path.join(directory, 'counter.txt')

const app = express()
let counter = fs.existsSync(filePath)
    ? Number(fs.readFileSync(filePath))
    : -1
    
const PORT = 3000



app.get('/pingpong', (req, res) => {
    counter++
    
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(directory, {recursive: true})
    }
    fs.writeFileSync(filePath, counter.toString())
    return res.send(`pong ${counter}`)
})

console.log('Listening on port', PORT)
app.listen(PORT)