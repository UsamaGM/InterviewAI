import PropTypes from "prop-types";

function RoundedButton({
  icon: Icon,
  title,
  submitButton,
  className,
  onClick,
}) {
  return (
    <div
      className={`w-full rounded-md font-bold text-lg bg-primary text-primaryContrast hover:bg-secondary hover:text-secondaryContrast p-2 group relative ${className}`}
      onClick={onClick}
    >
      {submitButton ? (
        <button className="w-full h-full" type="submit">
          {title}
        </button>
      ) : (
        <p className="text-center hover:cursor-pointer select-none">{title}</p>
      )}
      {Icon && (
        <Icon className="absolute size-5 right-10 top-1/2 -translate-y-1/2 opacity-0 transition-[transform opacity] duration-300 group-hover:right-5 group-hover:scale-125 group-hover:opacity-100" />
      )}
    </div>
  );
}

RoundedButton.propTypes = {
  icon: PropTypes.func,
  title: PropTypes.string,
  submitButton: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default RoundedButton;
