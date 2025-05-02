import GradientText from "../../TextAnimations/GradientText/GradientText";
import RegisterForm from "../../components/auth/RegisterForm";

function RegisterPage() {
  return (
    <div className="relative flex items-center justify-center min-w-screen min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg lg:w-md md:w-sm sm:w-xs fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <GradientText>
          <h2 className="font-bold text-5xl">Register</h2>
        </GradientText>
        <p className="text-center text-gray-600 my-4">Let's do it!</p>
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
