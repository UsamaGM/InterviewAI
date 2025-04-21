import { ChangeEvent } from "react";

interface TextAreaProps {
  disabled?: boolean;
  id?: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

function TextArea({
  disabled = false,
  id,
  placeholder,
  value,
  onChange,
}: TextAreaProps) {
  return (
    <label
      htmlFor={placeholder}
      className="relative flex-grow block h-max rounded-md border border-gray-200 shadow-xs focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
    >
      <textarea
        id={id ?? placeholder}
        className="peer w-full px-2 py-2 border-none bg-transparent placeholder-transparent focus:border-transparent focus:ring-0 focus:outline-hidden min-h-[150px] resize-none"
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <span className="pointer-events-none absolute -top-[0.8rem] start-2.5 -translate-y-1/2 p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-focus:-top-[0.8rem] peer-focus:text-xs peer-focus:font-semibold duration-300 ease-in-out">
        {placeholder}
      </span>
    </label>
  );
}

export default TextArea;
