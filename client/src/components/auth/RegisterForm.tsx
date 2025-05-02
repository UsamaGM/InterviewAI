import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoadingSpinner,
  InputBox,
  PasswordBox,
  ErrorAlert,
  StyledButton,
} from "@/components/common";
import { useAuth } from "@/hooks";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["recruiter", "candidate"], {
    required_error: "Please select a role",
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "candidate",
    },
  });

  const {
    register: authRegister,
    error: { registering: registerError },
    loading: { registering },
  } = useAuth();

  const onSubmit = async (data: RegisterFormData) => {
    await authRegister(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {registerError && <ErrorAlert title="Error!" subtitle={registerError} />}

      <InputBox
        id="name"
        type="text"
        placeholder="Name"
        {...register("name")}
        error={errors.name?.message}
      />

      <InputBox
        id="email"
        type="email"
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
              value="recruiter"
              {...register("role")}
            />
            <label className="ml-2" htmlFor="recruiter">
              Hire
            </label>
          </div>
          <div className="flex-1">
            <input
              type="radio"
              id="candidate"
              value="candidate"
              {...register("role")}
            />
            <label className="ml-2" htmlFor="candidate">
              Get hired
            </label>
          </div>
        </div>
        {errors.role?.message && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>

      <StyledButton type="submit" disabled={registering}>
        {registering ? <LoadingSpinner size="sm" /> : "Register"}
      </StyledButton>
    </form>
  );
}

export default RegisterForm;
