const fs = require('fs');
const csv = require('csv-parser');
const db = require('./db/db.js');

var characteristicReviews = __dirname + '/../../../DATA/characteristic_reviews-19.csv';

const etlCharacteristicReviews = () => {
  const readable = fs.createReadStream(characteristicReviews);
  readable
  .pipe(csv({}))
  .on('data', async (data) => {
    let transformedData = [Number(data.id), Number(data.characteristic_id), Number(data.review_id), Number(data.value)];
    await db.insertIntoCharacteristicsReviews(transformedData);
  })
  .on('data', () => {
    readable.pause();
    setTimeout(() => {
      // console.log('Now data starts flowing again.');
      readable.resume();
    }, 1000);
  })
  .on('end', () => {
    console.log('INSERTED ALL CHARACTERISTICS REVIEWS INTO PHOTOS!!!!!!!!!!!!');
  });
}

etlCharacteristicReviews();