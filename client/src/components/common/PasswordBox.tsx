import { useState } from "react";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

type PasswordBoxProps = {
  disabled?: boolean;
  required?: boolean;
  id: string;
  name?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function PasswordBox(props: PasswordBoxProps) {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  return (
    <label
      htmlFor={props.id}
      className="relative flex-grow block rounded-md border border-gray-200 shadow-xs focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
    >
      <input
        type={isShowPassword ? "text" : "password"}
        id={props.id}
        name={name ?? props.id}
        value={props.value}
        onChange={props.onChange}
        className="peer w-full px-2 py-2 border-none bg-transparent placeholder-transparent focus:border-transparent focus:ring-0 focus:outline-hidden"
        placeholder={props.placeholder}
        required={props.required}
        disabled={props.disabled}
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
      <span className="pointer-events-none absolute start-2.5 -translate-y-1/2 p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:-top-[0.8rem] peer-focus:text-xs peer-focus:font-semibold duration-300 ease-in-out">
        {props.placeholder}
      </span>
    </label>
  );
}

export default PasswordBox;
