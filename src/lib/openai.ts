import OpenAI from 'openai';

const globalForOpenai = globalThis as unknown as { openai: OpenAI };

export const openai =
  globalForOpenai.openai ??
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? '',
  });

if (process.env.NODE_ENV !== 'production') globalForOpenai.openai = openai;
