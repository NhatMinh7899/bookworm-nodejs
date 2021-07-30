const {Sequelize, DataTypes} = require("sequelize");
const db = require('../config/db');

const Reviews = db.define('reviews', {
  id: {
    autoIncrement: true,
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  book_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'books',
      key: 'id'
    }
  },
  review_title: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  review_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  review_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  rating_start: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  timestamps: false,
  indexes: [
    {
      name: "reviews_pkey",
      unique: true,
      fields: [
        { name: "id" },
      ]
    },
  ]
});

module.exports = Reviews;