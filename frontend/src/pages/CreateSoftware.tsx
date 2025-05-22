import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createSoftware, getAllSoftware } from "../services/api";
import { ApiError } from "../utils/fetchWithHandling";
import type { Software } from "../types";

const AVAILABLE_ACCESS_LEVELS = ["Read", "Write", "Admin"];

export default function CreateSoftwarePage() {
  const { token } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAccessLevels, setSelectedAccessLevels] = useState<string[]>(
    []
  );
  const [softwares, setSoftwares] = useState<Software[]>([]);

  const fetchSoftwares = async () => {
    try {
      const res = await getAllSoftware(token!);
      setSoftwares(res.data);
    } catch (err) {
      console.error("Failed to fetch softwares:", err);
    }
  };

  useEffect(() => {
    fetchSoftwares();
  }, [token]);

  const toggleAccessLevel = (level: string) => {
    setSelectedAccessLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleSubmit = async () => {
    try {
      const body = {
        name,
        description,
        accessLevels: selectedAccessLevels,
      };

      const res = await createSoftware(body, token!);
      alert(res.message || "Software created successfully");

      setName("");
      setDescription("");
      setSelectedAccessLevels([]);
      setShowModal(false);
      fetchSoftwares();
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
        console.error("Validation errors:", err.errors);
      } else {
        alert("Unexpected error occurred");
      }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Available Software
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Software
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {softwares.length > 0 ? (
          softwares.map((sw) => (
            <div
              key={sw.id}
              className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">{sw.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{sw.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                <span className="font-medium">Access Levels:</span>{" "}
                {sw.accessLevels.join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">
            No software available yet.
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
              Create New Software
            </h3>
            <div className="flex flex-col gap-4">
              <input
                placeholder="Software Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 p-2 rounded-md resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Access Levels ({selectedAccessLevels.length}/3)
                </label>
                <div className="flex flex-wrap gap-3">
                  {AVAILABLE_ACCESS_LEVELS.map((level) => (
                    <label
                      key={level}
                      className="flex items-center space-x-2 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAccessLevels.includes(level)}
                        onChange={() => toggleAccessLevel(level)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span>{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={!name || selectedAccessLevels.length === 0}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
