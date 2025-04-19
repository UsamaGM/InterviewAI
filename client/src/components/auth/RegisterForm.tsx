import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { LoadingSpinner, InputBox, ErrorAlert } from "../common";
import PasswordBox from "../common/PasswordBox";

function RegisterForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<"recruiter" | "candidate">("candidate");

  const {
    register,
    error: { registering: registerError },
    loading: { registering },
  } = useAuth();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    register({ email, password, role, name });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {registerError && <ErrorAlert title="Error!" subtitle={registerError} />}
      <InputBox
        id="name"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <InputBox
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordBox
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <RoleRadioGroup />
      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
      <div className="mt-6">
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {registering ? <LoadingSpinner size="sm" /> : "Register"}
        </button>
      </div>
    </form>
  );

  function RoleRadioGroup() {
    return (
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="role"
        >
          I am here to
        </label>
        <div className="mt-2 flex">
          <div className="flex-1">
            <input
              type="radio"
              id="recruiter"
              name="role"
              value="recruiter"
              checked={role === "recruiter"}
              onChange={() => setRole("recruiter")}
            />
            <label className="ml-2" htmlFor="recruiter">
              Hire
            </label>
          </div>
          <div className="flex-1">
            <input
              type="radio"
              id="candidate"
              name="role"
              value="candidate"
              checked={role === "candidate"}
              onChange={() => setRole("candidate")}
            />
            <label className="ml-2" htmlFor="candidate">
              Get hired
            </label>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterForm;
