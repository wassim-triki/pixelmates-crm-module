const validateSchema = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body); // Mutates request body with validated data
    next();
  } catch (error) {
    res.status(400).json({ message: error.errors });
  }
};

module.exports = validateSchema;
