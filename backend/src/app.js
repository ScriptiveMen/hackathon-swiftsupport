const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const authRoutes = require("./routes/auth.routes.js");
const ticketRoutes = require("./routes/ticket.routes.js");
const knowledgeRoutes = require("./routes/knowledge.routes.js");
const aiRoutes = require("./routes/ai.routes.js");
const chatRoutes = require("./routes/chat.routes.js");

const app = express();

app.disable("x-powered-by");
app.use(helmet());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
);

app.use(hpp());

app.get("/", (req, res) => {
    res.send("Server is up and running 🚀");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: Date.now(),
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;
