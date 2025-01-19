import PropTypes from "prop-types";

function RoundedButton({ title, submitButton, className, onClick }) {
  return (
    <div
      className={`w-full rounded-lg font-bold text-lg shadow-md cursor-pointer shadow-shadowDark ${className}`}
      onClick={onClick}
    >
      {submitButton ? (
        <button className="w-full h-full p-2" type="submit">
          {title}
        </button>
      ) : (
        <p className="text-center hover:cursor-pointer select-none px-2">
          {title}
        </p>
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
