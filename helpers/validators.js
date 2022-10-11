const { check, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ message: err.msg }));

  return res.status(422).json({
    errors: extractedErrors
  });
};

const registerValidation = () => {
  return [
    check("name", "Name is required").notEmpty(),
    check("email", "Please use a valid Email").isEmail(),
    check(
      "password",
      "Please enter a password with 5 or more characters"
    ).isLength({ min: 5 })
  ];
};

const loginValidation = () => {
  return [
    check("email", "Please use a valid Email").isEmail(),
    check(
      "password",
      "Please enter a password with 5 or more characters"
    ).isLength({ min: 5 })
  ];
};

const thriftGroupValidation = () => {
  return [
    check("name", "Name is required").notEmpty(),
    check("description", "Description is required").notEmpty(),
    check("startAmount", "startAmount is required").isNumeric(),
    check("capacity", "maximum capacity is required").isNumeric(),
    check("isSearchAble", " Is Group searchable?").isBoolean()
  ];
};

const joinGroupValidation = () => {
  return [check("groupId", "Group Id is required").isUUID()];
};

const invitationValidation = () => {
  return [
    check("groupId", "Group Id is required").isUUID(),
    check("email", "Email is required").isEmail()
  ];
};

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  thriftGroupValidation,
  joinGroupValidation,
  invitationValidation
};
