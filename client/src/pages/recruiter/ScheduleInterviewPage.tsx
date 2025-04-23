import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "@/components/common";
import useInterview from "@/hooks/useInterview";
import ScheduleInterviewForm from "@/components/interview/SheduleInterviewForm";

function ScheduleInterviewPage() {
  const { id } = useParams();

  const {
    selectedInterview,
    fetchInterviewWithId,
    loading: { fetchingInterviewWithId },
    error: { fetchingInterviewWithId: fetchError },
  } = useInterview();

  useEffect(() => {
    async function fetchInterview() {
      if (id) await fetchInterviewWithId(id);
    }

    fetchInterview();
  }, [id, fetchInterviewWithId]);

  if (id && fetchingInterviewWithId) return <LoadingSpinner fullScreen />;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {id && selectedInterview && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{selectedInterview.title}</h3>
          <p className="text-gray-600 mt-2">{selectedInterview.description}</p>
        </div>
      )}
      {fetchError && <div className="text-red-600 mb-4">{fetchError}</div>}
      <div className="bg-white/80 backdrop-blur-md shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <ScheduleInterviewForm id={id!} />
      </div>
    </div>
  );
}

export default ScheduleInterviewPage;
