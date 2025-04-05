import { ChangeEvent } from "react";

interface TextAreaProps {
  disabled?: boolean;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

function TextArea({
  disabled = false,
  placeholder,
  value,
  onChange,
}: TextAreaProps) {
  return (
    <textarea
      className="w-full p-4 outline rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 mb-6 min-h-[150px] resize-none"
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default TextArea;
