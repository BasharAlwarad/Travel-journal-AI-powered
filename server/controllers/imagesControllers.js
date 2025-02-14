import OpenAI from 'openai';
import OpenAIMock from '../utils/OpenAIMock.js';
import asyncHandler from '../utils/asyncHandler.js';
import { apiKey } from '../config/config.js';

export const createImage = asyncHandler(async (req, res) => {
  const {
    body: { ...request },
  } = req;

  let openai;
  const mode = 'production';
  mode === 'production'
    ? (openai = new OpenAI({ apiKey }))
    : (openai = new OpenAIMock());
  const image = await openai.images.generate({
    ...request,
  });
  res.json(image.data);
});
