import { AiOutlineUnlock, AiFillLock } from "react-icons/ai";
import PropTypes from "prop-types";
import { useState } from "react";

function TextBox({
  label,
  icon: Icon,
  type,
  name,
  placeholder,
  value,
  onChange,
  required,
}) {
  const [visible, setVisible] = useState(false);

  function toggleVisibility() {
    setVisible(!visible);
  }
  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-sm font-bold" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <ProvidedIcon />
        <VisibilityToggle />
        <input
          className={`w-full p-2 border-none focus:outline-secondary shadow-md shadow-dark rounded-full ${
            (Icon || type === "password") && "pl-10"
          }`}
          type={type === "password" ? (visible ? "text" : "password") : type}
          name={name}
          id={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    </div>
  );

  function ProvidedIcon() {
    return (
      Icon &&
      type !== "password" && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark" />
      )
    );
  }

  function VisibilityToggle() {
    const style =
      "absolute left-3 top-1/2 transform -translate-y-1/2 text-dark cursor-pointer";
    return (
      type === "password" &&
      (visible ? (
        <AiOutlineUnlock className={style} onClick={toggleVisibility} />
      ) : (
        <AiFillLock className={style} onClick={toggleVisibility} />
      ))
    );
  }
}

TextBox.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.func,
  type: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
};

export default TextBox;
