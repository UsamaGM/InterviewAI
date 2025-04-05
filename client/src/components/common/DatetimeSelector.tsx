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
    <input
      id={id}
      type="datetime-local"
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default DatetimeSelector;
