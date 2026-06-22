import OpenAI from 'openai';
import type z from 'zod';

interface AiClient {
  provider: string;
  model: string;
  completeJson<T>(input: string, schemaName: string, schema: z.ZodType<T>): Promise<T>;
}

function parseJsonWithSchema<T>(content: string, schema: z.ZodType<T>) {
  const jsonContent = content
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const parsedContent = JSON.parse(jsonContent);

  try {
    return schema.parse(parsedContent);
  } catch (error) {
    throw new Error(
      `AI response did not match the expected schema: ${JSON.stringify(parsedContent).slice(0, 2000)}`,
      { cause: error },
    );
  }
}

export function createAiClient() {
  const openRouterApiKey = process.env.OPENROUTER_API_KEY ?? process.env.API_KEY;
  const openRouterBaseUrl = process.env.BASE_URL ?? 'https://openrouter.ai/api/v1';

  if (openRouterApiKey) {
    const client = new OpenAI({
      apiKey: openRouterApiKey,
      baseURL: openRouterBaseUrl,
      defaultHeaders: {
        'HTTP-Referer': 'https://github.com/TianJianJun0727/ycloud-icons',
        'X-Title': 'YCloud Icons Metadata',
      },
    });

    return {
      model: process.env.AI_MODEL ?? 'deepseek/deepseek-chat-v3.1',
      provider: 'OpenRouter',
      async completeJson<T>(input: string, _schemaName: string, schema: z.ZodType<T>) {
        const response = await client.chat.completions.create({
          model: process.env.AI_MODEL ?? 'deepseek/deepseek-chat-v3.1',
          messages: [
            {
              role: 'system',
              content: 'Return only a valid JSON object. Do not wrap it in Markdown.',
            },
            {
              role: 'user',
              content: input,
            },
          ],
          temperature: 0,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('AI response did not include JSON content.');
        }

        return parseJsonWithSchema(content, schema);
      },
    } satisfies AiClient;
  }

  if (process.env.GITHUB_TOKEN) {
    const client = new OpenAI({
      apiKey: process.env.GITHUB_TOKEN,
      baseURL: 'https://models.github.ai/inference',
    });

    return {
      model: process.env.AI_MODEL ?? 'openai/gpt-4.1-mini',
      provider: 'GitHub Models',
      async completeJson<T>(input: string, _schemaName: string, schema: z.ZodType<T>) {
        const response = await client.chat.completions.create({
          model: process.env.AI_MODEL ?? 'openai/gpt-4.1-mini',
          messages: [
            {
              role: 'system',
              content: 'Return only a valid JSON object. Do not wrap it in Markdown.',
            },
            {
              role: 'user',
              content: input,
            },
          ],
          response_format: {
            type: 'json_object',
          },
          temperature: 0,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('AI response did not include JSON content.');
        }

        return parseJsonWithSchema(content, schema);
      },
    } satisfies AiClient;
  }

  return null;
}
