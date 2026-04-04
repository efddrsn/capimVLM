import { GoogleGenAI } from '@google/genai';

let _client: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    _client = new GoogleGenAI({ apiKey });
  }
  return _client;
}

export const MODELS = {
  vision: 'gemini-2.0-flash',
  imageGeneration: 'gemini-3-pro-image-preview',
} as const;
