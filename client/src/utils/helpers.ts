import {
  ClockIcon,
  PlayIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export function formatDate(dateString?: string) {
  if (!dateString) return "Not scheduled";
  return new Date(dateString).toLocaleString();
}

export const statusConfig = {
  draft: {
    title: "Draft",
    styles: "bg-gray-100 text-gray-800",
    action: "Start Interview",
    icon: PlayIcon,
  },
  "in-progress": {
    title: "In Progress",
    styles: "bg-blue-100 text-blue-800",
    action: "Continue Interview",
    icon: PlayIcon,
  },
  completed: {
    title: "Completed",
    styles: "bg-green-100 text-green-800",
    action: "Review Interview",
    icon: StarIcon,
  },
  scheduled: {
    title: "Scheduled",
    styles: "bg-purple-100 text-purple-800",
    action: "Join Interview",
    icon: ClockIcon,
  },
  cancelled: {
    title: "Cancelled",
    styles: "bg-red-100 text-red-800",
    action: "",
    icon: XMarkIcon,
  },
};
