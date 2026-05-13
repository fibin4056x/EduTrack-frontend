import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import LoginPage from "../features/auth/pages/LoginPage";

import PrincipalDashboard from "../features/principal/dashboard/pages/DashboardPage";

import TeacherDashboard from "../features/teacher/dashboard/pages/DashboardPage";

import TeachersPage from "../features/principal/teachers/pages/TeachersPage";

import ProtectedRoute from "./ProtectedRoute";



function AppRoutes() {
  return (
    <Routes>

      {/* =========================
          AUTH
      ========================= */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={<LoginPage />}
        />
      </Route>



      {/* =========================
          PRINCIPAL
      ========================= */}
      <Route
        element={
          <ProtectedRoute role="principal">
            <DashboardLayout role="principal" />
          </ProtectedRoute>
        }
      >

        <Route
          path="/principal/dashboard"
          element={<PrincipalDashboard />}
        />

        <Route
          path="/principal/teachers"
          element={<TeachersPage />}
        />

      </Route>



      {/* =========================
          TEACHER
      ========================= */}
      <Route
        element={
          <ProtectedRoute role="teacher">
            <DashboardLayout role="teacher" />
          </ProtectedRoute>
        }
      >

        <Route
          path="/teacher/dashboard"
          element={<TeacherDashboard />}
        />

      </Route>



      {/* =========================
          DEFAULT
      ========================= */}
      <Route
        path="*"
        element={<Navigate to="/login" />}
      />

    </Routes>
  );
}

export default AppRoutes;