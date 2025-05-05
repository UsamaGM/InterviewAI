import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "@/hooks";
import { InterviewCard } from "@/components/common";
import { formatDate } from "@/utils/helpers";
import {
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

interface InterviewStats {
  totalInterviews: number;
  activeInterviews: number;
  candidatesAssessed: number;
  completedInterviews: number;
  averageScore: number;
  timeToHire: number;
  candidateQuality: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
  teamPerformance: {
    interviewsConducted: number;
    averageRating: number;
    feedbackQuality: number;
  };
}

function RecruiterDashboard() {
  const { interviews, loading, error } = useInterview();
  const [stats, setStats] = useState<InterviewStats>({
    totalInterviews: 0,
    activeInterviews: 0,
    candidatesAssessed: 0,
    completedInterviews: 0,
    averageScore: 0,
    timeToHire: 0,
    candidateQuality: {
      excellent: 0,
      good: 0,
      average: 0,
      poor: 0,
    },
    teamPerformance: {
      interviewsConducted: 0,
      averageRating: 0,
      feedbackQuality: 0,
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

      // Calculate time to hire (days between first interview and completion)
      const timeToHire =
        completed.length > 0
          ? completed.reduce((sum, i) => {
              const startDate = new Date(i.scheduledTime!);
              const endDate = new Date(i.completedAt!);
              return (
                sum +
                Math.ceil(
                  (endDate.getTime() - startDate.getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              );
            }, 0) / completed.length
          : 0;

      // Calculate candidate quality based on actual scores
      const candidateQuality = {
        excellent: completed.filter((i) => (i.score || 0) >= 90).length,
        good: completed.filter(
          (i) => (i.score || 0) >= 75 && (i.score || 0) < 90
        ).length,
        average: completed.filter(
          (i) => (i.score || 0) >= 60 && (i.score || 0) < 75
        ).length,
        poor: completed.filter((i) => (i.score || 0) < 60).length,
      };

      // Calculate team performance metrics
      const feedbackQuality =
        completed.length > 0
          ? completed.reduce((sum, i) => sum + (i.feedback?.quality || 0), 0) /
            completed.length
          : 0;

      setStats({
        totalInterviews: interviews.length,
        activeInterviews: active.length,
        candidatesAssessed: completed.length,
        completedInterviews: completed.length,
        averageScore: avgScore,
        timeToHire: Math.round(timeToHire),
        candidateQuality,
        teamPerformance: {
          interviewsConducted: completed.length,
          averageRating: avgScore / 20, // Convert to 5-point scale
          feedbackQuality: Math.round(feedbackQuality * 100),
        },
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
              <ClockIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Avg. Time to Hire
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.timeToHire} days
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Quality Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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

        {/* Team Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Team Performance
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Interviews Conducted</span>
                <span className="font-medium text-gray-900">
                  {stats.teamPerformance.interviewsConducted}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (stats.teamPerformance.interviewsConducted /
                        stats.totalInterviews) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Average Rating</span>
                <span className="font-medium text-gray-900">
                  {stats.teamPerformance.averageRating}/5.0
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (stats.teamPerformance.averageRating / 5) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Feedback Quality</span>
                <span className="font-medium text-gray-900">
                  {stats.teamPerformance.feedbackQuality}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{
                    width: `${stats.teamPerformance.feedbackQuality}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Interviews */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Active Interviews
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {interviews
            .filter(
              (interview) =>
                interview.status === "scheduled" ||
                interview.status === "in-progress"
            )
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
      <div>
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
    </div>
  );
}

export default RecruiterDashboard;
