import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import { handleError } from "../../../utils/errorHandler";
import InputBox from "../../InputBox/InputBox";
import RotatingButton from "../../Buttons/RotatingButton";
import DateTimeSelector from "../../DateTimeSelector/DateTimeSelector";

interface InviteCandidateProps {
  interviewId: string;
  onSuccess: () => void;
}

interface Candidate {
  _id: string;
  name: string;
  email: string;
}

const InviteCandidate: React.FC<InviteCandidateProps> = ({ interviewId, onSuccess }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [candidateEmail, setCandidateEmail] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteMode, setInviteMode] = useState<"existing" | "new">("existing");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await api.get("/users/candidates");
        setCandidates(response.data);
      } catch (error) {
        setError(handleError(error, "Failed to fetch candidates"));
      }
    };

    fetchCandidates();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (inviteMode === "existing") {
        if (!selectedCandidate) {
          setError("Please select a candidate");
          return;
        }
        
        await api.post(`/interviews/${interviewId}/schedule`, {
          candidateId: selectedCandidate,
          scheduledTime: new Date(scheduledTime).toISOString()
        });
      } else {
        if (!candidateEmail) {
          setError("Please enter candidate email");
          return;
        }
        
        await api.post(`/interviews/${interviewId}/invite`, {
          email: candidateEmail,
          scheduledTime: new Date(scheduledTime).toISOString()
        });
      }
      
      onSuccess();
    } catch (error) {
      setError(handleError(error, "Failed to invite candidate"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Invite Candidate</h3>
      
      <div className="mb-4">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${
              inviteMode === "existing" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setInviteMode("existing")}
          >
            Existing Candidate
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              inviteMode === "new" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setInviteMode("new")}
          >
            New Candidate
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {inviteMode === "existing" ? (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Candidate
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCandidate}
              onChange={(e) => setSelectedCandidate(e.target.value)}
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
            value={candidateEmail}
            onChange={(e) => setCandidateEmail(e.target.value)}
          />
        )}
        
        <DateTimeSelector
          id="scheduledTime"
          placeholder="Interview Date & Time"
          value={scheduledTime}
          onChange={(value) => setScheduledTime(value || "")}
        />
        
        <div className="flex justify-end">
          <RotatingButton
            type="submit"
            disabled={loading}
            disabledTitle="Sending Invitation..."
            enabledTitle="Send Invitation"
          />
        </div>
      </form>
    </div>
  );
};

export default InviteCandidate; 