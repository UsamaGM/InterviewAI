import GradientText from "../../../TextAnimations/GradientText/GradientText";
import Particles from "../../../Backgrounds/Particles/Particles";
import LoginForm from "./LoginForm";
import { useEffect } from "react";

const Login: React.FC = () => {
  useEffect(() => {
    document.title = "Login | InterviewAI";
    if (localStorage.getItem("token")) {
      window.location.href = "/interviews";
    }
  });
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Particles
        moveParticlesOnHover
        particleCount={100}
        className="fixed top-0 left-0 right-0 bottom-0 z-0"
      />
      <div className="bg-white p-8 rounded-lg shadow-lg lg:w-md md:w-sm sm:w-xs fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <GradientText>
          <h2 className="font-bold text-5xl">Login</h2>
        </GradientText>
        <p className="text-center text-gray-600 my-4">
          Please log in to your account.
        </p>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
