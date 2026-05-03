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

const aiResponseValidations = [
    body("question")
        .isString()
        .withMessage("Question must be a string").bail()
        .isLength({ min: 4 })
        .withMessage("Question must be at least 4 characters long").bail()
        .trim(),

    respondWithValidationErrors,
];

const aiSuggestValidations = [
    body("agentDraft")
        .notEmpty()
        .withMessage("Agent draft is required").bail()
        .isString()
        .withMessage("Agent draft must be a string").bail()
        .isLength({ min: 4 })
        .withMessage("Agent draft must be at least 4 characters long").bail()
        .trim(),

    respondWithValidationErrors,
]

module.exports = {
    aiResponseValidations,
    aiSuggestValidations
};
