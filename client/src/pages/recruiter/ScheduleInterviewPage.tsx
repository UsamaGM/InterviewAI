import ScheduleInterviewForm from "../../components/recruiter/ScheduleInterviewForm";
import { useInterview } from "../../context/InterviewContext";
import { LoadingSpinner } from "../../components/common";
import MainLayout from "../../components/layouts/MainLayout";

function ScheduleInterviewPage() {
  const {
    selectedInterview,
    loading: { fetchingInterviews },
  } = useInterview();

  if (selectedInterview && fetchingInterviews) {
    return <LoadingSpinner fullScreen size="lg" />;
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        {selectedInterview ? (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {selectedInterview.title}
              </h1>
              <p className="text-gray-600 mt-2">
                {selectedInterview.description}
              </p>
              <p className="text-gray-600 mt-1">
                <span className="font-semibold">Job Role:</span>{" "}
                {selectedInterview.jobRole}
              </p>
            </div>
            <ScheduleInterviewForm interviewId={selectedInterview._id} />
          </>
        ) : (
          <ScheduleInterviewForm />
        )}
      </div>
    </MainLayout>
  );
}

export default ScheduleInterviewPage;
