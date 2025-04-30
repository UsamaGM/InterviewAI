type InputBoxProps = {
  disabled?: boolean;
  id: string;
  name?: string;
  type?: string;
  placeholder: string;
  value?: string;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

function InputBox(props: InputBoxProps) {
  return (
    <div className={inputStyles.wrapper}>
      <label htmlFor={props.id} className={inputStyles.label}>
        <input
          type={props.type}
          name={props.name ?? props.id}
          className={inputStyles.input}
          disabled={props.disabled}
          {...props}
        />
        <span className={inputStyles.placeholder}>{props.placeholder}</span>
      </label>
      {props.error && <p className={inputStyles.error}>{props.error}</p>}
    </div>
  );
}

export default InputBox;
