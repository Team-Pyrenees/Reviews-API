const fs = require('fs');
const csv = require('csv-parser');
const db = require('./db/db.js');

var characteristics = __dirname + '/../../../DATA/characteristics.csv';

const etlCharacteristics = () => {
  const readable = fs.createReadStream(characteristics);
  readable
  .pipe(csv({}))
  .on('data', async (data) => {
    let transformedData = [Number(data.id), Number(data.product_id), data.name];
    await db.insertIntoCharacteristics(transformedData);
  })
  .on('data', () => {
    readable.pause();
    setTimeout(() => {
      readable.resume();
    }, 8000);
  })
  .on('end', () => {
    console.log('INSERTED ALL CHARACTERISTICS!!!!!!!!!!!!');
  });
}

etlCharacteristics();