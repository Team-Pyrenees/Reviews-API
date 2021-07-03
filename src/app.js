const express = require('express');
const app = express();
const port = 3000;
const db = require('./db/db_reviews.js');
const helper = require('./helperFunctions.js');
const bluebird = require('bluebird');
const Redis = require('redis');

const client = Redis.createClient();
const DEFAULT_EXPIRATION = 1000;

//middle-ware
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/loaderio-172f94df54e213e9ecca52bcc19c1165', (req, res) => {
  try {
    res.statusCode = 200;
    res.send('loaderio-172f94df54e213e9ecca52bcc19c1165');
  } catch(err) {
    res.statusCode = 404;
    res.send(err);
  }
});


//get reviews
app.get('/reviews', async (req, res) => {
  const params = req.query;
  let sort = 'id';
  //determine sort
  if (params.sort === 'helpful') {sort = 'helpfullness';} else if (params.sort === 'relevant') {sort = 'recommend';}

  //get photo data..
  const photos = await db.getPhotos(Number(params.product_id));
  //parse through it and associate it by key value pairs
  const photosData = {};
  photos[0].forEach((photo) => {
    if (photosData[photo.id] === undefined) {
      photosData[photo.id] = [];
    }
    if (photo.url) {
      photosData[photo.id].push(photo.url);
    }
  })
  //initial data
  const data = {
    product: params.product_id,
    page: 0,
    count: params.count,
  };
  //get reviews!!
  const reviews = await db.getNReviews(Number(params.product_id), Number(params.count), sort);
  const resultsArray = reviews[0].map((row) => {
    return {
      review_id: row.id,
      rating: row.rating,
      summary: row.summary,
      recommend: row.recommend,
      response: row.response,
      body: row.body,
      date: row.date,
      reviewer_name: row.reviewer_name,
      helpfulness: row.helpfullness,
      photos: photosData[row.id]
    }
  });
  data.results = resultsArray;
  res.statusCode = 200;
  res.send(data);
});

//get meta reviews
app.get('/reviews/meta', async (req, res) => {
  try {
    const params = req.query;

    client.get(params.product_id, async (err, metaData) => {
      if (err) {
        console.log(err);
        res.statusCode = 500;
        res.send(err);
      }
      if (metaData !== null) {
        res.statusCode = 200;
        return res.json(JSON.parse(metaData));
      } else {
        data = {
          product_id: params.product_id,
          ratings: {},
          recommended: {0:0, 1:0}
        };
        const characteristics = await db.getCharacteristics(params.product_id);
        characteristics[0].forEach((row) => {
          if (data[row.name] === undefined) {
            data[row.name] = {
              id: row.id,
              value: row.value
            };
          } else {
            let current = data[row.name].value;
            data[row.name].value = (current + row.value) / 2;
          }
        })
        const reviews = await db.getAllReviews(Number(params.product_id));
        reviews[0].forEach((row) => {
          if (row.recommend === 1) {
            data.recommended['1'] += 1;
          } else {
            data.recommended['0'] += 1;
          }
          if (!(data.ratings[row.rating])) {
            data.ratings[row.rating] = 1;
          } else {
            data.ratings[row.rating] += 1;
          }
        })
        client.setex(params.product_id, 1000, JSON.stringify(data));
        res.statusCode = 200;
        res.send(data);
      }
    });
  } catch(err) {
    res.statusCode = 404;
    res.send(err);
  }
});

//write to database
app.post('/reviews', async (req, res) => {
  try {
    const body = req.body;
    const array = [
      Number(body.product_id),
      Number(body.rating),
      helper.generateDate(),
      body.summary,
      body.body,
      ((body.recommend === 'true') ? 1 : 0),
      1,
      body.name,
      body.email,
      null,
      0
    ]
    await db.addAReview(array);
    const lastInsertIdRow = await db.lastInsertId();
    const lastInsertId = lastInsertIdRow[0][0].s;
    //add photos
    body.photos.forEach(async (photo) => {
      await db.addAPhoto([lastInsertId, photo]);
    })
    //add characteristics
    const characteristicIds = Object.keys(body.characteristics);
    const characteristicValues = Object.values(body.characteristics);

    for (let i = 0; i < characteristicIds.length; i++) {
      await db.addACharacteristicsReviews([Number(characteristicIds[i]), Number(lastInsertId), Number(characteristicValues[i])]);
    }
    res.statusCode = 200;
    res.send('review added!!');
  } catch(err) {
    res.statusCode = 404;
    res.send(err);
  }
});

app.put('/reviews/:review_id/report', async (req, res) => {
  try {
    const id = req.params.review_id;
    db.reportAReview(id);
    res.statusCode = 200;
    res.send('reported review!');
  } catch(err) {
    res.statusCode = 404;
    res.send(err);
  }
});

app.put('/reviews/:review_id/helpful', async (req, res) => {
  try {
    const id = req.params.review_id;
    db.incrementHelpfulness(id);
    res.statusCode = 200;
    res.send('incremented!');
  } catch(err) {
    res.statusCode = 404;
    res.send(err);
  }
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
});