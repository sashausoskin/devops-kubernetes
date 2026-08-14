import * as uuid from 'uuid'
import path from 'path'
import fs from 'fs'

const string = uuid.v7();

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'log.txt')

const writeToFile = (contents: string) => {
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, {recursive: true})
  fs.writeFileSync(filePath, contents)
}

const getStatus = () => {
    const timeStampDate = new Date(Date.now())

    return `${timeStampDate.toUTCString()}: ${string}`
}

setInterval(() => {
    writeToFile(getStatus())
}, 5000)

console.log('Started logger')