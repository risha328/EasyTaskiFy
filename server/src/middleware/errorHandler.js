export const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error [${req.method} ${req.url}]:`, err.stack || err.message);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Resource not found - ${req.originalUrl}`,
  });
};
