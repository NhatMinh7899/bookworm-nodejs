const {Sequelize, DataTypes} = require("sequelize");
const db = require("../config/db");
const books = require("./books")

const Discounts = db.define(
  "discounts",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    book_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "books",
        key: "id",
      },
    },
    discount_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    discount_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    discount_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

//Discounts.belongsTo(books);

module.exports = Discounts;
