import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config()

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});