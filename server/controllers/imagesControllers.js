import OpenAI from 'openai';
import OpenAIMock from '../utils/OpenAIMock.js';
import asyncHandler from '../utils/asyncHandler.js';
import { apiKey, mode } from '../config/config.js';

export const createImage = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  let openai;
  mode === 'production'
    ? (openai = new OpenAI({ apiKey }))
    : (openai = new OpenAIMock());
  const image = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    size: '1024x1024',
    response_format: 'b64_json',
  });
  res.json(image.data);
});
