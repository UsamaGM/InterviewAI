import { useState } from "react";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

interface InputBoxProps {
  required?: boolean;
  password?: boolean;
  textarea?: boolean;
  type?: string;
  id?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputBox({
  password = false,
  // textarea = false,
  required = true,
  id,
  placeholder,
  type,
  value,
  onChange,
}: InputBoxProps) {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  return (
    <label
      htmlFor={placeholder}
      className="relative block rounded-md border border-gray-200 shadow-xs focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
    >
      {password ? (
        <>
          <input
            type={isShowPassword ? "text" : "password"}
            id={id ?? placeholder}
            value={value}
            onChange={onChange}
            className="peer w-full px-2 py-2 border-none bg-transparent placeholder-transparent focus:border-transparent focus:ring-0 focus:outline-hidden"
            placeholder={placeholder}
            required={required}
          />
          <button
            type="button"
            onClick={() => {
              setIsShowPassword(!isShowPassword);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 outline-none cursor-pointer"
          >
            {isShowPassword ? (
              <VisibilityOutlined className="text-red-700" />
            ) : (
              <VisibilityOffOutlined className="text-green-700" />
            )}
          </button>
        </>
      ) : (
        <input
          type={type}
          id={id ?? placeholder}
          value={value}
          onChange={onChange}
          className="peer w-full px-2 py-2 border-none bg-transparent placeholder-transparent focus:border-transparent focus:ring-0 focus:outline-hidden"
          placeholder={placeholder}
        />
      )}
      <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
        {placeholder}
      </span>
    </label>
  );
}

export default InputBox;
