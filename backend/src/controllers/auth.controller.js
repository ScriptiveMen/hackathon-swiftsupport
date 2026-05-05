const userModel = require("../models/user.model.js");
const organizationModel = require("../models/organization.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  try {
    const { name, email, password, role, organizationName } = req.body;
    const normalizedRole = String(role || "customer").toLowerCase();

    // 1. Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let organizationId;

    // 2. Handle organization based on role
    if (normalizedRole === "admin") {
      // Admin: create a new organization
      if (!organizationName) {
        return res.status(400).json({
          message: "Organization name is required for admin registration",
        });
      }

      const existingOrganization = await organizationModel.findOne({
        name: { $regex: new RegExp(`^${organizationName}$`, "i") }, //case‑insensitive search to avoid "Acme Corp" and "acme corp" being treated as different
      });

      if (existingOrganization) {
        return res
          .status(400)
          .json({ message: "Organization name already exists" });
      }

      const organization = await organizationModel.create({
        name: organizationName,
      });
      organizationId = organization._id;
    } else if (normalizedRole === "agent" || normalizedRole === "customer") {
      // Agent/Customer: select existing organization by name
      if (!organizationName) {
        return res
          .status(400)
          .json({ message: "Organization name is required" });
      }
      const organization = await organizationModel.findOne({
        name: organizationName,
      });

      if (!organization) {
        return res
          .status(400)
          .json({ message: "Invalid organization selected" });
      }

      organizationId = organization._id;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    // 3. Create the user (use the role from request, not hardcoded)
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
      organizationId,
      isActive: true,
    });

    // 4. If admin, set ownerId on the newly created organization
    if (normalizedRole === "admin") {
      await organizationModel.findByIdAndUpdate(organizationId, {
        ownerId: user._id,
      });
    }

    // 5. Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        organizationId: user.organizationId,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" },
    );

    // 6. Set cookie (development-friendly)
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // false in development (localhost)
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 7. Send response (use `user` variable, not `newUser`)
    return res.status(201).json({
      message: "User registered successfully",
      token, // ← Add token here
      user: {
        id: user._id,
        organizationId: user.organizationId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Registration failed: ${error.message}` });
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid email or password" });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        status: false,
        message: "Account is disabled. Please contact admin.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        organizationId: user.organizationId,
        role: user.role, // Added role to payload for consistency
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" },
    );

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: true,
      message: "Login successful",
      token, // ← Add token here
      user: {
        id: user._id,
        organizationId: user.organizationId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("login Error", error);
    return res.status(500).json({
      status: false,
      message: `Login Error: ${error.message}`,
    });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { userId, organizationId } = req.user.userId;

    const user = await userModel.findById(userId);

    if (
      !user ||
      user.organizationId.toString() !== organizationId.toString() ||
      user.role === "customer" ||
      user.role === "agent"
    ) {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized access" });
    }

    await userModel.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Delete User Error: ${error.message}`,
    });
  }
};

const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await organizationModel.find().select("name ownerId");

    res
      .status(200)
      .json({ status: true, data: organizations, count: organizations.length });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Get Organizations Error: ${error.message}`,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId, organizationId } = req.user;

    const user = await userModel.findById(userId);

    if (!user || user.organizationId.toString() !== organizationId.toString()) {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized access" });
    }

    res.status(200).json({ status: true, data: user });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: `Get User Error: ${error.message}` });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { userId, organizationId } = req.user;

    const user = await userModel.findById(userId);

    if (!user || user.organizationId.toString() !== organizationId.toString()) {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized access" });
    }

    const users = await userModel.find({organizationId}).select("-password");

    res.status(200).json({ status: true, data: users, count: users.length });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: `Get Users Error: ${error.message}` });
  }
};

const getAllAgents = async (req, res) => {
  try {
    const { userId, organizationId } = req.user;

    const user = await userModel.findById(userId);

    if (
      !user ||
      user.organizationId.toString() !== organizationId.toString() ||
      user.role === "customer"
    ) {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized access" });
    }

    const agents = await userModel
      .find({ role: "agent", organizationId })
      .select("-password");

    res.status(200).json({ status: true, data: agents });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: `Get Agents Error: ${error.message}` });
  }
};

module.exports = {
  registerUser,
  loginUser,
  deleteUser,
  getAllOrganizations,
  getUserById,
  getAllUsers,
  getAllAgents,
};
