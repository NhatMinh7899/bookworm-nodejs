const Book = require("../models/books");
const discounts = require("../models/discounts");
const reviews = require("../models/reviews");
const author = require("../models/authors");
const categories = require("../models/categories");
const { Sequelize, Op } = require("sequelize");
const sequelize = require("../config/db");

// Create and Save a new Tutorial

// Retrieve all Tutorials from the database.

// Update a Tutorial by the id in the request
exports.getTop8Population = (req, res) => {
  Book.findAll({
    attributes: {
      include: [
        [
          sequelize.fn("COUNT", sequelize.col("reviews.book_id")),
          "count_reviews",
        ],
        [
          sequelize.fn(
            "COALESCE",
            sequelize.col("discount.discount_price"),
            sequelize.col("books.book_price")
          ),
          "final_price",
        ],
        // [
        //   sequelize.literal(`(select author_name from authors
        //                 where author.id = books.author_id 
        //             )`), 'author_name'
        // ]
      ],
    },
    include: [
      {model: author, attributes: ["author_name"], required: true},
      { model: reviews, attributes: [], required: true },
      {
        model: discounts,
        attributes: [
          "discount_price"
        ],
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: {
                    [Op.gte]: new Date(),
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: null,
                },
              ],
            },
          ],
        },
        required: false,
      },
    ],
    group: ["books.id", "reviews.book_id", "discount.id","author.author_name"],
    raw: true,
    order: [
      [sequelize.col("count_reviews"), "DESC"],
      ["book_price", "ASC"],
    ],
    limit: 8,
    subQuery:false
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Lỗi get popular rồi",
      });
    });
};

// Delete all Tutorials from the database.
exports.getTop8Recommended = (req, res) => {
  Book.findAll({
    attributes: {
      include: [
        [
          sequelize.fn(
            "AVG",
            sequelize.cast(sequelize.col("reviews.rating_start"), "float")
          ),
          "average_start",
        ],
        [
          sequelize.fn(
            "COALESCE",
            sequelize.col("discount.discount_price"),
            sequelize.col("books.book_price")
          ),
          "final_price",
        ],
      ],
    },
    include: [
      { model: reviews, attributes: [], required: true },
      {model: author, attributes: ["author_name"], required: true},
      {
        model: discounts,
        attributes: [
          "discount_price",
        ],
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: {
                    [Op.gte]: new Date(),
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: null,
                },
              ],
            },
          ],
        },
        required: false,
      },
    
    ],

    distinct:true,
    group: ["books.id", "reviews.book_id","discount.id","author.id"],
    order: [
      [sequelize.col("average_start"), "DESC"],
      ["book_price", "DESC"],
    ],
    limit: 8,
    subQuery:false,
  })
    .then((data) => {
      console.log("get dc r nhe");
      // const { rows: dataItems } = data;
      // const totalItems = data.count.length;
      res.send(data);
    })
    .catch((err) => {
      console.log("loggg lỗi");
      res.status(500).send({
        message: err.message || "Lỗi get recommend rồi",
      });
    });
};

// Find all published Tutorials
exports.getTop8OnSale = (req, res) => {
  //let condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
  Book.findAll({
    include: [
      {model: author, attributes: ["author_name"], required: true},
      {
      model: discounts,
      attributes: ["discount_start_date", "discount_end_date"],
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              {
                discount_start_date: {
                  [Op.lte]: new Date(),
                },
              },
              
              {
                discount_end_date: {
                  [Op.gte]: new Date(),
                },
              },
            ],
          },
          {
            [Op.and]: [
              {
                discount_start_date: {
                  [Op.lte]: new Date(),
                },
              },
              {
                discount_end_date: null,
              },
            ],
          },
        ],
      },
      required: true,
    }],
    attributes: {
      include: [
        [
          sequelize.literal(`(select (books.book_price - discounts.discount_price)
                  from discounts
                  where discounts.book_id = books.id
              )`),
          "sub_price",
        ],
        //[discounts.sequelize.fn('COALESCE', sequelize.col('discounts.discount_price'), sequelize.col('books.book_price')), 'final_price',]
        [
          sequelize.literal(`(select COALESCE(discounts.discount_price,books.book_price)
              from discounts
              where discounts.book_id = books.id
              )`),
          "final_price",
        ],
      ],
    },
    order: [
      [sequelize.literal("sub_price"), "DESC"],
      ["book_price", "ASC"],
    ],
    limit: 10,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Lỗi get rồi",
      });
    });
  //console.log(books);
};
