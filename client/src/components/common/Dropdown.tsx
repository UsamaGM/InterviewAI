import { useState, useRef, useEffect } from "react";
import { JobRole } from "../../utils/types";

interface DropdownProps {
  id: string;
  value: string;
  placeholder: string;
  onChange: (value: JobRole) => void;
}

const Dropdown = ({ id, value, placeholder, onChange }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLLabelElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: JobRole) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  interface MouseEvent {
    target: EventTarget | null;
  }

  const handleClickOutside = (e: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
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
      className="relative block h-max rounded-md border border-gray-200/80 shadow-xs focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 mb-6"
      ref={dropdownRef}
    >
      <div
        className="peer w-full px-2 py-2 border-none bg-transparent placeholder-transparent focus:border-transparent focus:ring-0 focus:outline-hidden cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        {value ? value : placeholder}
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      <span className="pointer-events-none absolute start-2.5 -top-[1.4rem] p-0.5 text-xs text-gray-700 font-semibold">
        {placeholder}
      </span>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-scroll bg-white/50 backdrop-blur-lg rounded-md shadow-lg ring-2 ring-gray-300 ring-opacity-5">
          <div className="py-1">
            {Object.keys(JobRole).map((key) => (
              <div
                key={key}
                onClick={() =>
                  handleOptionClick(JobRole[key as keyof typeof JobRole])
                }
                className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 cursor-pointer"
              >
                {JobRole[key as keyof typeof JobRole]}
              </div>
            ))}
          </div>
        </div>
      )}
    </label>
  );
};

export default Dropdown;
