import GradientText from "@/TextAnimations/GradientText/GradientText";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

function ResetPasswordPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="bg-white p-8 rounded-lg shadow-lg lg:w-md md:w-sm sm:w-xs fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <GradientText>
          <h2 className="font-bold text-5xl">Reset Password</h2>
        </GradientText>
        <p className="text-center text-gray-600 my-4">
          Please enter your new password.
        </p>
        <ResetPasswordForm />
      </div>
    </div>
  );
}

export default ResetPasswordPage;
