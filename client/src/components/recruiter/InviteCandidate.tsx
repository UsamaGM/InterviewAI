import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ErrorAlert,
  LoadingSpinner,
  InputBox,
  DatetimeSelector,
  Dropdown,
} from "../common";
import { User } from "../../utils/types";
import { Option } from "../common/Dropdown";
import useAuth from "../../hooks/useAuth";
import useInterview from "../../hooks/useInterview";

interface FormType {
  selectedCandidate: User | null;
  candidateEmail: string;
  email: string;
  scheduleTime: string;
  inviteMode: "existing" | "new";
}

function InviteCandidate() {
  const [formData, setFormData] = useState<FormType>({
    selectedCandidate: null,
    candidateEmail: "",
    email: "",
    scheduleTime: "",
    inviteMode: "existing",
  });

  const {
    fetchCandidates,
    loading: { fetchingCandidates },
    error: { fetchingCandidates: fetchCandidateError },
  } = useAuth();

  const {
    error: { invitingCandidate: inviteError },
  } = useInterview();

  useEffect(() => {
    (async () => await fetchCandidates())();
  }, [fetchCandidates]);

  if (fetchingCandidates) return <LoadingSpinner size="lg" />;

  return (
    <div className="bg-white/80 backdrop-blur-md max-w-2xl mx-auto p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Invite Candidate</h3>
      {fetchCandidateError && (
        <ErrorAlert
          title="Failed to fetch candidates"
          subtitle="Check your internet connection or try later"
        />
      )}
      {inviteError && (
        <ErrorAlert
          title="Failed to invite candidate"
          subtitle="Please check your internet or try again later"
        />
      )}

      {NewExistingToggle()}

      <InviteForm formData={formData} setFormData={setFormData} />
    </div>
  );

  function NewExistingToggle() {
    return (
      <div className="mb-4 flex items-center justify-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.inviteMode === "new"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                inviteMode: e.target.checked ? "new" : "existing",
              }))
            }
            className="sr-only peer"
          />
          <div className="w-[200px] h-10 bg-blue-100 shadow-md rounded-md relative" />
          <div
            className={`absolute top-0.5 bg-blue-300 rounded-md h-9 w-[99px] transition-transform duration-300 ease-in-out transform ${
              formData.inviteMode === "new"
                ? "translate-x-[calc(197.5px-100%)]"
                : "translate-x-0.5"
            }`}
          />
          <div className="absolute inset-0 flex items-center justify-between text-sm font-medium">
            <span
              className={`flex-1 text-center transition-all duration-300 ease-in-out transform ${
                formData.inviteMode === "existing"
                  ? "text-blue-700 font-semibold text-[1rem]"
                  : "text-blue-500"
              }`}
            >
              Existing
            </span>
            <span
              className={`flex-1 text-center transition-all duration-300 ease-in-out ${
                formData.inviteMode === "new"
                  ? "text-blue-700 font-semibold text-[1rem]"
                  : "text-blue-500"
              }`}
            >
              New
            </span>
          </div>
        </label>
      </div>
    );
  }
}

const InviteForm = React.memo(function InviteForm({
  formData,
  setFormData,
}: {
  formData: FormType;
  setFormData: React.Dispatch<React.SetStateAction<FormType>>;
}) {
  const { id } = useParams<{ id: string }>();
  const { candidates } = useAuth();
  const {
    inviteCandidate,
    loading: { invitingCandidate },
  } = useInterview();
  const navigate = useNavigate();

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

  return (
    <form onSubmit={handleSubmit} className="space-y-8 mt-8">
      {formData.inviteMode === "existing" ? (
        <>
          <Dropdown
            id="candidate"
            placeholder="Select Candidate"
            value={formData.selectedCandidate?.email || ""}
            options={candidates.map(
              (candidate): Option => ({
                label: `${candidate.name} (${candidate.email})`,
                value: candidate.email,
              })
            )}
            onChange={(value) => {
              const selected = candidates.find((c) => c.email === value);
              setFormData({ ...formData, selectedCandidate: selected || null });
            }}
          />
          <div className="max-h-[1px]" />
        </>
      ) : (
        <InputBox
          id="candidateEmail"
          type="email"
          placeholder="Candidate Email"
          value={formData.candidateEmail}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              candidateEmail: e.target.value,
            }))
          }
        />
      )}

      <DatetimeSelector
        id="scheduledTime"
        placeholder="Interview Date & Time"
        value={formData.scheduleTime}
        onChange={(value) => setFormData({ ...formData, scheduleTime: value })}
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
  );
});

export default InviteCandidate;
