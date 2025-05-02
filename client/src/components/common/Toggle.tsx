import { forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type ToggleProps = {
  checked: boolean;
  options: { label: string; value: string }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  registration?: Partial<UseFormRegisterReturn>;
};

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ checked, options, onChange, error, registration }, ref) => {
    return (
      <div className="mb-4">
        <div className="flex items-center justify-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={onChange}
              className="sr-only peer"
              ref={ref}
              {...registration}
            />
            <div className="w-64 h-9 bg-blue-100 rounded-md relative shadow-inner" />
            <div
              className={`absolute top-1 bg-blue-300 rounded-md h-7 w-[49%] transition-all duration-300 ease-in-out transform ${
                checked ? "translate-x-[102%]" : "translate-x-1"
              } shadow-md`}
            />
            <div className="absolute inset-0 flex items-center text-sm font-medium">
              <span
                className={`flex-1 text-center transition-all duration-300 ease-in-out ${
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
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Toggle.displayName = "Toggle";

export default Toggle;
