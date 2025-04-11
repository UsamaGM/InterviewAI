interface DatetimeSelectorProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

function DatetimeSelector({
  id,
  placeholder,
  value,
  onChange,
}: DatetimeSelectorProps) {
  return (
    <label
      htmlFor={id}
      className="relative flex-grow block rounded-md border border-gray-200 shadow-xs focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
    >
      <input
        type="datetime-local"
        id={id}
        value={value}
        onChange={(e) => {
          console.log(e.target.value);
          onChange(e.target.value);
        }}
        className="peer w-full px-2 py-2 border-none bg-transparent placeholder-transparent focus:border-transparent focus:ring-0 focus:outline-hidden"
        placeholder={placeholder}
      />
      <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
        {placeholder}
      </span>
    </label>
  );
}

export default DatetimeSelector;
