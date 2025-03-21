import LetterGlitch from "../../../Backgrounds/LetterGlitch/LetterGlitch";
import GradientText from "../../../TextAnimations/GradientText/GradientText";
import RegisterForm from "./RegisterForm";

const Register: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center min-w-screen min-h-screen">
      <div className="fixed top-0 left-0 right-0 bottom-0 z-0">
        <LetterGlitch
          glitchColors={["#2b4539", "#61dca3", "#61b3dc"]}
          glitchSpeed={100}
          centerVignette={false}
          outerVignette={true}
          smooth={true}
        />
      </div>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg z-10">
        <GradientText>
          <h2 className="font-bold text-5xl">Register</h2>
        </GradientText>
        <p className="text-center text-gray-600 my-4">
          Register now to avail an early bird discount
        </p>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
