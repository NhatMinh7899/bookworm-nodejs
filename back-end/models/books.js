const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/db");
const categories = require("./categories");
const discounts = require("./discounts")
const authors = require("./authors");
const reviews = require("./reviews")

const Book = db.define(
  "books",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },
    author_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "authors",
        key: "id",
      },
    },
    book_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    book_summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    book_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    book_cover_photo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    //tableName: 'books',
    // schema: 'bookworm_app',
    timestamps: false,
    indexes: [
      {
        name: "books_pkey",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
  }
);
Book.hasOne(discounts, { foreignKey: "book_id"});
Book.belongsTo(authors, { foreignKey: "author_id"});
Book.belongsTo(categories, { foreignKey: "category_id"});
Book.hasMany(reviews, {foreignKey: 'book_id'});
module.exports = Book;
