import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ErrorAlert,
  LoadingSpinner,
  InputBox,
  DatetimeSelector,
  Dropdown,
  Toggle,
} from "@/components/common";
import { User } from "@/utils/types";
import { Option } from "@/components/common/Dropdown";
import { useAuth, useInterview } from "@/hooks";

type FormType = {
  selectedCandidate: User | null;
  candidateEmail: string;
  email: string;
  scheduleTime: string;
  inviteMode: "existing" | "new";
};

function InviteCandidatePage() {
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

  const toggleOptions = useMemo(
    () => [
      { label: "existing", value: "Existing" },
      { label: "new", value: "New" },
    ],
    []
  );

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

      <Toggle
        checked={formData.inviteMode === "new"}
        options={toggleOptions}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            inviteMode: e.target.checked ? "new" : "existing",
          }))
        }
      />

      <InviteForm formData={formData} setFormData={setFormData} />
    </div>
  );
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
    error: { invitingCandidate: inviteError },
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

    if (inviteError) return;

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
        className={
          "w-full px-6 py-2 rounded-md bg-blue-200 text-blue-600 hover:bg-blue-300 hover:text-blue-800 cursor-pointer font-semibold shadow transition-colors duration-200"
        }
      >
        {invitingCandidate ? <LoadingSpinner size="sm" /> : "Send Invitation"}
      </button>
    </form>
  );
});

export default InviteCandidatePage;
