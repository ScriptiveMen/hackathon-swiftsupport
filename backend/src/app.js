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
const adminRoutes = require("./routes/admin.routes.js");

const app = express();

app.disable("x-powered-by");
app.use(helmet());

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://hackathon-swiftsupport.vercel.app",
    "https://hackathon-swiftsupport-ifvz.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            const isAllowedVercel = origin.includes("hackathon-swiftsupport") && origin.endsWith(".vercel.app");
            if (allowedOrigins.includes(origin) || isAllowedVercel) {
                return callback(null, true);
            } else {
                return callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    }),
);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, // Increased for development
    message: "Too many requests, please try again later.",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
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
app.use("/api/admin", adminRoutes);

module.exports = app;
