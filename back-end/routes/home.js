var express = require('express');
var router = express.Router();
const books = require('../models/books')

const Book = require('../controller/BookController')
const Shop = require('../controller/ShopController')


router.get('/top8onsale', Book.getTop8OnSale);
router.get('/top8popular', Book.getTop8Population);
router.get('/top8recommend', Book.getTop8Recommended);


module.exports = router;