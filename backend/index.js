const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const protect = require("./middleware/authMiddleware.js");
const auth = require("./routes/authRoutes.js");
const users = require("./routes/userRoutes.js");
const candidates = require("./routes/candidateRoutes.js");
const interviews = require("./routes/interviewRoutes.js");
const questions = require("./routes/questionRoutes.js");
const activity = require("./routes/activityRoutes.js");
const stats = require("./routes/statsRoutes.js");

const connectDB = require("./config/db.js");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => res.json({ message: "Connected to server" }));

app.use("/api/auth", auth);
app.use("/api/users", protect, users);
app.use("/api/candidates", protect, candidates);
app.use("/api/interviews", protect, interviews);
app.use("/api/questions", protect, questions);
app.use("/api/activity", protect, activity);
app.use("/api/stats", protect, stats);

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port: ${port}`));
