import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ErrorAlert,
  LoadingSpinner,
  InputBox,
  PasswordBox,
  StyledButton,
} from "@/components/common";
import { useAuth } from "@/hooks";

function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const {
    login,
    error: { loggingIn: loginError },
    loading: { loggingIn },
  } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (email && password) {
      await login(email, password);
    }
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

      <div className="flex flex-col items-center space-y-2">
        <div className="flex justify-center text-sm gap-1">
          Don't have an account?
          <Link
            to="/auth/register"
            className="w-fit text-blue-600 hover:text-blue-800 hover:underline"
          >
            Register
          </Link>
        </div>
        <Link
          to="/auth/forgot-password"
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <StyledButton
        type="submit"
        disabled={loggingIn}
        style={{ backgroundColor: "blue" }}
      >
        {loggingIn ? <LoadingSpinner size="sm" /> : "Login"}
      </StyledButton>
    </form>
  );
}

export default LoginForm;
