const {Sequelize, DataTypes} = require("sequelize");
const db = require("../config/db");
const books = require("./books");

const Author = db.define(
  "authors",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    author_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    author_bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        name: "authors_pkey",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
  }
);

//Author.hasMany(books, { as: 'books', foreignKey: 'author_id'});


module.exports = Author;
