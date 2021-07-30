const categories = require("../models/categories");

exports.allCategory = (req, res) => {
    categories.findAll({
        attributes: ['id', 'category_name'],
    }).then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Lỗi get rồi",
        });
      });
}