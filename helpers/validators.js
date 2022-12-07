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

const productValidation = () => {
  return [
    check("categoryId", "Please Select the category of product").isUUID(),
    check("name", "Please Enter a name").notEmpty(),
    check("description", "Please Enter a description").notEmpty(),
    check("price", "Please enter the product price").isNumeric(),
    check("quantity", "Please enter the quanity available").isNumeric(),
    check(
      "unit",
      "Please enter the unit measurement for this product"
    ).notEmpty()
  ];
};

const productApprovalValidation = () => {
  return [
    check("productId", "Product id is required").isUUID(),
    check("status", "Please approval status").notEmpty()
  ];
};

const orderValidation = () => {
  return [
    check("products", "Product is required").isArray(),
    check("shippingAddress", "Shipping address is required").notEmpty()
  ];
};

const updateOrderValidation = () => {
  return [
    check("orderId", "Order Id is required").isUUID(),
    check("status", "Order status is required").notEmpty()
  ];
};

const updateOrderRequestValidation = () => {
  return [
    check("requestId", "Request Id is required").isUUID(),
    check("status", "Order status is required").notEmpty()
  ];
};

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  resetPasswordValidation,
  changePasswordValidation,
  bankValidation,
  categoryValidation,
  productValidation,
  productApprovalValidation,
  orderValidation,
  updateOrderValidation,
  updateOrderRequestValidation
};
