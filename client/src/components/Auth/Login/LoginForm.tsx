import { useState } from "react";
import InputBox from "../../InputBox/InputBox";
import { Link, useNavigate } from "react-router-dom";
import { handleError } from "../../../utils/errorHandler";
import api from "../../../services/api";
import { AxiosResponse } from "axios";

function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response: AxiosResponse = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      
      // Get user role and redirect accordingly
      const userResponse = await api.get("/users/profile", {headers: {Authorization: `Bearer ${response.data.token}`}});
      console.log(userResponse.data);
      const userRole = userResponse.data.role;
      
      if (userRole === "recruiter") {
        navigate("/interviews");
      } else if (userRole === "candidate") {
        navigate("/candidate/dashboard");
      } else {
        // Fallback
        navigate("/profile");
      }
    } catch (error) {
      setError(handleError(error, "Failed to log in"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}
      
      <InputBox
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <InputBox
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link to="/register" className="text-blue-600 hover:text-blue-800">
            Don't have an account? Register
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
