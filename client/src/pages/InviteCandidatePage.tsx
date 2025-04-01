import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import InviteCandidate from "../components/Interview/InviteCandidate/InviteCandidate";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const InviteCandidatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    navigate(`/interviews/${id}/details`);
  };
  
  return (
    <>
      <Header />
      <div className="flex justify-center min-h-[calc(100vh-125px)] items-center p-6">
        <div className="w-full max-w-2xl">
          <InviteCandidate interviewId={id!} onSuccess={handleSuccess} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InviteCandidatePage; 