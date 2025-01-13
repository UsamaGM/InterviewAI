const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");

const protect = require("./middleware/authMiddleware.js");

const auth = require("./routes/authRoutes.js");
const interviews = require("./routes/interviews.js");
const questions = require("./routes/questions.js");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => res.json({ message: "Connected to server" }));

app.use("/api/auth", auth);
app.use("/api/interviews", protect, interviews);
app.use("/api/questions", protect, questions);

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port: ${port}`));
