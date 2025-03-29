const fs = require("fs");
const path = require("path");

const {
  makeBatches,
} = require("../../helper/product-generator/input/batches.making");

const {
  generateProductData,
} = require("../../helper/product-generator/run.product.generator");

const outputDir = path.join(__dirname, "../../helper/product-generator/output");
const outputFile = path.join(outputDir, "output.jsonl");
const inputDir = path.join(
  __dirname,
  "../../helper/product-generator/input/batches"
);

module.exports.runProductGenerator = async (req, res) => {
  try {
    const { productName, batchNumber, id } = req.body;
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    let generated = [];
    // Case 1: Single Product
    if (productName) {
      const existing = productExists(productName);
      if (!existing) {
        try {
          const [resultEng, resultAr] = await Promise.all([
            generateProductData(
              {
                productName,
                id: id,
              },
              "english"
            ),
            generateProductData(
              {
                productName,
                id: id,
              },
              "arabic"
            ),
          ]);
          const result = {
            originalName: productName,
            id: id,
            englishContent: resultEng,
            arabicContent: resultAr,
          };
          fs.appendFileSync(outputFile, JSON.stringify(result) + "\n");
          generated.push(result);
        } catch (error) {
          console.error("Error generating product data:", error);
          return res
            .status(500)
            .send({ error: "Error generating product data." });
        }
      } else {
        console.log("Already exists:", productName);
        generated.push(existing); // return existing object in response
      }
    }

    // Case 2: Batch
    else if (batchNumber) {
      const batchFile = path.join(inputDir, `batch_${batchNumber}.json`);
      if (!fs.existsSync(batchFile)) {
        return res
          .status(404)
          .send({ error: `Batch file not found: batch_${batchNumber}.json` });
      }

      try {
        const batchData = JSON.parse(fs.readFileSync(batchFile, "utf-8"));

        for (let item of batchData) {
          const existing = productExists(item.arabic_name);
          const productName = item.arabic_name;
          const id = item.product_id;

          if (!existing) {
            try {
              const [resultEng, resultAr] = await Promise.all([
                generateProductData(
                  {
                    productName,
                    id,
                  },
                  "english"
                ),
                generateProductData(
                  {
                    productName,
                    id,
                  },
                  "arabic"
                ),
              ]);
              const result = {
                originalName: productName,
                id: id,
                englishContent: resultEng,
                arabicContent: resultAr,
              };

              fs.appendFileSync(outputFile, JSON.stringify(result) + "\n");
              generated.push(result);
            } catch (error) {
              console.error(
                "Error generating product data for batch item:",
                error
              );
            }
          } else {
            console.log("Already exists:", item.arabic_name);
            generated.push(existing); // ✅ return existing object
          }
        }
      } catch (error) {
        console.error("Error reading or parsing batch file:", error);
        return res.status(500).send({ error: "Error processing batch file." });
      }
    } else {
      return res
        .status(400)
        .send({ error: "Please provide productName or batchNumber." });
    }

    return res.send({ generated });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send({ error: "An unexpected error occurred." });
  }
};

// Helper: check if a product exists in output.jsonl
function productExists(productName) {
  try {
    if (!fs.existsSync(outputFile)) return null;

    const lines = fs
      .readFileSync(outputFile, "utf-8")
      .split("\n")
      .filter(Boolean);

    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        if (obj.originalName?.trim() === productName.trim()) {
          return obj; // return the full matched object
        }
      } catch {
        continue;
      }
    }

    return null; // not found
  } catch (error) {
    console.error("Error checking if product exists:", error);
    return null;
  }
}
