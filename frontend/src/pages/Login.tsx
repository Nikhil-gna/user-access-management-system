import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login: loginUser, role, user, loading } = useAuth();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (!loading && user && role && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate("/", { replace: true });
    }
  }, [loading, user, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const result = loginSchema.safeParse({ username, password });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      const res = await login({ username, password });
      loginUser(res.data.token, res.data.role, res.data.username);
    } catch (err) {
      console.error("Login error:", err);
      setSubmitError("Invalid username or password.");
    }
  };

  return (
    <div className=" flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full mt-15 max-w-md bg-white p-8 rounded-xl shadow-lg border">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back to Access Manager
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {submitError && (
            <p className="text-red-600 text-sm text-center">{submitError}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New here?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
