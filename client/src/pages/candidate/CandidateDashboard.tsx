import { InterviewProvider } from "../../context/InterviewContext";
import CandidateInterviewList from "../../components/candidate/CandidateInterviewList";
import MainLayout from "../../components/layouts/MainLayout";

function CandidateDashboardPage() {
  return (
    <InterviewProvider>
      <MainLayout>
        <CandidateInterviewList />
      </MainLayout>
    </InterviewProvider>
  );
}

export default CandidateDashboardPage;
