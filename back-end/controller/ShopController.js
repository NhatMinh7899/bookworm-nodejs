const Book = require("../models/books");
const discounts = require("../models/discounts");
const reviews = require("../models/reviews");
const author = require("../models/authors");
const categories = require("../models/categories");
const { Sequelize, Op } = require("sequelize");
const sequelize = require("../config/db");

//-------- Xem cách gõ url truy vấn trên trang https://www.bezkoder.com/ (mở youtube)
// /api/tutorials?page=1&size=5
//------------------------------------------
// /api/tutorials?size=5: sử dụng giá trị mặc định cho trang
// /api/tutorials?title=data&page=1&size=3: phân trang & lọc theo tiêu đề có chứa 'dữ liệu'
// /api/tutorials/published?page=2: phân trang & lọc theo trạng thái 'đã xuất bản'

//lấy giá trị paginate hoặc gắn giá trị mặc định
const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

//tính toán lấy tổng số trang và trang hiện tại
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: dataItems } = data;
  const totalItemInGroupBy = data.count.length;
  console.log(typeof totalItems);
  if (typeof totalItems != "number") {
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItemInGroupBy / limit);
    return { totalItemInGroupBy, dataItems, totalPages, currentPage };
  }
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, dataItems, totalPages, currentPage };
};

exports.findAll = (req, res) => {
  //let condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  const { page, size } = req.query;
  //const id = req.params.id;
  const sort = req.params.sort;
  const { limit, offset } = getPagination(page, size);
  //const condition = id ? { author_id: { [Op.eq]: Number(id) } } : null;
  Book.findAndCountAll({
    attributes: {
      include: [
        [
          sequelize.fn(
            "COALESCE",
            sequelize.col("discount.discount_price"),
            sequelize.col("books.book_price")
          ),
          "final_price",
        ],
      ],
    },
    include: [
      { model: categories, attributes: ["category_name"], required: true },
      { model: author, attributes: ["author_name"], required: true },
      {
        model: discounts,
        attributes: [],
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: {
                    [Op.gte]: new Date(),
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: null,
                },
              ],
            },
          ],
        },
        required: false,
      },
    ],
    raw: true,
    order: [
      ["book_price", `${sort}`],
    ],
    subQuery: false,

    limit: limit,
    offset: offset,
  })
  .then((data) => {
    const response = getPagingData(data, page, limit);
    res.send(response);
  })
  .catch((err) => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving tutorials.",
    });
  });
};


