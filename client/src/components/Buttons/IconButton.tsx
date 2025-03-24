interface IconButtonProps {
  disabled?: boolean;
  flipped?: boolean;
  onClick: () => void;
}

function IconButton({
  disabled = false,
  flipped = false,
  onClick,
}: IconButtonProps) {
  return (
    <button
      disabled={disabled}
      className="inline-block rounded-full border border-indigo-600 bg-indigo-600 disabled:bg-gray-300 p-3 text-white disabled:text-gray-800 hover:bg-transparent hover:text-indigo-600 focus:ring-1 focus:outline-hidden"
      onClick={onClick}
    >
      <svg
        className={`size-5 ${flipped && "rotate-180"}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </button>
  );
}

export default IconButton;
