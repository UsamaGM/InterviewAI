interface SuccessAlertProps {
  title: string;
  subtitle: string;
}

function SuccessAlert({ title = "Success!", subtitle }: SuccessAlertProps) {
  return (
    <div className="bg-green-50 border-l-4 border-green-500 rounded-md p-2 mb-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="h-4 w-4 text-green-800"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-2">
          <h3 className="text-sm font-medium text-green-800">{title}</h3>
          <div className="text-sm text-green-600">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

export default SuccessAlert;
