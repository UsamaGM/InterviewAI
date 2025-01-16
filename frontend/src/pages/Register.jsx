import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogin, AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { BallTriangle } from "react-loader-spinner";
import { toast } from "react-toastify";
import API from "../services/api";
import TextBox from "../components/TextBox";
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
    <div className="relative min-h-screen flex items-center justify-center bg-tertiary">
      <div className="bg-white shadow-2xl shadow-dark p-6 rounded-lg max-w-sm w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <TextBox
            label="Username"
            icon={AiOutlineUser}
            type="text"
            name="username"
            placeholder="Someone"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextBox
            label="Email"
            icon={AiOutlineMail}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextBox
            label="Password"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Role />

          <RoundedButton icon={AiOutlineLogin} title="Register" submitButton />
        </form>
      </div>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-dark/50">
          <BallTriangle color="#1F5AC2" />
        </div>
      )}
    </div>
  );

  function Role() {
    return (
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            name="role"
            id="recruiter"
            value="recruiter"
            checked={formData.role === "recruiter"}
            onChange={handleChange}
          />
          <label htmlFor="recruiter">Recruiter</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            name="role"
            id="candidate"
            value="candidate"
            checked={formData.role === "candidate"}
            onChange={handleChange}
          />
          <label htmlFor="candidate">Candidate</label>
        </div>
      </div>
    );
  }
}

export default Register;
