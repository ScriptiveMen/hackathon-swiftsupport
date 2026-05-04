require("dotenv").config();
const mongoose = require("mongoose");
const userModel = require("./src/models/user.model");

async function fixUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const result = await userModel.updateMany(
      { role: { $ne: "admin" } },
      { $set: { isActive: true } }
    );

    console.log(`Updated ${result.modifiedCount} users to isActive: true`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixUsers();
