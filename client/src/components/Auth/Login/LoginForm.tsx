import { useState } from "react";
import InputBox from "../../InputBox/InputBox";
import { Link, useNavigate } from "react-router-dom";
import { handleError } from "../../../utils/errorHandler";
import api from "../../../services/api";
import { AxiosResponse } from "axios";

function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response: AxiosResponse = await api.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/interviews");
    } catch (error) {
      setError(handleError(error, "Failed to log in"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-1">{error}</span>
        </div>
      )}
      <InputBox
        id="email"
        placeholder="Email"
        type="email"
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
      <p className="text-center text-gray-600 mb-4">
        Don't have an account yet?{" "}
        <Link to="/register" className="text-blue-500 hover:underline">
          Register
        </Link>
      </p>
      <button
        type="submit"
        className="w-full bg-blue-500 transition-colors duration-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Log In
      </button>
    </form>
  );
}

export default LoginForm;
