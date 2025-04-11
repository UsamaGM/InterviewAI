import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../utils/types";
import { useAuth } from "../../context/AuthContext";
import { useInterview } from "../../context/InterviewContext";
import {
  ErrorAlert,
  LoadingSpinner,
  InputBox,
  DatetimeSelector,
} from "../common";

interface FormType {
  selectedCandidate: User | null;
  candidateEmail: string;
  email: string;
  scheduleTime: string;
  inviteMode: "existing" | "new" | null;
}

function InviteCandidate() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormType>({
    selectedCandidate: null,
    candidateEmail: "",
    email: "",
    scheduleTime: "",
    inviteMode: null,
  });
  const navigate = useNavigate();
  const {
    candidates,
    fetchCandidates,
    loading: { fetchingCandidates },
    error: { fetchingCandidates: fetchCandidateError },
  } = useAuth();
  const {
    inviteCandidate,
    loading: { invitingCandidate },
    error: { invitingCandidate: inviteError },
  } = useInterview();

  useEffect(() => {
    async function init() {
      await fetchCandidates();
    }

    init();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (formData.inviteMode === "existing") {
      if (!formData.selectedCandidate) return;

      await inviteCandidate(id!, {
        email: formData.selectedCandidate.email,
        scheduledTime: formData.scheduleTime,
      });
    } else {
      if (!formData.candidateEmail) return;

      await inviteCandidate(id!, {
        email: formData.candidateEmail,
        scheduledTime: formData.scheduleTime,
      });
    }

    navigate("/recruiter/dashboard");
  }

  if (fetchingCandidates) return <LoadingSpinner size="lg" />;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {fetchCandidateError && (
        <ErrorAlert
          title="Failed to fetch candidates"
          subtitle="Check your internet connection or try later"
        />
      )}
      <h3 className="text-xl font-semibold mb-4">Invite Candidate</h3>

      <div className="mb-4">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${
              formData.inviteMode === "existing"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() =>
              setFormData((prev) => ({ ...prev, inviteMode: "existing" }))
            }
          >
            Existing Candidate
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              formData.inviteMode === "new"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() =>
              setFormData((prev) => ({ ...prev, inviteMode: "new" }))
            }
          >
            New Candidate
          </button>
        </div>
      </div>

      {inviteError && (
        <ErrorAlert
          title="Failed to invite candidate"
          subtitle="Please check your internet or try again later"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {formData.inviteMode === "existing" ? (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Candidate
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.selectedCandidate?._id}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  selectedCandidate:
                    candidates.find((c) => c._id === e.target.value) || null,
                }))
              }
            >
              <option value="">Select a candidate</option>
              {candidates.map((candidate) => (
                <option key={candidate._id} value={candidate._id}>
                  {candidate.name} ({candidate.email})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <InputBox
            id="candidateEmail"
            type="email"
            placeholder="Candidate Email"
            value={formData.candidateEmail}
            onChange={(e) =>
              setFormData({ ...formData, candidateEmail: e.target.value })
            }
          />
        )}

        <DatetimeSelector
          id="scheduledTime"
          placeholder="Interview Date & Time"
          value={formData.scheduleTime}
          onChange={(value) =>
            setFormData({ ...formData, scheduleTime: value })
          }
        />

        <button
          type="submit"
          disabled={invitingCandidate}
          className={`w-full md:w-auto px-6 py-2 rounded-md text-white font-medium transition-colors duration-200 ${
            invitingCandidate
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {invitingCandidate ? <LoadingSpinner size="sm" /> : "Send Invitation"}
        </button>
      </form>
    </div>
  );
}

export default InviteCandidate;
