import { useEffect, useState } from "react";
import { useAuth, useInterview } from "@/hooks";
import InterviewCard from "@/components/interview/InterviewCard";
import {
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { LoadingSpinner } from "@/components/common";

interface InterviewStats {
  totalInterviews: number;
  activeInterviews: number;
  candidatesAssessed: number;
  completedInterviews: number;
  averageScore: number;
  candidateQuality: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
  jobRoleDistribution: {
    [key: string]: number;
  };
  questionMetrics: {
    totalQuestions: number;
    answeredQuestions: number;
    averageScore: number;
  };
  aiMetrics: {
    positiveSentiment: number;
    negativeSentiment: number;
    neutralSentiment: number;
  };
}

function RecruiterDashboard() {
  const { interviews, loading, error } = useInterview();
  const { user } = useAuth();
  const [stats, setStats] = useState<InterviewStats>({
    totalInterviews: 0,
    activeInterviews: 0,
    candidatesAssessed: 0,
    completedInterviews: 0,
    averageScore: 0,
    candidateQuality: {
      excellent: 0,
      good: 0,
      average: 0,
      poor: 0,
    },
    jobRoleDistribution: {},
    questionMetrics: {
      totalQuestions: 0,
      answeredQuestions: 0,
      averageScore: 0,
    },
    aiMetrics: {
      positiveSentiment: 0,
      negativeSentiment: 0,
      neutralSentiment: 0,
    },
  });

  useEffect(() => {
    if (interviews) {
      const completed = interviews.filter((i) => i.status === "completed");
      const active = interviews.filter(
        (i) => i.status === "in-progress" || i.status === "scheduled"
      );

      // Calculate average score
      const totalScore = completed.reduce((sum, i) => sum + (i.score || 0), 0);
      const avgScore = completed.length > 0 ? totalScore / completed.length : 0;

      // Calculate candidate quality based on actual scores
      const candidateQuality = {
        excellent: completed.filter((i) => (i.score || 0) >= 9).length,
        good: completed.filter(
          (i) => (i.score || 0) >= 7.5 && (i.score || 0) < 9
        ).length,
        average: completed.filter(
          (i) => (i.score || 0) >= 6 && (i.score || 0) < 7.5
        ).length,
        poor: completed.filter((i) => (i.score || 0) < 6).length,
      };

      // Calculate job role distribution
      const jobRoleDistribution = completed.reduce((acc, interview) => {
        if (interview.jobRole) {
          acc[interview.jobRole] = (acc[interview.jobRole] || 0) + 1;
        }
        return acc;
      }, {} as { [key: string]: number });

      // Calculate question metrics
      const questionMetrics = completed.reduce(
        (acc, interview) => {
          const totalQuestions = interview.questions.length;
          const answeredQuestions = interview.questions.filter(
            (q) => q.answerText
          ).length;
          const questionScores = interview.questions
            .map((q) => q.aiAssessment?.score || 0)
            .filter((score) => score > 0);
          const avgQuestionScore =
            questionScores.length > 0
              ? questionScores.reduce((sum, score) => sum + score, 0) /
                questionScores.length
              : 0;

          return {
            totalQuestions: acc.totalQuestions + totalQuestions,
            answeredQuestions: acc.answeredQuestions + answeredQuestions,
            averageScore: acc.averageScore + avgQuestionScore,
          };
        },
        { totalQuestions: 0, answeredQuestions: 0, averageScore: 0 }
      );

      // Calculate AI metrics
      const aiMetrics = completed.reduce(
        (acc, interview) => {
          interview.questions.forEach((q) => {
            if (q.aiAssessment?.sentiment) {
              acc[`${q.aiAssessment.sentiment}Sentiment`]++;
            }
          });
          return acc;
        },
        {
          positiveSentiment: 0,
          negativeSentiment: 0,
          neutralSentiment: 0,
        }
      );

      setStats({
        totalInterviews: interviews.length,
        activeInterviews: active.length,
        candidatesAssessed: completed.length,
        completedInterviews: completed.length,
        averageScore: avgScore,
        candidateQuality,
        jobRoleDistribution,
        questionMetrics: {
          totalQuestions: questionMetrics.totalQuestions,
          answeredQuestions: questionMetrics.answeredQuestions,
          averageScore:
            completed.length > 0
              ? questionMetrics.averageScore / completed.length
              : 0,
        },
        aiMetrics,
      });
    }
  }, [interviews]);

  if (loading.fetchingInterviews) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
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
      {/* Greetings */}
      <h2 className="text-3xl text-blue-700 font-bold mb-8">
        Welcome back {user?.name}
      </h2>

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
              <UserGroupIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Active Interviews
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.activeInterviews}
              </dd>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-50 p-2 rounded-lg">
              <AcademicCapIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Candidates Assessed
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.candidatesAssessed}
              </dd>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Average Score
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.averageScore}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Candidate Quality */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Candidate Quality
          </h2>
          <div className="space-y-4">
            {Object.entries(stats.candidateQuality).map(([quality, count]) => (
              <div key={quality} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 capitalize">
                    {quality}
                  </span>
                  <span className="text-gray-500">{count} candidates</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      quality === "excellent"
                        ? "bg-green-600"
                        : quality === "good"
                        ? "bg-blue-600"
                        : quality === "average"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                    style={{
                      width: `${(count / stats.candidatesAssessed) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assessment Metrics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            User Response Sentiment
          </h2>
          <div className="space-y-4">
            {Object.entries(stats.aiMetrics).map(([sentiment, count]) => (
              <div key={sentiment} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 capitalize">
                    {sentiment.replace("Sentiment", "")}
                  </span>
                  <span className="text-gray-500">{count} responses</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      sentiment.includes("positive")
                        ? "bg-green-600"
                        : sentiment.includes("negative")
                        ? "bg-red-600"
                        : "bg-yellow-600"
                    }`}
                    style={{
                      width: `${
                        (count /
                          Object.values(stats.aiMetrics).reduce(
                            (a, b) => a + b,
                            0
                          )) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Role Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Job Role Distribution
          </h2>
          <div className="space-y-4">
            {Object.entries(stats.jobRoleDistribution)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([role, count]) => (
                <div key={role} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{role}</span>
                    <span className="text-gray-500">{count} interviews</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(count / stats.completedInterviews) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Question Metrics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Question Metrics
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Question Completion
                </span>
                <span className="text-gray-500">
                  {Math.round(
                    (stats.questionMetrics.answeredQuestions /
                      stats.questionMetrics.totalQuestions) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (stats.questionMetrics.answeredQuestions /
                        stats.questionMetrics.totalQuestions) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Average Question Score
                </span>
                <span className="text-gray-500">
                  {stats.questionMetrics.averageScore}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${stats.questionMetrics.averageScore * 10}%`,
                  }}
                ></div>
              </div>
            </div>
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
                role="recruiter"
                key={interview._id}
                interview={interview}
              />
            ))}
        </div>
      </div>

      {/* Active Interviews */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Active Interviews
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {interviews
            .filter((interview) => interview.status === "in-progress")
            .sort(
              (a, b) =>
                new Date(a.scheduledTime!).getTime() -
                new Date(b.scheduledTime!).getTime()
            )
            .map((interview) => (
              <InterviewCard
                role="recruiter"
                key={interview._id}
                interview={interview}
              />
            ))}
        </div>
      </div>

      {/* Recent Completed Interviews */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Completed Interviews
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {interviews
            .filter((interview) => interview.status === "completed")
            .sort(
              (a, b) =>
                new Date(b.scheduledTime!).getTime() -
                new Date(a.scheduledTime!).getTime()
            )
            .slice(0, 4)
            .map((interview) => (
              <InterviewCard
                role="recruiter"
                key={interview._id}
                interview={interview}
              />
            ))}
        </div>
      </div>

      {/* Cancelled Interviews */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Cancelled Interviews
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {interviews
            .filter((interview) => interview.status === "cancelled")
            .sort(
              (a, b) =>
                new Date(a.scheduledTime!).getTime() -
                new Date(b.scheduledTime!).getTime()
            )
            .map((interview) => (
              <InterviewCard
                role="recruiter"
                key={interview._id}
                interview={interview}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default RecruiterDashboard;
