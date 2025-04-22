type props = {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
};

function LoadingSpinner({ fullScreen = false, size = "md" }: props) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-3",
    lg: "h-16 w-16 border-4",
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} mx-auto border-t-blue-500 border-b-blue-500 border-gray-200`}
    ></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-white bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default LoadingSpinner;
