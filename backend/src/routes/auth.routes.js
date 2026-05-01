const express = require("express");
const validators = require("../validators/auth.validators.js");
const authControllers = require("../controllers/auth.controller.js");

const router = express.Router();

/* POST /api/auth/register  */
router.post(
    "/register",
    validators.registerUserValidations,
    authControllers.registerUser,
);

/* POST /api/auth/login */
/* GET /api/auth/me */

module.exports = router;
