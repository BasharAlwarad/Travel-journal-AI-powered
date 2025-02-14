import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { PassThrough } from 'stream';
import { CustomError } from './errorHandler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

class StreamMock {
  constructor(words) {
    this.words = words;
    this.iterator = this[Symbol.asyncIterator];
    this.controller = new AbortController();
  }

  async *[Symbol.asyncIterator]() {
    for (let [i, v] of this.words.entries()) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (this.controller.signal.aborted) {
        break;
      }
      if (i === this.words.length - 1) {
        yield {
          id: 'chatcmpl-UNIQUEID',
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: 'gpt-3.5-mock',
          system_fingerprint: 'fp_c2295e73ad',
          choices: [
            {
              index: 0,
              delta: { content: `${v} ` },
              logprobs: null,
              finish_reason: 'stop',
            },
          ],
        };
      } else {
        yield {
          id: 'chatcmpl-UNIQUEID',
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: 'gpt-3.5-mock',
          system_fingerprint: 'fp_c2295e73ad',
          choices: [
            {
              index: 0,
              delta: { content: `${v} ` },
              logprobs: null,
              finish_reason: null,
            },
          ],
        };
      }
    }
  }
}

class ChatMock {
  completions = {
    create({ messages, model, stream }) {
      if (!model)
        throw new CustomError('400 you must provide a model parameter', 400);
      if (!messages)
        throw new CustomError(
          "400 Missing required parameter: 'messages'",
          400
        );

      const text =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
      if (stream) {
        return new StreamMock(text.split(' '));
      } else {
        return {
          id: 'chatcmpl-9GkKWpvJxL7CCdq3xulB1WIgH4oLT',
          object: 'chat.completion',
          created: 1713778368,
          model: 'gpt-3.5-turbo-0125',
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: text,
              },
              logprobs: null,
              finish_reason: 'stop',
            },
          ],
          usage: { prompt_tokens: 27, completion_tokens: 29, total_tokens: 56 },
          system_fingerprint: 'fp_c2295e73ad',
        };
      }
    },
  };
}

class ImageMock {
  async generate({ ...request }) {
    const { size, response_format, prompt, ...rest } = request;
    let width = 1024;
    let height = 1024;
    if (size) {
      const [w, h] = size.split('x');
      width = parseInt(w);
      height = parseInt(h);
    }
    const data = [
      {
        revised_prompt: prompt,
      },
    ];
    const url = `https://placedog.net/${width}/${height}?r`;
    if (response_format === 'b64_json') {
      const res = await fetch(`https://placedog.net/${width}/${height}?r`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      data[0].b64_json = base64;
      return { data };
    }
    data[0].url = url;
    return { data };
  }
}

class AudioMock {
  speech = {
    async create() {
      const filePath = join(__dirname, '../rr.mp3');
      const rr = await readFile(filePath);
      const passThrough = new PassThrough();
      passThrough.write(rr);
      passThrough.end();
      return { body: passThrough };
    },
  };
}

class OpenAIMock {
  constructor() {}

  chat = new ChatMock();
  images = new ImageMock();
  audio = new AudioMock();
}

export default OpenAIMock;
