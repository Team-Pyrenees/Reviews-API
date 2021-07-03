# Review-API
A REST API micro-service which provides an API to the Atelier e-Commerce application. The service queries an SQL database. The database and the server have been optimized to look-thourgh 20mil+ items of data and  transform it in a way in which it is digestable for a front-end application that has already been designed and built.

This service makes use of caching by implementing Redis. The caching takes into account data-integrity and only caches when it is possible to sacrifice speed for integrity.

# Endpoints

## GET /reviews
Retrieves a list of reviews for the specified product.

Parameter | Type | Description
-------|------|------------
page | integer | Selects the page of results to return. Default 1.
count | integer | Specifies how many results per page to return. Default 5.
sort | 	text | Changes the sort order of reviews to be based on "newest", "helpful", or "relevant".
product_id | 	integer | Specifies the product for which to retrieve reviews.



RESPONSE
> Response: Status 200 OK
```json
{
  "product": "2",
  "page": 0,
  "count": 5,
  "results": [
    {
      "review_id": 5,
      "rating": 3,
      "summary": "I'm enjoying wearing these shades",
      "recommend": false,
      "response": null,
      "body": "Comfortable and practical.",
      "date": "2019-04-14T00:00:00.000Z",
      "reviewer_name": "shortandsweeet",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/review_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/review_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    {
      "review_id": 3,
      "rating": 4,
      "summary": "I am liking these glasses",
      "recommend": false,
      "response": "Glad you're enjoying the product!",
      "body": "They are very dark. But that's good because I'm in very sunny spots",
      "date": "2019-06-23T00:00:00.000Z",
      "reviewer_name": "bigbrotherbenjamin",
      "helpfulness": 5,
      "photos": [],
    },
    // ...
  ]
}
```

## GET /reviews/meta
Retrieves meta data for a product.

Parameter | Type | Description
-------|------|------------
page | integer | Selects the page of results to return. Default 1.

RESPONSE
> Response: Status 200 OK
```json
{
    "product_id": "11004",
    "ratings": {
        "2": 1,
        "3": 1,
        "4": 14
    },
    "recommended": {
        "0": 11,
        "1": 5
    },
    "Fit": {
        "id": 36720,
        "value": 2.3
    },
    "Length": {
        "id": 36721,
        "value": 2.7
    },
    "Comfort": {
        "id": 36722,
        "value": 4.4
    },
    "Quality": {
        "id": 36723,
        "value": 3.8
    }
}
```

## POST /reviews
Add's a review to the list of reviews.

Parameter | Type | Description
-------|------|------------
product_id | integer | Required ID of the product to post the review for
rating | integer | Integer (1-5) indicating the review rating
summary | text | Summary text of the review
body | text | Continued or full text of the review
recommend | bool | Value indicating if the reviewer recommends the product
name | text | Username for question asker
email | text | Email address for question asker
photos | [text] | Array of text urls that link to images to be shown
characteristics | object | Object of keys representing characteristic_id and values representing the review value for that characteristic. { "14": 5, "15": 5 //...}

RESPONSE
> Response: Status 201 CREATED

## PUT /reviews/:review_id/helpful
Updates a review and adds to the helpful counter

Parameter | Type | Description
-------|------|------------
reveiw_id | integer | Required ID of the review to update

RESPONSE
> Response: Status 204 NO CONTENT

## PUT /reviews/:review_id/report
Reports a review so that the next time get is called on the product, the review will not show up.

Parameter | Type | Description
-------|------|------------
reveiw_id | integer | Required ID of the review to update

RESPONSE
> Response: Status 204 NO CONTENT