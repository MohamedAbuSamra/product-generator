const { getProduct } = require("./get.product.action");
const { runProductGenerator } = require("./post.product.generator");
const { deleteProduct } = require("./delete.product.action");
const {
  makeBatches,
} = require("../../helper/product-generator/input/batches.making");

module.exports = {
  "/": {
    get: {
      action: getProduct,
      level: "member",
    },

    post: {
      action: runProductGenerator,
      level: "member",
    },
    delete: {
      action: deleteProduct,
      level: "member",
    },
  },

  "/make-batches": {
    post: {
      action: makeBatches,
      level: "member",
    },
  },
};
