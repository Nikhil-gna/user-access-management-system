import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {!user ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Access Management System
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Securely manage access to enterprise software tools. Control who
              gets what access — efficiently and safely.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                className="px-6 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 rounded bg-green-600 text-white font-medium hover:bg-green-700 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-semibold text-gray-800">
                  Welcome back,{" "}
                  <span className="text-blue-600">{user.username}</span>
                </h2>
                <p className="text-gray-500 mt-1">Role: {user.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {user.role === "Admin" && (
                <Link
                  to="/create-software"
                  className="bg-white border hover:shadow-md transition rounded-lg p-5 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-medium text-purple-600">
                      Create Software
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Add new software and define access levels for your
                      organization.
                    </p>
                  </div>
                  <span className="mt-4 text-sm text-purple-500 font-semibold">
                    Go to Form →
                  </span>
                </Link>
              )}

              {user.role === "Employee" && (
                <>
                  <Link
                    to="/request-access"
                    className="bg-white border hover:shadow-md transition rounded-lg p-5 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-xl font-medium text-blue-600">
                        Request Access
                      </h3>
                      <p className="text-gray-600 mt-2">
                        Request access to available software systems with
                        specified levels.
                      </p>
                    </div>
                    <span className="mt-4 text-sm text-blue-500 font-semibold">
                      Request Now →
                    </span>
                  </Link>

                  <Link
                    to="/my-requests"
                    className="bg-white border hover:shadow-md transition rounded-lg p-5 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-xl font-medium text-green-600">
                        My Requests
                      </h3>
                      <p className="text-gray-600 mt-2">
                        Track the status of all your current and past access
                        requests.
                      </p>
                    </div>
                    <span className="mt-4 text-sm text-green-500 font-semibold">
                      View Requests →
                    </span>
                  </Link>
                </>
              )}

              {user.role === "Manager" && (
                <Link
                  to="/pending-requests"
                  className="bg-white border hover:shadow-md transition rounded-lg p-5 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-medium text-yellow-600">
                      Manage Requests
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Review, approve, or reject pending access requests from
                      employees.
                    </p>
                  </div>
                  <span className="mt-4 text-sm text-yellow-500 font-semibold">
                    Manage Now →
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
