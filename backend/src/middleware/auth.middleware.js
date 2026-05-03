const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const getUser = await userModel.findById(decoded.userId);

        if (!getUser) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        req.user = {
            userId: getUser._id,
            organizationId: getUser.organizationId,
        };

        next();

    } catch (error) {
        res.status(401).json({
            status: false,
            message: `Unauthorized: ${error.message}`,
        });
    }
}

module.exports = authMiddleware;