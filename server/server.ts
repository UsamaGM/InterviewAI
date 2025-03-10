import dotenv from "dotenv";
import app from "./app";
import { scheduleInterviewReminders } from "./services/schedulingService";

dotenv.config();
const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	scheduleInterviewReminders();
});
