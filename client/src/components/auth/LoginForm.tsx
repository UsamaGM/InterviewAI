import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InputBox from "../common/InputBox";
import { LoadingSpinner } from "../common";

function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const {
    login,
    error: { loggingIn: loginError },
    loading: { loggingIn },
  } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {loginError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{loginError}</span>
        </div>
      )}

      <InputBox
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <InputBox
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link
            to="/auth/register"
            className="text-blue-600 hover:text-blue-800"
          >
            Don't have an account? Register
          </Link>
        </div>
        <button
          type="submit"
          disabled={loggingIn}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loggingIn ? <LoadingSpinner size="sm" /> : "Login"}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
