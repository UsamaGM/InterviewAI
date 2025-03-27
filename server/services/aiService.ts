import axios, { AxiosError } from "axios";
import { IQuestion } from "../models/Interview";

const apiKey = process.env.OPENROUTER_TOKEN;
const baseURL = "https://openrouter.ai/api/v1/chat/completions";

const systemPrompt =
  "You are an AI interviewer conducting an interview. Ask the candidate questions and assess their responses. You always respond with JSON. Do not write any text except the JSON needed.";

async function query(prompt: string) {
  try {
    const response = await axios.post(
      baseURL,
      {
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          { role: "system", content: [{ type: "text", text: systemPrompt }] },
          { role: "user", content: [{ type: "text", text: prompt }] },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.choices) {
      return response.data.choices[0].message.content;
    } else {
      console.log("Connection to the API failed.");
      return;
    }
  } catch (error) {
    if (error instanceof AxiosError)
      console.error("Error in API call: ", error?.message);
    throw error;
  }
}

export const generateQuestions = async (
  jobRole: string,
  interviewDescription: string
): Promise<any[]> => {
  try {
    const prompt = `Generate 5 interview questions for a ${jobRole} position, the description for interview is: ${interviewDescription}. The response should be an array of objects with the pattern: {questionText: "Why are lemons red?"}. Return just this array and nothing else.`;
    const output = await query(prompt);

    if (output) {
      try {
        return JSON.parse(
          output
            .replace(/```(json)?\n?/i, "")
            .replace(/```/i, "")
            .trim()
        );
      } catch (jsonError) {
        console.error("error parsing json", jsonError);
        return [];
      }
    }
    return [];
  } catch (error) {
    console.error(
      `Error generating questions: ${
        error instanceof AxiosError ? error.message : error
      }`
    );

    return [];
  }
};

export const assessAnswer = async (
  questionText: string,
  answerText: string,
  description: string,
  jobRole: string
): Promise<any> => {
  try {
    const prompt = `Assess the following answer to the interview question: '{${questionText}}'\. Answer\: '</span>{${answerText}}'. The job role is ${jobRole} and job description is ${description}. Provide a score (0-10), a list of relevant keywords, a sentiment analysis (positive, negative, neutral), and brief feedback. Format the response as JSON: {"score": ..., "keywords": [...], "sentiment": "...", "feedback": "..."}`;

    const output = await query(prompt);

    if (output) {
      try {
        return JSON.parse(
          output
            .replace(/```(json)?\n?/i, "")
            .replace(/```/i, "")
            .trim()
        );
      } catch (jsonError) {
        console.error("error parsing json", jsonError);
        return {};
      }
    }
    return {};
  } catch (error) {
    console.error("Error assessing answer:", error);
    return {};
  }
};

export const rateInterview = async (
  questions: IQuestion[]
): Promise<{ score: number; feedback: string } | {}> => {
  try {
    const assessments = questions.map((q) => q.aiAssessment);

    const prompt = `Based on the following assessments of interview questions: ${JSON.stringify(
      assessments
    )}. Give a score of the interview from 0 to 10 and give overall feedback. Format the response as JSON: {"score": ..., "feedback": "..."}`;

    const response = await query(prompt);

    try {
      const { score, feedback } = JSON.parse(
        response
          .replace(/```(json)?\n?/i, "")
          .replace(/```/i, "")
          .trim()
      );

      return { score: score, feedback: feedback };
    } catch (jsonError) {
      console.error("error parsing json", jsonError);
      return {};
    }
  } catch (error) {
    console.error("Error rating interview:", error);
    return {};
  }
};
