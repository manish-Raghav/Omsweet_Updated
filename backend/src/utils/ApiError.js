// A lightweight error class so controllers can throw with an HTTP status
// attached, and the central error middleware knows what code to send.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
