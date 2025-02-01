import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineMail, AiOutlineLogin } from "react-icons/ai";
import { BallTriangle } from "react-loader-spinner";
import { toast } from "react-toastify";
import API from "../../services/api";
import InputBox from "../../components/InputBox";
import RoundedButton from "../../components/RoundedButton";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", formData);
      localStorage.setItem("token", data.token);
      toast.success("Welcome back!", { position: "top-right" });
      navigate("/dashboard", { viewTransition: true });
    } catch (error) {
      toast.error(
        error.code === "ERR_NETWORK"
          ? "Network Error! Please try later."
          : error.response.data.message,
        { position: "top-right" }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex items-center justify-center bg-gradient-to-br from-light to-secondary min-h-[calc(100vh-4.5rem)]">
      <div className="bg-secondary/25 backdrop-blur-xl backdrop-filter text-light shadow-xl shadow-shadowDark rounded-3xl p-8 border border-secondaryContrast/25 max-w-md w-full flex flex-col items-center animate-fadeIn">
        <h1 className="text-3xl font-bold text-accent mb-6 animate-bounce">
          Welcome Back!
        </h1>
        <p className="text-center text-secondaryContrast mb-6">
          Please login to continue.
        </p>
        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          <InputBox
            label="Email"
            icon={AiOutlineMail}
            type="email"
            name="email"
            placeholder="someone@domain.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <InputBox
            label="Password"
            type="password"
            name="password"
            placeholder="Str0ngPa$$w0rd"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <RoundedButton
            title="Login"
            icon={AiOutlineLogin}
            submitButton
            className="bg-accent text-dark hover:bg-accentLight"
          />
        </form>
        <p className="text-sm text-secondaryContrast mt-4">
          {"Don't have an account? "}
          <span
            className="text-accentLight font-bold hover:text-accent cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
      </div>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-dark/50">
          <BallTriangle color="#1F5AC2" />
        </div>
      )}
    </div>
  );
}

export default Login;
