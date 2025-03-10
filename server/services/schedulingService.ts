import cron from "node-cron";
import Interview from "../models/Interview";
import { sendEmail } from "./emailService";
import User from "../models/User";

export const scheduleInterviewReminders = () => {
	cron.schedule("* * * * *", async () => {
		// Run every minute (adjust cron expression as needed)
		const now = new Date();
		const reminderTime = new Date(now.getTime() + 15 * 60000); // 15 minutes before

		try {
			const interviews = await Interview.find({
				scheduledTime: { $lte: reminderTime, $gt: now },
				status: "scheduled",
			})
				.populate("recruiter")
				.populate("candidate");

			for (const interview of interviews) {
				if (interview.recruiter && interview.candidate) {
					const recruiter = interview.recruiter as any;
					const candidate = interview.candidate as any;

					const recruiterEmail = recruiter.email;
					const candidateEmail = candidate.email;

					const subject = `Interview Reminder: ${interview.title}`;
					const html = `
                        <p>This is a reminder for your interview: ${interview.title}.</p>
                        <p>Scheduled Time: ${interview.scheduledTime}</p>
                    `;

					if (recruiterEmail) {
						await sendEmail(recruiterEmail, subject, html);
					}
					if (candidateEmail) {
						await sendEmail(candidateEmail, subject, html);
					}
				}
			}
		} catch (error) {
			console.error("Error scheduling reminders:", error);
		}
	});
};
