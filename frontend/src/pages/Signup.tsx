import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { signup } from "../services/api";
import { ApiError } from "../utils/fetchWithHandling";

// Validation schema
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setSubmitError(null);

    const result = signupSchema.safeParse({ username, password });

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
      const data = await signup({ username, password });

      if (data.success) {
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        setSubmitError(data.message || "Signup failed.");
      }
    } catch (err) {
      if (err instanceof ApiError && err.errors?.length) {
        setSubmitError(`Validation Error: ${err.errors[0].message}`);
      } else {
        console.error("Signup error:", err);
        setSubmitError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className=" flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full mt-15 max-w-md bg-white p-8 rounded-xl shadow-lg border">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Create an Account
        </h2>

        <div className="flex flex-col gap-5">
          <div>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
          >
            Signup
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
