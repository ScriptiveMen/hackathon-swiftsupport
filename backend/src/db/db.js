const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB is connected sucessfully");
    } catch (err) {
        console.log("Error connecting mongodb: ", err);
    }
}

module.exports = connectDB;
