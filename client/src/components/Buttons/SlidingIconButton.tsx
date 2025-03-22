import { Link } from "react-router-dom";

interface SlidingIconButtonProps {
  title: string;
  link?: boolean;
  to?: string;
  onClick?: () => void;
}

function SlidingIconButton({
  title,
  link = false,
  to,
  onClick,
}: SlidingIconButtonProps) {
  return link ? (
    <Link
      className="group relative inline-flex items-center overflow-hidden rounded-sm bg-indigo-600 px-8 py-3 text-white focus:ring-3 focus:outline-hidden"
      to={to!}
    >
      <span className="absolute -end-full transition-all group-hover:end-4">
        <svg
          className="size-5 rtl:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </span>

      <span className="text-sm font-medium transition-all group-hover:me-4">
        {title}
      </span>
    </Link>
  ) : (
    <button
      className="group relative inline-flex items-center overflow-hidden rounded-sm bg-indigo-600 px-8 py-3 text-white focus:ring-3 focus:outline-hidden"
      onClick={onClick}
    >
      <span className="absolute -end-full transition-all group-hover:end-4">
        <svg
          className="size-5 rtl:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </span>

      <span className="text-sm font-medium transition-all group-hover:me-4">
        {title}
      </span>
    </button>
  );
}

export default SlidingIconButton;
