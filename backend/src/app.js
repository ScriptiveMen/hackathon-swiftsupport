const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes.js");
const ticketRoutes = require("./routes/ticket.routes.js");
const knowledgeRoutes = require("./routes/knowledge.routes.js");
const aiRoutes = require("./routes/ai.routes.js");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/ai", aiRoutes);

module.exports = app;
