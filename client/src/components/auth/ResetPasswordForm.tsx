import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ErrorAlert,
  LoadingSpinner,
  StyledButton,
  SuccessAlert,
  PasswordBox,
} from "@/components/common";
import { useAuth } from "@/hooks";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const [success, setSuccess] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { token } = useParams();
  const navigate = useNavigate();

  const {
    resetPassword,
    error: { resetPassword: resetPasswordError },
    loading: { resetPassword: isLoading },
  } = useAuth();

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (token) {
      const result = await resetPassword(token, data.password);
      if (result?.success) {
        setSuccess("Password has been reset successfully!");
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {resetPasswordError && (
        <ErrorAlert title="Error!" subtitle={resetPasswordError} />
      )}
      {success && <SuccessAlert title="Success!" subtitle={success} />}

      <PasswordBox
        id="password"
        placeholder="New Password"
        {...register("password")}
        error={errors.password?.message}
        required
        disabled={isLoading}
      />

      <PasswordBox
        id="confirmPassword"
        placeholder="Confirm New Password"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
        required
        disabled={isLoading}
      />

      <StyledButton type="submit" disabled={isLoading}>
        {isLoading ? <LoadingSpinner size="sm" /> : "Reset Password"}
      </StyledButton>
    </form>
  );
}

export default ResetPasswordForm;
