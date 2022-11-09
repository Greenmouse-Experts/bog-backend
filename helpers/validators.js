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
    check("userType", "Enter The user type").notEmpty(),
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

const resetPasswordValidation = () => {
  return [
    check("email", "Please use a valid Email").isEmail(),
    check("token", "Reset tooken is required").notEmpty(),
    check(
      "password",
      "Please enter a password with 5 or more characters"
    ).isLength({ min: 5 })
  ];
};

const changePasswordValidation = () => {
  return [
    check("oldPassword", "Please enter the Old Password").notEmpty(),
    check("newPassword", "Please enter new Password").notEmpty(),
    check("confirmPassword", "Confirm new Password").notEmpty()
  ];
};

const bankValidation = () => {
  return [
    check("bank_code", "Please Select a bank").notEmpty(),
    check("bank_name", "Please Select a bank").notEmpty(),
    check("account_number", "Please enter Account number").notEmpty(),
    check("account_name", "Please enter Account name").notEmpty()
  ];
};

const categoryValidation = () => {
  return [check("name", "Please Enter category name").notEmpty()];
};

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  resetPasswordValidation,
  changePasswordValidation,
  bankValidation,
  categoryValidation
};
