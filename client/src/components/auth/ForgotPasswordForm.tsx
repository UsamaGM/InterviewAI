import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ErrorAlert,
  LoadingSpinner,
  InputBox,
  StyledButton,
  SuccessAlert,
} from "@/components/common";
import { useAuth } from "@/hooks";

function ForgotPasswordForm() {
  const [email, setEmail] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const {
    forgotPassword,
    error: { forgotPassword: forgotPasswordError },
    loading: { forgotPassword: isLoading },
  } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) {
      const result = await forgotPassword(email);
      if (result?.success) {
        setSuccess("Password reset instructions have been sent to your email.");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {forgotPasswordError && (
        <ErrorAlert title="Error!" subtitle={forgotPasswordError} />
      )}
      {success && <SuccessAlert title="Success!" subtitle={success} />}

      <InputBox
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />

      <div className="flex justify-center text-sm gap-1">
        Remember your password?
        <Link
          to="/auth/login"
          className="w-fit text-blue-600 hover:text-blue-800 hover:underline"
        >
          Login
        </Link>
      </div>

      <StyledButton type="submit" disabled={isLoading}>
        {isLoading ? <LoadingSpinner size="sm" /> : "Send Reset Instructions"}
      </StyledButton>
    </form>
  );
}

export default ForgotPasswordForm;
