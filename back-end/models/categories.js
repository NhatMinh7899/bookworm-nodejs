const {Sequelize, DataTypes} = require("sequelize");
const db = require("../config/db");

const Categories = db.define(
  "categories",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    category_name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    category_desc: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        name: "categories_pkey",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
  }
);

module.exports = Categories;
