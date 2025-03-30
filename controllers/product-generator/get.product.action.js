const fs = require("fs");
const path = require("path");
const axios = require("axios");

const outputFile = path.join(
  __dirname,
  "../../helper/product-generator/output",
  "output.jsonl"
);

function findProductByName(productName, id) {
  if (!fs.existsSync(outputFile)) return null;

  //id or porductname are string query params need to be converted to string and intgor

  if (id) {
    id = parseInt(id);
  }
  if (productName) {
    productName = productName.toString();
  }

  const lines = fs
    .readFileSync(outputFile, "utf-8")
    .split("\n")
    .filter(Boolean);

  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      var idFounded = id && (obj.id === id || obj.englishContent.id === id);
      const nameFounded =
        productName &&
        (obj.englishContent.productName === productName ||
          obj.originalName === productName ||
          obj.arabicContent.productName === productName);

      if (idFounded || nameFounded) {
        return obj;
      }
    } catch {
      continue;
    }
  }

  return null;
}

module.exports.getProduct = async (req, res) => {
  const { productName, id } = req.query;

  if (!productName && !id) {
    return res
      .status(400)
      .send({ error: "Missing productName in request body." });
  }

  // 1. Check if product already exists
  const existing = findProductByName(productName, id);
  if (existing) {
    return res.send({ status: "exists", product: existing });
  } else return res.send({ status: "not found" });
};
