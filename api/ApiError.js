export default class ApiError extends Error {
  constructor(message, statusCode, errorContent) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);

    this.statusCode = statusCode;
    this.errorContent = errorContent;
  }
}
