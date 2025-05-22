import { useEffect, useState } from "react";
import { getAllSoftware, submitRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Software } from "../types";

export default function RequestAccess() {
  const { token } = useAuth();
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [accessType, setAccessType] = useState("Read");
  const [reason, setReason] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        const res = await getAllSoftware(token!);
        setSoftwareList(res.data);
      } catch (err) {
        console.error("Error fetching software:", err);
        alert(err instanceof Error ? err.message : "Something went wrong.");
      }
    };

    fetchSoftware();
  }, [token]);

  const handleSubmit = async () => {
    try {
      const res = await submitRequest(
        {
          softwareId: +selectedId,
          accessType,
          reason,
        },
        token!
      );

      if (res.success) {
        setSuccessMessage("Access request submitted successfully!");
        setSelectedId("");
        setAccessType("Read");
        setReason("");
        setTimeout(() => setSuccessMessage(""), 3000); 
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to submit request.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Request Software Access
        </h2>

        {successMessage && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm text-center">
            {successMessage}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Select Software
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">-- Choose --</option>
              {softwareList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Access Type
            </label>
            <select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option>Read</option>
              <option>Write</option>
              <option>Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Reason for Request
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly explain why you need access..."
              className="w-full border rounded p-2 min-h-[100px]"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedId || !reason}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition disabled:opacity-50"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
