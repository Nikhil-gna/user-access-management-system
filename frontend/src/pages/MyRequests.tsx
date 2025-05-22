import { useEffect, useState } from "react";
import { getRequests } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { AccessRequest } from "../types";

export default function MyRequests() {
  const { token } = useAuth();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getRequests(token!);
        setRequests(res.data);
        setErrorMessage("");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        if (message.includes("No requests found")) {
          setErrorMessage("You have not made any access requests yet.");
        } else {
          setErrorMessage(message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
          My Access Requests
        </h2>

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : errorMessage ? (
          <div className="text-center text-red-500">{errorMessage}</div>
        ) : requests.length === 0 ? (
          <div className="text-center text-gray-500">
            You have not made any requests yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-5 rounded-xl shadow-md border border-gray-200"
              >
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Software:</span>{" "}
                  {req.software.name}
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Access:</span>{" "}
                  {req.accessType}
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Reason:</span>{" "}
                  <span className="text-gray-600">{req.reason}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Status:</span>{" "}
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                      req.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : req.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
