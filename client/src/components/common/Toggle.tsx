import { ChangeEvent } from "react";

type propTypes = {
  checked: boolean;
  options: { label: string; value: string }[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function Toggle({ checked, options, onChange }: propTypes) {
  return (
    <div className="mb-4 flex items-center justify-center">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-[200px] h-10 bg-blue-100 shadow-md rounded-md relative" />
        <div
          className={`absolute top-0.5 bg-blue-300 rounded-md h-9 w-[99px] transition-transform duration-300 ease-in-out transform ${
            checked ? "translate-x-[calc(197.5px-100%)]" : "translate-x-0.5"
          }`}
        />
        <div className="absolute inset-0 flex items-center justify-between text-sm font-medium">
          <span
            className={`flex-1 text-center p-2 transition-all duration-300 ease-in-out transform ${
              !checked ? "text-blue-700 font-semibold" : "text-blue-500"
            }`}
          >
            {options[0].value}
          </span>
          <span
            className={`flex-1 text-center transition-all duration-300 ease-in-out ${
              checked ? "text-blue-700 font-semibold" : "text-blue-500"
            }`}
          >
            {options[1].value}
          </span>
        </div>
      </label>
    </div>
  );
}

export default Toggle;
