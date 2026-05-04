require("dotenv").config();
const mongoose = require("mongoose");
const userModel = require("./src/models/user.model");

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await userModel.find({ role: "customer" }).select("name isActive role");
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUsers();
