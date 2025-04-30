import { ReactNode } from "react";

type propType = {
  type?: "button" | "submit" | "reset";
  children: ReactNode;
  disabled: boolean;
  onClick?: () => void;
  style?: Record<symbol | string | number, unknown>;
};

function StyledButton(props: propType) {
  return (
    <button
      type={props.type || "button"}
      disabled={props.disabled}
      onClick={props.onClick}
      className="w-full bg-blue-400 hover:bg-blue-500 text-blue-800 hover:text-blue-200 font-semibold cursor-pointer m-1 py-2 px-4 rounded-md transition-all ease-in-out duration-300"
      style={props.style}
    >
      {props.children}
    </button>
  );
}

export default StyledButton;
