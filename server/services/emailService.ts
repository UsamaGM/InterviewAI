import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";
import { IInterview } from "../models/Interview";

dotenv.config();

const transporter: Transporter = nodemailer.createTransport({
  service: "gmail", // Or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

const sendInterviewReminder = async (to: string, interview: IInterview) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Interview Reminder: ${interview.title}`,
    text: `Your interview "${interview.title}" is scheduled for ${interview.scheduledTime}.`,
  };

  await transporter.sendMail(mailOptions);
};

export { sendEmail, sendInterviewReminder };
