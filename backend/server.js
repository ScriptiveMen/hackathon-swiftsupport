require("dotenv").config();
const http = require("http");
const app = require("./src/app.js");
const connectDB = require("./src/db/db.js");
const initSocket = require("./src/socket.js");

connectDB();

const server = http.createServer(app);
const io = initSocket(server);
app.set("socketio", io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
