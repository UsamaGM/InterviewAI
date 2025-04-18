import GradientText from "../../TextAnimations/GradientText/GradientText";
import RegisterForm from "../../components/auth/RegisterForm";

function RegisterPage() {
  return (
    <div className="relative flex items-center justify-center min-w-screen min-h-screen">
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-lg shadow-lg">
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
