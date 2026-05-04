const express = require("express");
const validators = require("../validators/auth.validators.js");
const authControllers = require("../controllers/auth.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

const router = express.Router();

/* POST /api/auth/register  */
router.post(
  "/register",
  validators.registerUserValidations,
  authControllers.registerUser,
);

/* POST /api/auth/login */
router.post(
  "/login",
  validators.loginUserValidations,
  authControllers.loginUser,
);

/* GET /api/auth/getUserById */
router.get("/getUser", authMiddleware, authControllers.getUserById);

/* DELETE /api/auth/delete */
router.delete("/delete/:id", authMiddleware, authControllers.deleteUser);

/* GET /api/auth/organizations */
router.get(
  "/organizations",
  authControllers.getAllOrganizations,
);

router.get("/getAllUsers", authMiddleware, authControllers.getAllUsers);
router.get("/users", authMiddleware, authControllers.getAllUsers);

// Get All agents
router.get("/getAllAgents", authMiddleware, authControllers.getAllAgents);
router.get("/agents", authMiddleware, authControllers.getAllAgents);

module.exports = router;
