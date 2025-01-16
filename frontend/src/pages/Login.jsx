import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineMail, AiOutlineLogin } from "react-icons/ai";
import { BallTriangle } from "react-loader-spinner";
import { toast } from "react-toastify";
import API from "../services/api";
import TextBox from "../components/TextBox";
import RoundedButton from "../components/RoundedButton";

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
    <div className="relative min-h-screen flex items-center justify-center bg-tertiary">
      <div className="bg-light shadow-2xl shadow-dark text-dark p-6 rounded-lg max-w-sm w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <TextBox
            label="Email"
            icon={AiOutlineMail}
            type="email"
            name="email"
            placeholder="someone@domain.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextBox
            label="Password"
            type="password"
            name="password"
            placeholder="Str0ngPa$$w0rd"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <RoundedButton title="Login" icon={AiOutlineLogin} submitButton />
        </form>
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
