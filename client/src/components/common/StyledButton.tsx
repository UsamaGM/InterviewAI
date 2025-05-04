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
      className="w-full bg-blue-200 hover:bg-blue-300 text-blue-600 hover:text-blue-700 disabled:bg-gray-200 disabled:text-gray-500 font-semibold cursor-pointer disabled:cursor-auto m-1 py-2 px-4 rounded-md transition-all ease-in-out duration-300"
      style={props.style}
    >
      {props.children}
    </button>
  );
}

export default StyledButton;
