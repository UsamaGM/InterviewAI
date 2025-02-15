import API from "./api";

export const fetchInterviews = async () => {
  const response = await API.get("/interviews");
  return response.data;
};

export const addInterview = async (interviewData) => {
  const response = await API.post("/interviews", interviewData);
  return response.data;
};

export const updateInterview = async (id, interviewData) => {
  const response = await API.put(`/interviews/${id}`, interviewData);
  return response.data;
};

export const deleteInterview = async (id) => {
  await API.delete(`/interviews/${id}`);
};
