interface RotatingButtonProps {
  disabled: boolean;
  disabledTitle: string;
  enabledTitle: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

function RotatingButton({
  disabled,
  disabledTitle,
  enabledTitle,
  type = "button",
  onClick,
}: RotatingButtonProps) {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className="inline-block rounded-sm bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:-rotate-2 focus:ring-3 focus:outline-hidden"
    >
      {disabled ? disabledTitle : enabledTitle}
    </button>
  );
}

export default RotatingButton;
