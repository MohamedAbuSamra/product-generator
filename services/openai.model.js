const { Configuration, OpenAIApi } = require("openai");
//config for openAi

const configuration = new Configuration({
  apiKey: CONSTANTS.OPEN_AI_API_KEY,
  organization: CONSTANTS.OPEN_AI_API_ORGANIZATION,
});

const openai = new OpenAIApi(configuration);

async function runOpenAiModel(
  data = {
    content: null,
    tokens: 1500,
    temperature: 0,
    penalty: 0,
    sheetId: null,
    type: null,
    role: "user",
    language: "english",
  }
) {
  try {
    let content = data.content.trim();
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-1106",
      messages: [
        data.language != "english"
          ? {
              role: "system",
              content:
                "أجب دائمًا باللغة العربية فقط، حتى إذا كانت الرسالة بلغة أخرى.",
            }
          : {
              role: "system",
              content:
                "Always answer in English, even if the message is in another language.",
            },
        {
          role: "system",
          content:
            "You are a helpful assistant that helps the user to generate product description and SEO content optimization.",
        },
        { role: data.role || "user", content },
      ],
      max_tokens: data.tokens,
      temperature: data.temperature,
      presence_penalty: data.penalty,
    });
    if (completion && completion.data) {
      const raw = completion.data.choices[0].message.content;
      const cleaned = raw.replace(/\n\s*/g, ""); // clean excessive newlines
      return cleaned;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error while running OpenAI model:", error.message);
    return {
      error: error.response?.data || "Unknown error",
      status: error.response?.status || 500,
    };
  }
}

module.exports.runOpenAiModel = runOpenAiModel;