exports.findAllBookWithOnSale = (req, res) => {
  const { page, size, sort } = req.query;
  const condition_sort = sort ? sort : "DESC";
  const { limit, offset } = getPagination(page, size);

  Book.findAndCountAll({
    include: {
      model: discounts,
      attributes: [],
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              {
                discount_start_date: {
                  [Op.lte]: new Date(),
                },
              },
              {
                discount_end_date: {
                  [Op.gte]: new Date(),
                },
              },
            ],
          },
          {
            [Op.and]: [
              {
                discount_start_date: {
                  [Op.lte]: new Date(),
                },
              },
              {
                discount_end_date: null,
              },
            ],
          },
        ],
      },
      required: true,
    },
    attributes: {
      include: [
        [
          sequelize.literal(`(select (books.book_price - discounts.discount_price)
                    from discounts
                    where discounts.book_id = books.id
                )`),
          "sub_price",
        ],
        [
          discounts.sequelize.fn(
            "COALESCE",
            sequelize.col("discount.discount_price"),
            sequelize.col("books.book_price")
          ),
          "final_price",
        ],
        // [
        //   sequelize.literal(`(select COALESCE(discounts.discount_price,books.book_price)
        //         from discounts
        //         where discounts.book_id = books.id
        //         )`),
        //   "final_price",
        // ],
      ],
    },
    order: [
      [sequelize.literal("sub_price"), `${condition_sort}`],
      ["book_price", "DESC"],
    ],
    limit: limit,
    offset: offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.findAllBookWithPopular = (req, res) => {
  const { page, size, sort } = req.query;
  const condition_sort = sort ? sort : "DESC";
  const { limit, offset } = getPagination(page, size);

  Book.findAndCountAll({
    attributes: {
      include: [
        [
          sequelize.fn("COUNT", sequelize.col("reviews.book_id")),
          "count_reviews",
        ],
        [
          sequelize.fn(
            "COALESCE",
            sequelize.col("discount.discount_price"),
            sequelize.col("books.book_price")
          ),
          "final_price",
        ],
      ],
    },
    include: [
      { model: reviews, attributes: ["book_id"], required: true },
      {
        model: discounts,
        attributes: ["discount_price"],
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: {
                    [Op.gte]: new Date(),
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: null,
                },
              ],
            },
          ],
        },
        required: false,
      },
    ],
    group: ["books.id", "reviews.book_id", "discount.discount_price"],
    raw: true,
    order: [
      [sequelize.col("count_reviews"), `${condition_sort}`],
      ["book_price", "ASC"],
    ],
    subQuery: false,

    limit: limit,
    offset: offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.findAllBookWithRecommend = (req, res) => {
  const { page, size } = req.query;

  const { limit, offset } = getPagination(page, size);

  Book.findAndCountAll({
    attributes: {
      include: [
        [
          sequelize.fn(
            "AVG",
            sequelize.cast(sequelize.col("reviews.rating_start"), "float")
          ),
          "average_start",
        ],
      ],
    },
    include: [{ model: reviews, attributes: [], required: true }],
    group: ["books.id", "reviews.book_id"],
    order: [
      [sequelize.col("average_start"), "DESC"],
      ["book_price", "DESC"],
    ],
    subQuery: false,
    limit: limit,
    offset: offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

//-------------Categories------------------

exports.findOnsaleBookByCategory = (req, res) => {
  const { page, size } = req.query;
  const id = req.params.id;
  const { limit, offset } = getPagination(page, size);
  const condition = id ? { category_id: { [Op.eq]: Number(id) } } : null;
  console.log(condition);
  Book.findAndCountAll({
    where: condition,
    include: [
      { model: categories, attributes: ["category_name"], required: true },
      {
        model: discounts,
        attributes: [],
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: {
                    [Op.gte]: new Date(),
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: null,
                },
              ],
            },
          ],
        },
        required: true,
      },
      { model: author, attributes: ["author_name"], required: true },
    ],
    attributes: {
      include: [
        [
          sequelize.literal(`(select (books.book_price - discounts.discount_price)
                    from discounts
                    where discounts.book_id = books.id
                )`),
          "sub_price",
        ],
        [
          discounts.sequelize.fn(
            "COALESCE",
            sequelize.col("discount.discount_price"),
            sequelize.col("books.book_price")
          ),
          "final_price",
        ],
      ],
    },
    order: [
      [sequelize.literal("sub_price"), "DESC"],
      ["book_price", "DESC"],
    ],
    limit: limit,
    offset: offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.findPopularBookByCategory = (req, res) => {
  const { page, size } = req.query;
  const id = req.params.id;
  const { limit, offset } = getPagination(page, size);
  const condition = id ? { category_id: { [Op.eq]: Number(id) } } : null;
  console.log(condition);
  Book.findAndCountAll({
    where: condition,
    attributes: {
      include: [
        [
          sequelize.fn("COUNT", sequelize.col("reviews.book_id")),
          "count_reviews",
        ],
        [
          sequelize.fn(
            "COALESCE",
            sequelize.col("discount.discount_price"),
            sequelize.col("books.book_price")
          ),
          "final_price",
        ],
      ],
    },
    include: [
      { model: categories, attributes: ["category_name"], required: true },
      { model: author, attributes: ["author_name"], required: true },
      { model: reviews, attributes: ["book_id"], required: true },
      {
        model: discounts,
        attributes: [],
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: {
                    [Op.gte]: new Date(),
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: null,
                },
              ],
            },
          ],
        },
        required: false,
      },
    ],
    group: [
      "books.id",
      "reviews.book_id",
      "discount.id",
      "author.id",
      "category.category_name",
    ],
    raw: true,
    order: [
      [sequelize.col("count_reviews"), "DESC"],
      ["book_price", "ASC"],
    ],
    subQuery: false,

    limit: limit,
    offset: offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.findCategoryBookWithSort = (req, res) => {
  const { page, size } = req.query;
  const id = req.params.id;
  const sort = req.params.sort;
  const { limit, offset } = getPagination(page, size);
  const condition = id ? { category_id: { [Op.eq]: Number(id) } } : null;
  console.log(condition);
  Book.findAndCountAll({
    where: condition,
    attributes: {
      include: [
        [
          sequelize.fn(
            "COALESCE",
            sequelize.col("discount.discount_price"),
            sequelize.col("books.book_price")
          ),
          "final_price",
        ],
      ],
    },
    include: [
      { model: categories, attributes: ["category_name"], required: true },
      { model: author, attributes: ["author_name"], required: true },
      {
        model: discounts,
        attributes: [],
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: {
                    [Op.gte]: new Date(),
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: null,
                },
              ],
            },
          ],
        },
        required: false,
      },
    ],
    raw: true,
    order: [
      ["book_price", `${sort}`],
    ],
    subQuery: false,

    limit: limit,
    offset: offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
}

