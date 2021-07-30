const {Sequelize, DataTypes} = require("sequelize");
const db = require("../config/db");

const OrderItems = db.define(
  "order_items",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "orders",
        key: "id",
      },
    },
    book_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "books",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        name: "order_items_pkey",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
  }
);

module.exports = OrderItems;
