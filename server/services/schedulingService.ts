import cron from "node-cron";
import Interview from "../models/Interview";
import { sendEmail } from "./emailService";

export const scheduleInterviewReminders = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const reminderTime = new Date(now.getTime() + 15 * 60000);
    const maxReminderTime = new Date(now.getTime() + 15 * 60000);

    try {
      const interviews = await Interview.find({
        scheduledTime: { $gte: reminderTime, $lte: maxReminderTime },
        status: "scheduled",
      }).populate("candidate", "email");

      for (const interview of interviews) {
        if (interview.candidate) {
          const candidate = interview.candidate as any;

          const candidateEmail = candidate.email;

          const subject = `Interview Reminder: ${interview.title}`;
          const html = `
                        <p>This is a reminder for your interview: ${interview.title}.</p>
                        <p>Scheduled Time: ${interview.scheduledTime}</p>
                    `;
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
