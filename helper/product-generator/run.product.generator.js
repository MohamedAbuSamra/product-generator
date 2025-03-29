const runOpenAiModel = require("../../services/openai.model").runOpenAiModel;
const prompts = require("./generate.product.prompts");

async function generateProductData({ productName, id }, language = "english") {
  var data = {
    originalName: productName,
    id: id,
  };

  // generate producname in english in case it is in arabic

  if (language === "english") {
    data.name = await runOpenAiModel({
      content: prompts.translateProductName({ name: productName }, language),
      tokens: 500,
      temperature: 0,
      penalty: 0,
      language,
      type: "translate",
    });
  } else data.name = productName;

  //then use name to generate a basic text about the product

  data.text = await runOpenAiModel({
    content: prompts.initialDescription(data, language),
    tokens: 1500,
    temperature: 0,
    language,
  });

  //then use the text to generate the scientific name along the product's name
  data.scientificName = await runOpenAiModel({
    content: prompts.scientificName(data, language),
    tokens: 500,
    temperature: 0,
    penalty: 0,
    language,
  });

  //generate  mate tags, brief, keyword rules, keyword info
  const [mateTags, brief, keywordData] = await Promise.all([
    runOpenAiModel({
      content: prompts.mateTags(data, language),
      temperature: 0,
      penalty: 0,
      language,
    }).then(jsonParse),

    runOpenAiModel({
      content: prompts.brief(data, language),
      language,
    }),

    runOpenAiModel({
      content: prompts.keywordRules(data, language),
      temperature: 0.5,
      language,
    }).then(jsonParse),
  ]);

  data.mateTags = mateTags;
  data.brief = brief;
  data.keywordData = keywordData;

  //generate description using the description prompt and the keyword
  const description = await runOpenAiModel({
    content: prompts.description(
      data,
      prompts.keywordInfo(keywordData, data, language)
    ),
    temperature: 0.5,
    tokens: 2000,
    penalty: 2,
    language,
  });
  data.description = description;

  return data;
}

//generate product data in Arabic

module.exports.generateProductData = generateProductData;

function jsonParse(data) {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}
