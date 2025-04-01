import React from 'react';

interface DatetimeSelectorProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const DatetimeSelector: React.FC<DatetimeSelectorProps> = ({ id, placeholder, value, onChange }) => {
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
};

export default DatetimeSelector; 