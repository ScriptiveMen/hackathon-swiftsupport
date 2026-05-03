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
        .withMessage("Name must be a string").bail()
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters long").bail(),

    body("email").trim().isEmail().withMessage("Valid email is required").bail(),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long").bail(),

    respondWithValidationErrors,
];

const loginUserValidations = [
    body("email").isEmail().withMessage("Valid email is required").bail(),,

    body("password").notEmpty().withMessage("Password is required").bail(),,

    respondWithValidationErrors,
];

module.exports = {
    registerUserValidations,
    loginUserValidations,
};
