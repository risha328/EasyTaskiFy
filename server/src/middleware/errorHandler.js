export const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error [${req.method} ${req.url}]:`, err.stack || err.message);

  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res, next) => {
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  res.status(404).json({
    status: 'fail',
    message: `Resource not found - ${req.originalUrl}`,
  });
};
