import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // Regex for email validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 16,
      // match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
      // This regex enforces:
      // - At least one lowercase letter
      // - At least one uppercase letter
      // - At least one number
      // - At least one special character from @$!%*?&
      // - Length between 8 and 16 characters
    },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    image: {
      type: String,
      default:
        'https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?t=st=1730732566~exp=1730736166~hmac=f00212fd96ce5c96daa11d1f0acc6dadb08153181ec840f3cbe9d87d594bd4b4&w=740',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

export default model('User', userSchema);
