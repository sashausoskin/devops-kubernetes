import express from 'express'
import path from 'node:path'
import fs from 'fs'
import axios from 'axios'

const PORT = process.env.PORT || 3002

const fileDirectory = path.join('/', 'usr', 'src', 'app', 'image')
const filePath = path.join(fileDirectory, 'image.jpg')

const cacheTimeout = 10 * 60_000

const getImage = async () => {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath)
    }
    await updateImage()
    await getImage()
}

const checkForImageUpdate = async () => {
    if (!fs.existsSync(filePath)) {
        await updateImage()
    }

    const cachedImageStats = fs.statSync(filePath)
    if (Date.now() - cachedImageStats.mtimeMs > cacheTimeout) {
        await updateImage()
    }
}

const updateImage = async () => {
    if (!fs.existsSync(fileDirectory)) {
        fs.mkdirSync(fileDirectory, {recursive: true})
    }
    const response = await axios.get('https://picsum.photos/1200', { responseType: 'stream' })
    response.data.pipe(fs.createWriteStream(filePath))
}

const app = express()

app.get('/image', async (req, res) => {
    const image = await getImage()
    await checkForImageUpdate()
    res.set('Content-Type', 'image/jpeg')
    res.send(image)
})

app.listen(PORT, () => {
    console.log('Image service running on port', PORT)
})