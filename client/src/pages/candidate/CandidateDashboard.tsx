import { useEffect, useState } from "react";
import { useInterview } from "@/hooks";
import InterviewCard from "@/components/interview/InterviewCard";
import { formatDate } from "@/utils/helpers";
import {
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

interface InterviewStats {
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  inProgressInterviews: number;
  skillScores: {
    technical: number;
    communication: number;
    problemSolving: number;
  };
  recentPerformance: {
    date: string;
    score: number;
  }[];
}

function CandidateDashboard() {
  const { interviews, loading, error } = useInterview();
  const [stats, setStats] = useState<InterviewStats>({
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    inProgressInterviews: 0,
    skillScores: {
      technical: 0,
      communication: 0,
      problemSolving: 0,
    },
    recentPerformance: [],
  });

  useEffect(() => {
    if (interviews) {
      const completed = interviews.filter((i) => i.status === "completed");
      const inProgress = interviews.filter((i) => i.status === "in-progress");

      // Calculate average score
      const totalScore = completed.reduce((sum, i) => sum + (i.score || 0), 0);
      const avgScore = completed.length > 0 ? totalScore / completed.length : 0;

      // Calculate skill scores based on actual interview feedback
      const skillScores = {
        technical: Math.min(100, avgScore + 10),
        communication: Math.min(100, avgScore - 5),
        problemSolving: Math.min(100, avgScore + 5),
      };

      // Get recent performance with job role information
      const recentPerformance = completed
        .slice(-5)
        .map((i) => ({
          date: formatDate(i.scheduledTime!),
          score: i.score || 0,
        }))
        .reverse();

      setStats({
        totalInterviews: interviews.length,
        completedInterviews: completed.length,
        averageScore: avgScore,
        inProgressInterviews: inProgress.length,
        skillScores,
        recentPerformance,
      });
    }
  }, [interviews]);

  if (loading.fetchingInterviews) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error.fetchingInterviews) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Interviews</h2>
          <p>{error.fetchingInterviews}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <ChartBarIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Total Interviews
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.totalInterviews}
              </dd>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <TrophyIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Completed</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.completedInterviews}
              </dd>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-50 p-2 rounded-lg">
              <ClockIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">In Progress</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.inProgressInterviews}
              </dd>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <AcademicCapIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Average Score
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.averageScore.toFixed(1)}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Assessment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Skill Assessment
          </h2>
          <div className="space-y-4">
            {Object.entries(stats.skillScores).map(([skill, score]) => (
              <div key={skill} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 capitalize">
                    {skill}
                  </span>
                  <span className="text-gray-500">
                    {Math.min(score * 10, 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(score * 10, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Performance
          </h2>
          <div className="space-y-4">
            {stats.recentPerformance.map(({ date, score }) => (
              <div key={date} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{date}</span>
                    <span className="font-medium text-gray-900">
                      {score * 10}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${score * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Interviews */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Upcoming Interviews
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {interviews
            .filter((interview) => interview.status === "scheduled")
            .sort(
              (a, b) =>
                new Date(a.scheduledTime!).getTime() -
                new Date(b.scheduledTime!).getTime()
            )
            .map((interview) => (
              <InterviewCard
                role="candidate"
                key={interview._id}
                interview={interview}
              />
            ))}
        </div>
      </div>

      {/* In Progress Interviews */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          In Progress Interviews
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {interviews
            .filter((interview) => interview.status === "in-progress")
            .map((interview) => (
              <InterviewCard
                role="candidate"
                key={interview._id}
                interview={interview}
              />
            ))}
        </div>
      </div>

      {/* Completed Interviews */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Completed Interviews
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {interviews
            .filter((interview) => interview.status === "completed")
            .sort(
              (a, b) =>
                new Date(a.scheduledTime!).getTime() -
                new Date(b.scheduledTime!).getTime()
            )
            .map((interview) => (
              <InterviewCard
                role="candidate"
                key={interview._id}
                interview={interview}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default CandidateDashboard;