//------------Author---------------

exports.findOnsaleBookByAuthor = (req, res) => {
  const { page, size } = req.query;
  const id = req.params.id;
  const { limit, offset } = getPagination(page, size);
  const condition = id ? { author_id: { [Op.eq]: Number(id) } } : null;
  Book.findAndCountAll({
    where: condition,
    include: [
      {
        model: discounts,
        attributes: [],
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: {
                    [Op.gte]: new Date(),
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: null,
                },
              ],
            },
          ],
        },
        required: true,
      },
      { model: author, attributes: ["author_name"], required: true },
    ],
    attributes: {
      include: [
        [
          sequelize.literal(`(select (books.book_price - discounts.discount_price)
                    from discounts
                    where discounts.book_id = books.id
                )`),
          "sub_price",
        ],
        [
          discounts.sequelize.fn(
            "COALESCE",
            sequelize.col("discount.discount_price"),
            sequelize.col("books.book_price")
          ),
          "final_price",
        ],
      ],
    },
    order: [
      [sequelize.literal("sub_price"), "DESC"],
      ["book_price", "DESC"],
    ],
    limit: limit,
    offset: offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.findPopularBookByAuthor = (req, res) => {
  const { page, size } = req.query;
  const id = req.params.id;
  const { limit, offset } = getPagination(page, size);
  const condition = id ? { author_id: { [Op.eq]: Number(id) } } : null;
  console.log(condition);
  Book.findAndCountAll({
    where: condition,
    attributes: {
      include: [
        [
          sequelize.fn("COUNT", sequelize.col("reviews.book_id")),
          "count_reviews",
        ],
        [
          sequelize.fn(
            "COALESCE",
            sequelize.col("discount.discount_price"),
            sequelize.col("books.book_price")
          ),
          "final_price",
        ],
      ],
    },
    include: [
      { model: categories, attributes: ["category_name"], required: true },
      { model: author, attributes: ["author_name"], required: true },
      { model: reviews, attributes: ["book_id"], required: true },
      {
        model: discounts,
        attributes: [],
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: {
                    [Op.gte]: new Date(),
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: null,
                },
              ],
            },
          ],
        },
        required: false,
      },
    ],
    group: [
      "books.id",
      "reviews.book_id",
      "discount.id",
      "author.id",
      "category.category_name",
    ],
    raw: true,
    order: [
      [sequelize.col("count_reviews"), "DESC"],
      ["book_price", "ASC"],
    ],
    subQuery: false,

    limit: limit,
    offset: offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.findAuthorBookWithSort = (req, res) => {
  const { page, size } = req.query;
  const id = req.params.id;
  const sort = req.params.sort;
  const { limit, offset } = getPagination(page, size);
  const condition = id ? { author_id: { [Op.eq]: Number(id) } } : null;
  console.log(condition);
  Book.findAndCountAll({
    where: condition,
    attributes: {
      include: [
        [
          sequelize.fn(
            "COALESCE",
            sequelize.col("discount.discount_price"),
            sequelize.col("books.book_price")
          ),
          "final_price",
        ],
      ],
    },
    include: [
      { model: categories, attributes: ["category_name"], required: true },
      { model: author, attributes: ["author_name"], required: true },
      {
        model: discounts,
        attributes: [],
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: {
                    [Op.gte]: new Date(),
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: null,
                },
              ],
            },
          ],
        },
        required: false,
      },
    ],
    raw: true,
    order: [
      ["book_price", `${sort}`],
    ],
    subQuery: false,

    limit: limit,
    offset: offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
}

