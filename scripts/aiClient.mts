import OpenAI from 'openai';

export function createAiClient() {
  if (process.env.OPENAI_API_KEY) {
    return {
      client: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
      model: process.env.AI_MODEL ?? 'gpt-5-mini',
      provider: 'OpenAI',
    };
  }

  if (process.env.GITHUB_TOKEN) {
    return {
      client: new OpenAI({
        apiKey: process.env.GITHUB_TOKEN,
        baseURL: 'https://models.github.ai/inference',
      }),
      model: process.env.AI_MODEL ?? 'openai/gpt-4.1-mini',
      provider: 'GitHub Models',
    };
  }

  return null;
}
