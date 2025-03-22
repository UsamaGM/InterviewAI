interface RotatingButtonProps {
  disabled: boolean;
  disabledTitle: string;
  enabledTitle: string;
}

function RotatingButton({
  disabled,
  disabledTitle,
  enabledTitle,
}: RotatingButtonProps) {
  return (
    <button
      disabled={disabled}
      type="submit"
      className="inline-block rounded-sm bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:-rotate-2 focus:ring-3 focus:outline-hidden"
    >
      {disabled ? disabledTitle : enabledTitle}
    </button>
  );
}

export default RotatingButton;
