require("dotenv").config();
const mongoose = require("mongoose");

async function clearChats() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // Delete all messages
    const messageResult = await mongoose.connection.collection("messages").deleteMany({});
    console.log(`Deleted ${messageResult.deletedCount} messages`);

    // Delete all chats/conversations
    const chatResult = await mongoose.connection.collection("chats").deleteMany({});
    console.log(`Deleted ${chatResult.deletedCount} chats`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

clearChats();
