import { ChangeEvent } from "react";

type TextAreaProps = {
  disabled?: boolean;
  required?: boolean;
  id: string;
  name?: string;
  placeholder: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
};

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

function TextArea(props: TextAreaProps) {
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

  return (
    <div className={inputStyles.wrapper}>
      <label htmlFor={props.id} className={inputStyles.label}>
        <textarea
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
        <span className={inputStyles.placeholder}>{placeholder}</span>
      </label>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default TextArea;
