const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: ["admin", "agent", "customer"],
            default: "customer",
        },
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
