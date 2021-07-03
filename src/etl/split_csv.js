const csvSplitStream = require('csv-split-stream');
const fs = require('fs');

var characteristicReviews = __dirname + '/../../../DATA/characteristic_reviews.csv';

return csvSplitStream.split(
  fs.createReadStream(characteristicReviews),
  {
    lineLimit: 1000000
  },
  (index) => fs.createWriteStream(__dirname + `/../../../DATA/characteristic_reviews-${index}.csv`)
)
.then(csvSplitResponse => {
  console.log('csvSplitStream succeeded.', csvSplitResponse);
  // outputs: {
  //  "totalChunks": 350,
  //  "options": {
  //    "delimiter": "\n",
  //    "lineLimit": "10000"
  //  }
  // }
}).catch(csvSplitError => {
  console.log('csvSplitStream failed!', csvSplitError);
});