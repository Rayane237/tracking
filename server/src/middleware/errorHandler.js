export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route introuvable: ${req.originalUrl}`));
}

export function errorHandler(err, _req, res, _next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Erreur serveur',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}

