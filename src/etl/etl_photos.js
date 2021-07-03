const fs = require('fs');
const csv = require('csv-parser');
const db = require('./db/db.js');

var photos = __dirname + '/../../../DATA/reviews_photos.csv';

const etlPhotos = () => {
  const readable = fs.createReadStream(photos);
  readable
  .pipe(csv({}))
  .on('data', async (data) => {
    let transformedData = [Number(data.id), Number(data.review_id), data.url];
    await db.insertIntoPhotos(transformedData);
  })
  .on('data', () => {
    readable.pause();
    setTimeout(() => {
      readable.resume();
    }, 8000);
  })
  .on('end', () => {
    console.log('INSERTED ALL PHOTOS INTO PHOTOS!!!!!!!!!!!!');
  });
}

etlPhotos();