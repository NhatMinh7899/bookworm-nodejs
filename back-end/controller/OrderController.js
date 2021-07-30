const Book = require("../models/books");
const discounts = require("../models/discounts");
const reviews = require("../models/reviews");
const author = require("../models/authors");
const categories = require("../models/categories");
const { Sequelize, Op } = require("sequelize");
const sequelize = require("../config/db");
const orders = require("../models/orders");
const order_items = require("../models/order_items");

//kết quả trả về là 1 mảng với các phần tử trong đó là

exports.orderCartShop = async (req, res) => {
  //res.send('12321321');
  const CartShops = req.body;
  const unvalid_books = new Array();
  const invalidQuatity = new Array();

  const books = Book.findAll();

  CartShops.forEach((book) => {
    if (Book.findByPk(book.id) == null) {
      unvalid_books.push({ id: book.id, title: book.title });
    }

    if (!(book.quantity >= 1 && book.quantity <= 8)) {
      invalidQuatity.push({ id: book.id, title: book.title });
    }

    if (unvalid_books || invalidQuatity) {
      return res.status(400).send({
        unvalidBook: unvalid_books,
        message_error: "Sách không có sẵn! ",
      });
    }
    if (invalidQuatity) {
      return res.status(400).send({
        WrongQuality: invalidQuatity,
        message_error: "Số lượng không đúng! ",
      });
    }
  });

  try {
    const ordering = await sequelize
      .transaction(async (t) => {
        let total = 0;
        const order_books = new Array();
        CartShops.forEach((book) => {
          const getBook = Book.findByPk(book.id);
          const price =
            getBook.discounts.discount_price != null
              ? getBook.discounts.discount_price
              : getBook.book_price;
          order_books.push({
            book_id: book.book_id,
            price: price,
            quantity: book.quantity,
          });
          total += price * book.quantity;
        });

        const order = await orders.create(
          {
            order_date: new Date(),
            order_amount: total,
            order_items: order_books,
          },
          { include: [{ association: order_items }] },
          { transaction: t }
        );
      })
      .then(() => {
        res.status(201).send({
          unvalidBook: unvalid_books,
          WrongQuality: invalidQuatity,
        });
      });
    return res.status(201).send({
      unvalidBook: unvalid_books,
      WrongQuality: invalidQuatity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi tạo order rồi!");
  }
};
