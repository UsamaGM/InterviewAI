import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { LoadingSpinner, InputBox, ErrorAlert } from "../common";
import PasswordBox from "../common/PasswordBox";

function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const {
    login,
    error: { loggingIn: loginError },
    loading: { loggingIn },
  } = useAuth();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    login(email, password);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {loginError && <ErrorAlert title="Error!" subtitle={loginError} />}

      <InputBox
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <PasswordBox
        id="password"
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
