const fs = require("fs");
const path = require("path");

const outputFile = path.join(
  __dirname,
  "../../helper/product-generator/output",
  "output.jsonl"
);

function matchProduct(obj, productName, id) {
  const parsedId = id ? parseInt(id) : null;
  const parsedName = productName ? productName.toString().trim() : null;

  const idMatch =
    (parsedId !== null && obj.id === parsedId) ||
    obj.englishContent.id === parsedId;
  const nameMatch =
    parsedName &&
    (obj.originalName === parsedName ||
      obj.englishContent?.productName === parsedName ||
      obj.arabicContent?.productName === parsedName);

  return idMatch || nameMatch;
}

module.exports.deleteProduct = async (req, res) => {
  const { productName, id } = req.body;

  if (!productName && !id) {
    return res
      .status(400)
      .send({ error: "Please provide productName or id to delete." });
  }

  if (!fs.existsSync(outputFile)) {
    return res.status(404).send({ error: "output.jsonl not found." });
  }

  const lines = fs
    .readFileSync(outputFile, "utf-8")
    .split("\n")
    .filter(Boolean);
  let found = false;

  const remaining = lines.filter((line) => {
    try {
      const obj = JSON.parse(line);
      if (matchProduct(obj, productName, id)) {
        found = true;
        return false; // exclude matched line
      }
      return true;
    } catch {
      return true; // keep malformed lines
    }
  });

  if (!found) {
    return res.status(404).send({ status: "not found" });
  }

  // Write remaining lines back to the file
  fs.writeFileSync(outputFile, remaining.join("\n") + "\n");

  return res.send({ status: "deleted", deleted: { productName, id } });
};
