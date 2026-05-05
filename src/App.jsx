import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { authStorage } from "./api";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

function ProtectedRoute({
  children,
}) {
  const token =
    authStorage.getToken();

  return token ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;
