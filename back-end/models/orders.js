const {Sequelize, DataTypes} = require("sequelize");
const db = require("../config/db");
const order_items = require("./order_items");

const Order = db.define(
  "orders",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    order_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Order.hasMany(order_items, {foreignKey: 'order_id'});

module.exports = Order;
