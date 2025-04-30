import { useState } from "react";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

type PasswordBoxProps = {
  disabled?: boolean;
  required?: boolean;
  id: string;
  name?: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

function PasswordBox(props: PasswordBoxProps) {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const {
    id,
    name,
    placeholder,
    required,
    disabled,
    onChange,
    value,
    error,
    ...rest
  } = props;

  const inputStyles = {
    wrapper: "w-full",
    label:
      "relative flex-grow block rounded-md border border-gray-200 shadow-xs focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600",
    input:
      "peer w-full px-2 py-1.5 border-none bg-transparent placeholder-transparent focus:border-transparent focus:ring-0 focus:outline-hidden disabled:text-gray-500",
    placeholder:
      "pointer-events-none absolute top-0 start-2.5 -translate-y-1/2 bg-white px-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:font-semibold",
    error: "mt-1 text-sm text-red-600",
  };

  return (
    <div className={inputStyles.wrapper}>
      <label htmlFor={id} className={inputStyles.label}>
        <input
          type={isShowPassword ? "text" : "password"}
          id={id}
          name={name ?? id}
          value={value}
          onChange={onChange}
          className={inputStyles.input}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setIsShowPassword(!isShowPassword)}
          className="absolute inset-y-0 right-0 cursor-pointer flex items-center px-2"
          tabIndex={-1}
        >
          {isShowPassword ? (
            <VisibilityOffOutlined className="h-5 w-5 text-gray-400" />
          ) : (
            <VisibilityOutlined className="h-5 w-5 text-gray-400" />
          )}
        </button>
        <span className={inputStyles.placeholder}>{placeholder}</span>
      </label>
      {error && <p className={inputStyles.error}>{error}</p>}
    </div>
  );
}

export default PasswordBox;
