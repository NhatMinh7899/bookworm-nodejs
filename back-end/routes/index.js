var express = require('express');
var router = express.Router();
const books = require('../models/books')

const Book = require('../controller/BookController')
const Product = require('../controller/ProductController')
const Author = require('../controller/AuthorController')
const Categories = require('../controller/CategoryController')
const Order = require('../controller/OrderController')



/* GET home page. */


router.post('/ordering', Order.orderCartShop);

router.get('/book/:id', Product.findOne);

router.get('/categories', Categories.allCategory);

router.get('/authors', Author.allAuthor);


module.exports = router;
