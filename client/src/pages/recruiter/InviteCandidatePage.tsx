import { useParams, useNavigate } from "react-router-dom";
import InviteCandidate from "../../components/recruiter/InviteCandidate";
import MainLayout from "../../components/layouts/MainLayout";

function InviteCandidatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/recruiter/interview-details");
  };

  return (
    <MainLayout>
      <InviteCandidate interviewId={id!} onSuccess={handleSuccess} />
    </MainLayout>
  );
}

export default InviteCandidatePage;
