const fs = require("fs");
const path = require("path");

//
function makeBatches() {
  // Path to your input JSON file
  const jsonFilePath = path.join(__dirname, "products_list.json");

  // Path to batches folder
  const batchesFolder = path.join(__dirname, "batches");

  // Create the batches folder if it doesn't exist
  if (!fs.existsSync(batchesFolder)) {
    fs.mkdirSync(batchesFolder);
    console.log("📁 Created folder: ./batches");
  }

  // Read and parse the JSON file
  const data = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

  // Split into 10 batches
  const batchSize = Math.ceil(data.length / 10);
  const batches = [];

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    batches.push(batch);
  }

  // Save each batch inside ./batches folder
  batches.forEach((batch, index) => {
    const batchPath = path.join(batchesFolder, `batch_${index + 1}.json`);
    fs.writeFileSync(batchPath, JSON.stringify(batch, null, 2), "utf8");
  });

  console.log("✅ All batches saved inside ./batches folder.");
}

module.exports = {
  makeBatches,
};
