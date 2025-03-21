import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Interview } from "../utils/types";
import { handleError } from "../utils/errorHandler";
import api from "../services/api";

const InterviewList: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get("/interviews");
        setInterviews(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError(handleError(error, "Failed to fetch interviews"));
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto flex-grow max-w-3xl">
        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <ul className="space-y-2">
            {interviews.length > 0 ? (
              interviews.map((interview) => (
                <li
                  key={interview._id}
                  className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
                >
                  <Link
                    to={`/interviews/${interview._id}`}
                    className="flex-grow"
                  >
                    <div>
                      <h3 className="font-semibold">{interview.title}</h3>
                      <p className="text-gray-600">{interview.description}</p>
                    </div>
                  </Link>
                  <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-xs">
                    <button
                      className="inline-block border-e p-3 text-gray-700 hover:bg-gray-50 focus:relative"
                      title="Edit Product"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>

                    <button
                      className="inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative"
                      title="Delete Product"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </span>
                </li>
              ))
            ) : (
              <p className="text-center mt-4">
                No interviews yet! Let's create some.
              </p>
            )}
          </ul>
        )}
        <button
          onClick={() => navigate("/interviews/new")}
          className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default InterviewList;
