module.exports = {
  initialDescription,
  scientificName,
  mateTags,
  intro,
  brief,
  keywordRules,
  keywordInfo,
  description,
  translateProductName,
};

function translateProductName(data, language = "english") {
  return `Translate the following product name to ${language}: ${data.name}
  only return the translated name`;
}

function initialDescription(data, language = "english") {
  return `You are a medical content writer.
  Interpret the product name and generate a very short professional medical description.
  Product Name: ${data.name}
  Rules:- Do not mention features, manufacturer, brand, model number, specifications, or country- Do not use adjectives- Do not repeat the product name in the description- Describe only the medical purpose or use of the product- Write your answer professionally and clearly, even if the product name is in Arabic or another language- Answer in ${language}`;
}

function scientificName(data, language = "english") {
  return `What is the item described in this article?${data.name}${data.text}
  Rules:
   Do not mention the item features- Do not mention the manufacturer-Do not mention brand name or brand details
   - Make your answer as short as possible- Make your answer medically professional-Do not use model number of code or specifications or country
   - Do not use adjectives in your answer write the scientific name only- Answer in ${language}`;
}

function mateTags(data, language = "english") {
  if (language === "arabic") {
    return `قم بإنشاء وسوم ميتا SEO للمنتج التالي:
اسم المنتج: ${data.name}
الاسم العلمي: ${data.scientificName}

القواعد:
- أعد المخرجات على شكل **كائن JSON** بالهيكل التالي:
  {
    "title": "العنوان",
    "description": "الوصف",
    "keywords": "كلمات، مفتاحية، مفصولة، بفواصل"
  }
- العنوان: بحد أقصى 50 حرفًا، ويجب أن يبدأ بـ "ايومت: ${data.name}"
- الوصف: بحد أقصى 120 حرفًا، يجب أن يبدأ بـ "اكتشف" وينتهي بـ "للمزيد تواصل معنا الآن!" أو "للتواصل معنا الآن!"
- الكلمات المفتاحية: بحد أقصى 255 حرفًا، مفصولة بفواصل
- استخدم مصطلحات B2B فقط — لا تذكر عبارات مثل "اشترِ الآن" أو "تسوق الآن" أو "اطلب الآن" في العنوان أو الوصف
- أجب باللغة العربية فقط

أعد فقط كائن JSON النهائي — بدون شرح أو نص إضافي.`;
  }

  // Default: English version
  return `Generate SEO meta tags for the following product:
Product Name: ${data.name}
Scientific Name: ${data.scientificName}

Rules:
- Return output as a **JSON object** with the following structure:
  {
    "title", description: "description", keywords: "keywords"
  }
- Title: max 50 characters, must start with "Aumet: ${data.name}"
- Description: max 120 characters, must start with "Discover" and end with either "to learn more reach out now!" or "contact us now!"
- Keywords: max 255 characters, comma-separated
- Use only B2B terms — do NOT include phrases like "buy", "buy now", "shop now", or "order now" in title or description.
- Answer in English

Only return the final output JSON object — no explanation, no extra text.`;
}

function intro(data, language = "english") {
  if (language == "arabic")
    return `المقالة تتحدث عن ${data.scientificName}، اسم المنتج هو ${data.name}
  المقالة: ${data.text}`;

  return `The article is about ${data.scientificName}, the product name is ${data.name}
  Article:${data.text}`;
}

function brief(data, language = "english") {
  return `
  ${intro(data, language)}
  Primary keyword: ${data.scientificName}
  Meta description 
  rules:
  -Max count of words for the meta description = 25 word.
  -Article item is not intended for purchase.
  -Article item is not intended towards end-user (consumer) to use
  SEO optimized meta description
  Answer in ${language}`;
}

function keywordRules(data, language = "english") {
  return `In json format generate:
  - Secondary Keywords as secondary: Most important effective ones
  - Long-tail keywords as longtail: Include manufacturer name and country, it has to be at least 3-4 words
  - Short-tail keywords as shorttail: Most important effective ones
  - Search keywords as search: keywords that most likely will show other products similar to my product on google.
  - LSI Keywords as lsi 
  -never inlude or add array inside of the array attribute
  -make sure to add double quotes inside the array in order to use JSON parse method
  The json object is generated from the following article, ${intro(
    data,
    language
  )}
  Answer in ${language}`;
}
function keywordInfo(keywordRules, data, language = "english") {
  const result = `Here are the SEO keywords that you may need to use in the results: 
  - Primary Keyword: ${data.scientificName}
  ${
    keywordRules.secondary
      ? "- Secondary Keywords: " + keywordRules.secondary
      : ""
  }
  ${
    keywordRules.longtail
      ? "- Long-Tail Keywords: " + keywordRules.longtail
      : ""
  }
  ${
    keywordRules.shorttail
      ? "- Short-Tail Keywords: " + keywordRules.shorttail
      : ""
  }
  ${keywordRules.search ? "- Search Keywords: " + keywordRules.search : ""}
  ${keywordRules.lsi ? "- LSI Keywords: " + keywordRules.lsi : ""}
  Answer in ${language}`;

  // Remove line breaks, leading spaces, and collapse multiple spaces
  return result
    .replace(/\n\s*/g, "") // remove \n and indent
    .replace(/\s{2,}/g, " ") // collapse multiple spaces
    .trim(); // remove leading/trailing spaces
}
function description(data, keywordInfoData, language = "english") {
  return `SEO Rules:
   ${keywordInfoData}
  ----
  Rules:
  1-Description should not include any number (example: weight, dimensions, models, codes, etc.)
  2-Description should be SEO optimized utilizing the keywords.
  3-Description should be in html format.
  4-Use headings and sub headings.
  5-At least 1 of the headings should have the primary keyword.
  6-The product is not for sale.
  7-Adjust it so it sounds human written
  8-Use bullet points when needed.
  9-The description should be in written in this language ${language}.
  ------
  Generate an elaborative scientific product description in html format within 300 words about the following article, ${intro(
    data,
    language
  )}
  Generate the description in html format and don't mention any of those keywords(Contact Us,SEO keywords,Primary Keyword, Secondary Keywords, Long-Tail Keywords, Short-Tail Keywords, Search Keywords, LSI Keywords)

  only return the description in html format nothing else
 `;
}
