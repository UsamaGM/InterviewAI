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
    <div className="flex gap-2">
      <label
        htmlFor={`${id}-date`}
        className="relative flex-grow block rounded-md border border-gray-200 shadow-xs focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
      >
        <input
          type="date"
          id={`${id}-date`}
          value={value.split("T")[0]}
          onChange={(e) => {
            const timeValue = value.split("T")[1] || "00:00";
            onChange(`${e.target.value}T${timeValue}`);
          }}
          className="peer w-full px-2 py-2 border-none bg-transparent placeholder-transparent focus:border-transparent focus:ring-0 focus:outline-hidden"
          placeholder={placeholder}
        />
        <span className="pointer-events-none absolute -top-[0.8rem] start-2.5 -translate-y-1/2 p-0.5 text-xs text-gray-700 font-semibold">
          Date
        </span>
      </label>

      <label
        htmlFor={`${id}-time`}
        className="relative w-32 block rounded-md border border-gray-200 shadow-xs focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
      >
        <input
          type="time"
          id={`${id}-time`}
          value={value.split("T")[1] || ""}
          onChange={(e) => {
            const dateValue =
              value.split("T")[0] || new Date().toISOString().split("T")[0];
            onChange(`${dateValue}T${e.target.value}`);
          }}
          className="peer w-full px-2 py-2 border-none bg-transparent placeholder-transparent focus:border-transparent focus:ring-0 focus:outline-hidden"
          placeholder="Time"
        />
        <span className="pointer-events-none absolute -top-[0.8rem] start-2.5 -translate-y-1/2 p-0.5 text-xs text-gray-700 font-semibold">
          Time
        </span>
      </label>
    </div>
  );
}

export default DatetimeSelector;
