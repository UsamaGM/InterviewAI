import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ErrorAlert,
  LoadingSpinner,
  InputBox,
  StyledButton,
  SuccessAlert,
} from "@/components/common";
import { useAuth } from "@/hooks";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordForm() {
  console.log("ForgotPasswordForm");
  const [success, setSuccess] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const {
    forgotPassword,
    error: { forgotPassword: forgotPasswordError },
    loading: { forgotPassword: isLoading },
  } = useAuth();

  const navigate = useNavigate();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const result = await forgotPassword(data.email);
    if (result?.success) {
      setSuccess("Password reset instructions have been sent to your email.");
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {forgotPasswordError && (
        <ErrorAlert title="Error!" subtitle={forgotPasswordError} />
      )}
      {success && <SuccessAlert title="Success!" subtitle={success} />}

      <InputBox
        id="email"
        type="email"
        placeholder="Email"
        {...register("email")}
        error={errors.email?.message}
        disabled={isLoading || !!success}
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

      <StyledButton type="submit" disabled={isLoading || !!success}>
        {isLoading ? <LoadingSpinner size="sm" /> : "Send Reset Instructions"}
      </StyledButton>
    </form>
  );
}

export default ForgotPasswordForm;
