var express = require('express');
var router = express.Router();
const books = require('../models/books')

const Book = require('../controller/BookController')
const Shop = require('../controller/ShopController')

router.get('/all/:sort', Shop.findAll);

router.get('/onsale', Shop.findAllBookWithOnSale);
router.get('/popular', Shop.findAllBookWithPopular);
router.get('/recommend', Shop.findAllBookWithRecommend);


router.get('/onsale/category/:id', Shop.findOnsaleBookByCategory);
router.get('/popular/category/:id', Shop.findPopularBookByCategory);
router.get('/all/:sort/category/:id', Shop.findCategoryBookWithSort);


router.get('/onsale/author/:id', Shop.findOnsaleBookByAuthor);
router.get('/popular/author/:id', Shop.findPopularBookByAuthor);
router.get('/all/:sort/author/:id', Shop.findAuthorBookWithSort);


router.get('/onsale/stars/:id', Shop.findOnsaleBookByStar);
router.get('/popular/stars/:id', Shop.findPopularBookByStar);
router.get('/all/:sort/star/:id', Shop.findStarBookWithSort);




module.exports = router;