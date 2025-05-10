import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ErrorAlert,
  LoadingSpinner,
  InputBox,
  PasswordBox,
  StyledButton,
} from "@/components/common";
import { useAuth } from "@/hooks";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    login,
    error: { loggingIn: loginError },
    loading: { loggingIn },
  } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
      {loginError && <ErrorAlert title="Error!" subtitle={loginError} />}

      <InputBox
        id="email"
        placeholder="Email"
        {...register("email")}
        error={errors.email?.message}
      />

      <PasswordBox
        id="password"
        placeholder="Password"
        {...register("password")}
        error={errors.password?.message}
      />

      <Link
        to="/auth/forgot-password"
        className="text-sm text-blue-600 hover:text-blue-800 hover:underline -mt-4 text-end mr-2"
      >
        Forgot Password?
      </Link>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex justify-center text-sm gap-1">
          Don't have an account?
          <Link
            to="/auth/register"
            className="w-fit text-blue-600 hover:text-blue-800 hover:underline hover:after"
          >
            Register
          </Link>
        </div>
      </div>

      <div className="flex">
        <StyledButton type="submit" disabled={loggingIn}>
          {loggingIn ? <LoadingSpinner size="sm" /> : "Login"}
        </StyledButton>
      </div>
    </form>
  );
}

export default LoginForm;