//------------Star--------------------

exports.findOnsaleBookByStar = (req, res) => {
  const { page, size } = req.query;
  const id = req.params.id;
  const { limit, offset } = getPagination(page, size);
  const condition = id ? { rating_start: { [Op.eq]: String(id) } } : null;
  Book.findAndCountAll({
    include: [
      {
        model: discounts,
        attributes: [],
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: {
                    [Op.gte]: new Date(),
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: null,
                },
              ],
            },
          ],
        },
        required: true,
      },
      { model: author, attributes: ["author_name"], required: true },
      {model: reviews, attributes: ["rating_start"],where: condition,group: ['rating_start'], required: true}
    ],
    attributes: {
      include: [
        [
          sequelize.literal(`(select (books.book_price - discounts.discount_price)
                    from discounts
                    where discounts.book_id = books.id
                )`),
          "sub_price",
        ],
        [
          discounts.sequelize.fn(
            "COALESCE",
            sequelize.col("discount.discount_price"),
            sequelize.col("books.book_price")
          ),
          "final_price",
        ],
      ],
    },
    order: [
      [sequelize.literal("sub_price"), "DESC"],
      ["book_price", "DESC"],
    ],
    limit: limit,
    offset: offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.findPopularBookByStar = (req, res) => {
  const { page, size } = req.query;
  const id = req.params.id;
  const { limit, offset } = getPagination(page, size);
  const condition = id ? { rating_start: { [Op.eq]: String(id) } } : null;
  console.log(condition);
  Book.findAndCountAll({
    attributes: {
      include: [
        [
          sequelize.fn("COUNT", sequelize.col("reviews.book_id")),
          "count_reviews",
        ],
        [
          sequelize.fn(
            "COALESCE",
            sequelize.col("discount.discount_price"),
            sequelize.col("books.book_price")
          ),
          "final_price",
        ],
      ],
    },
    include: [
      { model: categories, attributes: ["category_name"], required: true },
      { model: author, attributes: ["author_name"], required: true },
      { model: reviews, attributes: ["rating_start"],where: condition, required: true },
      {
        model: discounts,
        attributes: [],
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: {
                    [Op.gte]: new Date(),
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: null,
                },
              ],
            },
          ],
        },
        required: false,
      },
    ],
    group: [
      "books.id",
      "reviews.rating_start",
      "discount.id",
      "author.id",
      "category.category_name",

    ],
    raw: true,
    order: [
      [sequelize.col("count_reviews"), "DESC"],
      ["book_price", "ASC"],
    ],
    subQuery: false,

    limit: limit,
    offset: offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
}

exports.findStarBookWithSort = (req, res) => {
  const { page, size } = req.query;
  const id = req.params.id;
  const sort = req.params.sort;
  const { limit, offset } = getPagination(page, size);
  const condition = id ? { rating_start: { [Op.eq]: String(id) } } : null;
  Book.findAndCountAll({
    attributes: {
      // include: [
      //   [
      //     sequelize.fn(
      //       "COALESCE",
      //       sequelize.col("discounts.discount_price"),
      //       sequelize.col("books.book_price")
      //     ),
      //     "final_price",
      //   ],
      // ],
    },
    include: [
      {
        model: discounts,
        attributes: ['discount_price'],
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: {
                    [Op.gte]: new Date(),
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  discount_start_date: {
                    [Op.lte]: new Date(),
                  },
                },
                {
                  discount_end_date: null,
                },
              ],
            },
          ],
        },
        required: false,

      },
      { model: author, attributes: ["author_name"], required: true },
      {model: reviews, attributes: ["rating_start"],where: condition,group: ['book_id'], required: true}
    ],
    order: [
      ["book_price", `${sort}`],
    ],
    limit: limit,
    offset: offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
}