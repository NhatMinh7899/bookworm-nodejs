var DataTypes = require("sequelize").DataTypes;
var _authors = require("./authors");
var _books = require("./books");
var _categories = require("./categories");
var _discounts = require("./discounts");
var _migrations = require("./migrations");
var _order_items = require("./order_items");
var _orders = require("./orders");
var _reviews = require("./reviews");

function initModels(sequelize) {
  var authors = _authors(sequelize, DataTypes);
  var books = _books(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var discounts = _discounts(sequelize, DataTypes);
  var migrations = _migrations(sequelize, DataTypes);
  var order_items = _order_items(sequelize, DataTypes);
  var orders = _orders(sequelize, DataTypes);
  var reviews = _reviews(sequelize, DataTypes);

  books.belongsTo(authors, { as: "author", foreignKey: "author_id"});
  authors.hasMany(books, { as: "books", foreignKey: "author_id"});
  discounts.belongsTo(books, { as: "book", foreignKey: "book_id"});
  books.hasMany(discounts, { as: "discounts", foreignKey: "book_id"});
  order_items.belongsTo(books, { as: "book", foreignKey: "book_id"});
  books.hasMany(order_items, { as: "order_items", foreignKey: "book_id"});
  reviews.belongsTo(books, { as: "book", foreignKey: "book_id"});
  books.hasMany(reviews, { as: "reviews", foreignKey: "book_id"});
  books.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(books, { as: "books", foreignKey: "category_id"});
  order_items.belongsTo(orders, { as: "order", foreignKey: "order_id"});
  orders.hasMany(order_items, { as: "order_items", foreignKey: "order_id"});

  return {
    authors,
    books,
    categories,
    discounts,
    migrations,
    order_items,
    orders,
    reviews,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
