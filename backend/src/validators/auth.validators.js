const { body, validationResult } = require("express-validator");

const respondWithValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    next();
};

const registerUserValidations = [
    body("name")
        .isString()
        .withMessage("Name must be a string")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters long"),

    body("email").trim().isEmail().withMessage("Valid email is required"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    respondWithValidationErrors,
];

const loginUserValidations = [
    body("email").isEmail().withMessage("Valid email is required"),

    body("password").notEmpty().withMessage("Password is required"),

    respondWithValidationErrors,
];

module.exports = {
    registerUserValidations,
    loginUserValidations,
};
