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

const ticketValidations = [
    body("title")
        .isString()
        .withMessage("Title must be a string")
        .isLength({ min: 4 })
        .withMessage("Title must be at least 4 characters long")
        .trim(),

    body("description")
        .isString()
        .withMessage("Description must be a string")
        .isLength({ min: 10 })
        .withMessage("Description must be at least 10 characters long")
        .trim(),

    body("status")
        .optional()
        .isString()
        .withMessage("Status must be a string")
        .isIn(["open", "in-progress", "resolved"])
        .withMessage("Status must be one of: open, in-progress, resolved")
        .trim(),

    body("priority")
        .isString()
        .withMessage("Priority must be a string")
        .isIn(["low", "medium", "high"])
        .withMessage("Priority must be one of: low, medium, high")
        .trim(),

    respondWithValidationErrors,
];

module.exports = {
    ticketValidations,
};
