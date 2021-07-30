const author = require("../models/authors");

exports.allAuthor = (req, res) => {
    author.findAll({
        attributes: ['id', 'author_name'],       
    }).then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Lỗi get rồi",
        });
      });
};

