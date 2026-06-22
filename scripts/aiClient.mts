import { createOpenAI } from '@ai-sdk/openai';
import { generateText, Output } from 'ai';
import type z from 'zod';

interface AiClient {
  provider: string;
  model: string;
  completeJson<TSchema extends z.ZodTypeAny>(
    input: string,
    schemaName: string,
    schema: TSchema,
  ): Promise<z.infer<TSchema>>;
}

type AiClientOptions = {
  apiKey?: string;
  baseURL?: string;
  model?: string;
  provider?: string;
  systemPrompt?: string;
};

function resolveAiOptions(options: AiClientOptions = {}) {
  const explicitApiKey = options.apiKey ?? process.env.AI_API_KEY;
  const explicitBaseURL = options.baseURL ?? process.env.AI_BASE_URL;
  const explicitModel = options.model ?? process.env.AI_MODEL;
  const explicitProvider = options.provider ?? process.env.AI_PROVIDER;

  if (!explicitApiKey || !explicitBaseURL || !explicitModel) {
    return null;
  }

  return {
    apiKey: explicitApiKey,
    baseURL: explicitBaseURL,
    model: explicitModel,
    provider: explicitProvider ?? 'OpenAI-compatible',
  };
}

function parseJsonWithSchema<TSchema extends z.ZodTypeAny>(content: string, schema: TSchema) {
  const jsonContent = content
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const parsedContent = JSON.parse(jsonContent);

  try {
    return schema.parse(parsedContent) as z.infer<TSchema>;
  } catch (error) {
    throw new Error(
      `AI response did not match the expected schema: ${JSON.stringify(parsedContent).slice(0, 2000)}`,
      { cause: error },
    );
  }
}

export function createAiClient(options: AiClientOptions = {}) {
  const resolved = resolveAiOptions(options);

  if (!resolved) {
    return null;
  }

  const provider = createOpenAI({
    apiKey: resolved.apiKey,
    baseURL: resolved.baseURL,
    headers: {
      'HTTP-Referer': 'https://github.com/TianJianJun0727/ycloud-icons',
      'X-Title': 'YCloud Icons Metadata',
    },
  });

  return {
    model: resolved.model,
    provider: resolved.provider,
    async completeJson<TSchema extends z.ZodTypeAny>(
      input: string,
      _schemaName: string,
      schema: TSchema,
    ) {
      const response = await generateText({
        model: provider(resolved.model),
        system:
          options.systemPrompt ?? 'Return only a valid JSON object. Do not wrap it in Markdown.',
        prompt: input,
        output: Output.json({ name: _schemaName }),
        temperature: 0,
      });

      if (response.output) {
        return schema.parse(response.output) as z.infer<TSchema>;
      }

      if (!response.text) {
        throw new Error('AI response did not include JSON content.');
      }

      return parseJsonWithSchema(response.text, schema);
    },
  } satisfies AiClient;
}
