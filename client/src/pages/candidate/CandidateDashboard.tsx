import MainLayout from "../../components/layouts/MainLayout";
import CandidateInterviewList from "../../components/candidate/CandidateInterviewList";
import { InterviewProvider } from "../../context/InterviewProvider";

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
