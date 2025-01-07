const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong, please try again later.",
    error: err.stack,
  });
};

module.exports = errorHandler;
