import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const place = req.body.place || '';
  const preferences = req.body.preferences || '';
  const duration = req.body.duration || '';

  if (place.trim().length === 0 || place.trim().length > 100) {
    res.status(400).json({
      error: {
        message: "Invalud input",
      }
    });
    return;
  }

  if (preferences.trim().length === 0 || preferences.trim().length  > 1000) {
    res.status(400).json({
      error: {
        message: "Invalud input",
      }
    });
    return;
  }

  if (duration.trim().length === 0 || duration.trim().length > 20) {
    res.status(400).json({
      error: {
        message: "Invalud input",
      }
    });
    return;
  }

  const tripInfo = {
    place,
    preferences,
    duration
  };

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(tripInfo),
      temperature: 0.7,
      max_tokens: 1000
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(tripInfo) {
  return `Plan a ${tripInfo.duration} trip to ${tripInfo.place} for someone that's interested in ${tripInfo.preferences}`
}
