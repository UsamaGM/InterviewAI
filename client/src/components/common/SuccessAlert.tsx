interface SuccessAlertProps {
  title: string;
  subtitle: string;
}

function SuccessAlert({ title = "Success!", subtitle }: SuccessAlertProps) {
  return (
    <div
      role="alert"
      className="rounded-sm border-s-4 border-green-500 bg-green-50 p-4"
    >
      <strong className="block font-medium text-green-800">{title}</strong>

      <p className="mt-2 text-sm text-green-700">{subtitle}</p>
    </div>
  );
}

export default SuccessAlert;
