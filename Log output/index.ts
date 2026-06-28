import * as uuid from 'uuid';

const string = uuid.v7();

setInterval(() => {
    const timeStampDate = new Date(Date.now())

    console.log(`${timeStampDate.toUTCString()}: ${string}`)
}, 5000)