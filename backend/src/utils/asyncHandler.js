// Envolve controllers assíncronos para encaminhar erros ao errorHandler.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
