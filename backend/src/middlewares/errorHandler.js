// Centralized error handler middleware
// dat cuoi cung sau tat ca routes trong server.js
const errorHandler = (err, req, res, next) => {
  // log loi ra console
  console.log(`[ERROR] ${req.method} ${req.originalUrl} ->`, err.message);

  // neu la AppError (loi minh tu throw) -> tra ve status + message
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // loi khong mong muon (bug, db loi...) -> tra 500
  res.status(500).json({
    success: false,
    message: "Lỗi server",
  });
};

module.exports = errorHandler;
