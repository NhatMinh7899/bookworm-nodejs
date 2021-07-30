const Book = require("../models/books");
const discounts = require("../models/discounts");
const reviews = require("../models/reviews");
const author = require("../models/authors");
const categories = require("../models/categories");
const { Sequelize, Op } = require("sequelize");
const sequelize = require("../config/db");

exports.findOne = (req, res) => {
    const id = req.params.id;
    Book.findByPk(id, {
      attributes: {
        include: [
          [
            sequelize.literal(`(select (books.book_price - discounts.discount_price)
                    from discounts
                    where discounts.book_id = books.id
                )`),
            "sub_price",
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
        {
          model: discounts,
          attributes: [
            "discount_start_date",
            "discount_end_date",
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
        {
          model: categories,
          attributes: ["category_name"],
          required: true,
        },
        {
          model: author,
          attributes: ["author_name", "author_bio"],
          required: true,
        },
      ],
    })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: "Lỗi tìm sách với id= " + id,
        });
      });
  };