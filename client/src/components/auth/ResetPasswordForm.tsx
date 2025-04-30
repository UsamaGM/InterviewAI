import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ErrorAlert,
  LoadingSpinner,
  StyledButton,
  SuccessAlert,
  PasswordBox,
} from "@/components/common";
import { useAuth } from "@/hooks";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    resetPassword,
    error: { resetPassword: resetPasswordError },
    loading: { resetPassword: isLoading },
  } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    if (password && token) {
      const result = await resetPassword(token, password);
      if (result?.success) {
        setSuccess("Password has been reset successfully!");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {resetPasswordError && (
        <ErrorAlert title="Error!" subtitle={resetPasswordError} />
      )}
      {passwordError && <ErrorAlert title="Error!" subtitle={passwordError} />}
      {success && <SuccessAlert title="Success!" subtitle={success} />}

      <PasswordBox
        id="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />

      <PasswordBox
        id="confirmPassword"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        disabled={isLoading}
      />

      <StyledButton
        type="submit"
        disabled={isLoading || !password || !confirmPassword}
        style={{ backgroundColor: "blue" }}
      >
        {isLoading ? <LoadingSpinner size="sm" /> : "Reset Password"}
      </StyledButton>
    </form>
  );
}

export default ResetPasswordForm;
