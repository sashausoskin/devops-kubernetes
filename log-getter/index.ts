import * as uuid from 'uuid'
import express from 'express'
import path from 'path'
import fs from 'fs'

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'log.txt')

const readFromFile = () => {
  return fs.readFileSync(filePath).toString()
}

const app = express()
const port = 3000

app.get('/status', (req, res) => {
  res.send(readFromFile())
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})