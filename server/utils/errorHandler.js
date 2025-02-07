export class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    console.error(err.stack);
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: isProduction
        ? 'An error occurred. Please try again later.'
        : err.message,
    });
  }

  res.status(500).json({
    message: isProduction
      ? 'Internal Server Error. Please try again later.'
      : err.message,
  });
};
