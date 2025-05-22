import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateSoftware from "./pages/CreateSoftware";
import RequestAccess from "./pages/RequestAccess";
import PendingRequests from "./pages/PendingRequests";
import MyRequests from "./pages/MyRequests";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />

          <Route
            path="/create-software"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <CreateSoftware />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request-access"
            element={
              <ProtectedRoute allowedRoles={["Employee"]}>
                <RequestAccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pending-requests"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <PendingRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-requests"
            element={
              <ProtectedRoute allowedRoles={["Employee"]}>
                <MyRequests />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
