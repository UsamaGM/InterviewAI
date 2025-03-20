// import request from "supertest";
// import app from "../app"; // Assuming your Express app is exported from app.ts
// import Interview from "../models/Interview";
// import mongoose from "mongoose";

// describe("Interview Controller", () => {
//   let interviewId: string;

//   beforeAll(async () => {
//     // Connect to the test database
//     await mongoose.connect("mongodb://localhost:27017/interviewAI_test", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   });

//   afterAll(async () => {
//     // Disconnect from the test database
//     await mongoose.disconnect();
//   });

//   beforeEach(async () => {
//     // Create a sample interview
//     const interview = new Interview({
//       title: "Sample Interview",
//       description: "This is a sample interview description",
//       jobRole: "Software Engineer",
//       recruiter: new mongoose.Types.ObjectId(),
//     });
//     const savedInterview = await interview.save();
//     interviewId = savedInterview._id.toString();
//   });

//   afterEach(async () => {
//     // Clean up the test database
//     await Interview.deleteMany({});
//   });

//   it("should create a new interview", async () => {
//     const response = await request(app).post("/interviews").send({
//       title: "New Interview",
//       description: "This is a new interview description",
//       jobRole: "Data Scientist",
//     });

//     expect(response.status).toBe(201);
//     expect(response.body.title).toBe("New Interview");
//   });

//   it("should get all interviews", async () => {
//     const response = await request(app).get("/interviews");

//     expect(response.status).toBe(200);
//     expect(response.body.length).toBeGreaterThan(0);
//   });

//   it("should get an interview by ID", async () => {
//     const response = await request(app).get(`/interviews/${interviewId}`);

//     expect(response.status).toBe(200);
//     expect(response.body._id).toBe(interviewId);
//   });

//   it("should update an interview", async () => {
//     const response = await request(app)
//       .put(`/interviews/${interviewId}`)
//       .send({ title: "Updated Interview" });

//     expect(response.status).toBe(200);
//     expect(response.body.title).toBe("Updated Interview");
//   });

//   it("should delete an interview", async () => {
//     const response = await request(app).delete(`/interviews/${interviewId}`);

//     expect(response.status).toBe(204);
//   });

//   it("should generate AI questions", async () => {
//     const response = await request(app).post(
//       `/interviews/${interviewId}/generate-questions`
//     );

//     expect(response.status).toBe(200);
//     expect(response.body.questions.length).toBeGreaterThan(0);
//   });

//   it("should assess an answer", async () => {
//     const response = await request(app)
//       .post(`/interviews/${interviewId}/assess-answer`)
//       .send({ questionIndex: 0, answerText: "Sample answer" });

//     expect(response.status).toBe(200);
//     expect(response.body.questions[0].aiAssessment).toBeDefined();
//   });

//   it("should rate an interview", async () => {
//     const response = await request(app).post(
//       `/interviews/${interviewId}/rate-interview`
//     );

//     expect(response.status).toBe(200);
//     expect(response.body.score).toBeDefined();
//     expect(response.body.feedback).toBeDefined();
//   });
// });
