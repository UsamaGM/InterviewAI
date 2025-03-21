import { useState, useRef, useEffect } from "react";

interface DatetimeSelectorProps {
  id: string;
  value: string;
  placeholder: string;
  onChange: (value: string | null) => void;
}

const DatetimeSelector = ({
  id,
  value,
  placeholder,
  onChange,
}: DatetimeSelectorProps) => {
  const [date, setDate] = useState(
    value ? new Date(value).toISOString().split("T")[0] : ""
  );
  const [time, setTime] = useState(
    value ? new Date(value).toISOString().split("T")[1].slice(0, 5) : ""
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLLabelElement>(null);

  const handleDateChange = (e) => {
    setDate(e.target.value);
    updateDatetime(e.target.value, time);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
    updateDatetime(date, e.target.value);
  };

  const updateDatetime = (newDate: string, newTime: string) => {
    if (newDate && newTime) {
      const datetimeString = `${newDate}T${newTime}:00`;
      onChange(datetimeString);
    } else {
      onChange(null);
    }
  };

  const togglePicker = () => {
    setIsPickerOpen(!isPickerOpen);
  };

  interface MouseEvent {
    target: EventTarget | null;
  }

  const handleClickOutside = (e: MouseEvent): void => {
    if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
      setIsPickerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <label
      htmlFor={id}
      className="relative block rounded-md border border-gray-200 shadow-xs focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 mb-6"
      ref={pickerRef}
    >
      <div className="flex items-center">
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          className="peer w-1/2 px-2 py-2 border-none bg-transparent placeholder-transparent focus:border-transparent focus:ring-0 focus:outline-hidden"
          id={`${id}-date`}
        />
        <input
          type="time"
          value={time}
          onChange={handleTimeChange}
          className="peer w-1/2 px-2 py-2 border-none bg-transparent placeholder-transparent focus:border-transparent focus:ring-0 focus:outline-hidden"
          id={`${id}-time`}
        />
      </div>
      <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
        {placeholder}
      </span>
    </label>
  );
};

export default DatetimeSelector;
