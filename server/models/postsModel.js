import { Schema, model } from 'mongoose';

const postSchema = new Schema(
  {
    text: { type: String, required: true },
    image: {
      type: String,
      default:
        'https://plus.unsplash.com/premium_photo-1669295395768-6ef852fddc90?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww',
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

export default model('Post', postSchema);
