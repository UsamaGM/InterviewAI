import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { handleError } from "../../../utils/errorHandler";
import InputBox from "../../InputBox/InputBox";

function RegisterForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<"recruiter" | "candidate">("candidate");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/auth/register", { email, password, role, name });
      navigate("/login");
    } catch (error) {
      setError(handleError(error, "Failed to register"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="mb-4">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>{" "}
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}
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
      <InputBox
        password
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
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
          Register
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;
