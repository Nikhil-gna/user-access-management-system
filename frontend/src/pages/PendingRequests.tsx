import { useEffect, useState } from "react";
import { getRequests, updateRequestStatus } from "../services/api";
import type { AccessRequest } from "../types";
import { useAuth } from "../context/AuthContext";

export default function PendingRequests() {
  const { token } = useAuth();
  const [requests, setRequests] = useState<AccessRequest[]>([]);

  const fetchRequests = async () => {
    try {
      const response = await getRequests(token!);
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateRequestStatus(id, status, token!);
      fetchRequests();
    } catch (error) {
      console.error("Failed to update request status", error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Pending Access Requests
        </h2>

        {requests.length === 0 ? (
          <p className="text-gray-500 text-center">No pending requests.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-5 rounded-xl shadow border border-gray-200 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-gray-700">User:</span>{" "}
                    {req.user.username}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Software:</span>{" "}
                    {req.software.name}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Access:</span>{" "}
                    {req.accessType}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Reason:</span>{" "}
                    <span className="text-gray-600">{req.reason}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>{" "}
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded-full ${
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

                {req.status === "Pending" && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleStatusChange(req.id, "Approved")}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(req.id, "Rejected")}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
