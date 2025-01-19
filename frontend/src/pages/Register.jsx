import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogin, AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { BallTriangle } from "react-loader-spinner";
import { toast } from "react-toastify";
import InputBox from "../components/InputBox";
import API from "../services/api";
import RoundedButton from "../components/RoundedButton";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "candidate",
  });
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
      await API.post("/auth/register", formData);
      toast.success(
        "Registered successfully! Please confirm your email and then log in.",
        { position: "top-right" }
      );
      navigate("/login");
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
    <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-4.5rem)] bg-gradient-to-br from-light to-secondary">
      <div className="bg-secondary/25 flex flex-col items-center justify-center backdrop-blur-xl text-dark border border-secondaryContrast/25 shadow-lg shadow-dark/50 rounded-3xl p-8 max-w-md w-full animate-fadeIn">
        <h1 className="text-3xl font-bold text-accent mb-5 animate-bounce">
          Create Account
        </h1>
        <p className="text-center text-secondaryContrast mb-5">
          Join us and find the best opportunities tailored for you.
        </p>
        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          <InputBox
            label="Username"
            icon={AiOutlineUser}
            type="text"
            name="username"
            placeholder="Someone"
            value={formData.username}
            onChange={handleChange}
            required
          />
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
          <RoleSelector />
          <RoundedButton
            icon={AiOutlineLogin}
            title="Register"
            submitButton
            className="bg-accent text-dark hover:bg-accentLight"
          />
        </form>
        <p className="text-sm text-secondaryContrast mt-4">
          Already have an account?{" "}
          <span
            className="text-accentLight font-bold hover:text-accent cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
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

  function RoleSelector() {
    return (
      <div className="flex justify-between font-bold">
        <label
          className={`flex items-center space-x-2 cursor-pointer ${
            formData.role === "recruiter" ? "text-accentLight" : "text-dark"
          }`}
        >
          <input
            type="radio"
            name="role"
            value="recruiter"
            checked={formData.role === "recruiter"}
            onChange={handleChange}
            className="accent-accent"
          />
          <span>Recruiter</span>
        </label>
        <label
          className={`flex items-center space-x-2 cursor-pointer ${
            formData.role === "candidate" ? "text-accentLight" : "text-dark"
          }`}
        >
          <input
            type="radio"
            name="role"
            value="candidate"
            checked={formData.role === "candidate"}
            onChange={handleChange}
            className="accent-accent"
          />
          <span>Candidate</span>
        </label>
      </div>
    );
  }
}

export default Register;
