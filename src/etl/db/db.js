const mysql = require('mysql2/promise');
const bluebird = require('bluebird');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'chillara',
  database: 'sdcTest',
  connectionLimit: 5
});

module.exports.insertIntoPhotos = (array) => {
  return pool.query(`INSERT INTO PHOTOS (id, review_id, url) VALUES (?, ?, ?)`, array);
}

module.exports.insertIntoCharacteristics = (array) => {
  return pool.query('INSERT INTO characteristics (id, product_id, name) VALUES (?, ?, ?)', array);
}

module.exports.insertIntoCharacteristicsReviews = (array) => {
  return pool.query('INSERT INTO characteristics_reviews (id, characteristic_id, review_id, value) VALUES (?, ?, ?, ?)', array);
}

module.exports.insertIntoReviews = (array) => {
  return pool.query(
    'INSERT INTO REVIEWS'
  + '(id, product_id, rating, date, summary, body, recommend,'
  + 'reported, reviewer_name, reviewer_email, response, helpfullness) '
  + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', array);
}