import OpenAI from 'openai';
import OpenAIMock from '../utils/OpenAIMock.js';
import asyncHandler from '../utils/asyncHandler.js';
import Review from '../models/reviewModel.js';
import Post from '../models/postsModel.js';
import { apiKey, mode, stream } from '../config/config.js';

export const createChat = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  const postId = req.params.id;

  const post = await Post.findById(postId).populate('user', 'name email');
  const reviews = await Review.find({ post: postId }).populate(
    'user',
    'name email'
  );

  let request = {
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are talking to a review bot. Ask it anything.',
      },
      {
        role: 'user',
        content: `1. post: ${
          post.text
        }. 2. users reviews of the post: ${reviews.map(
          (review) => review.text
        )} 3. ${prompt}`,
      },
    ],
    stream,
  };

  let openai;

  mode === 'production'
    ? (openai = new OpenAI({ apiKey }))
    : (openai = new OpenAIMock());

  const completion = await openai.chat.completions.create({
    ...request,
  });

  if (stream) {
    res.writeHead(200, {
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
    });
    for await (const chunk of completion) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
    res.end();
    res.on('close', () => res.end());
  } else {
    res.json(completion.choices[0]);
  }
});
