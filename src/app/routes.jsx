import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

import LoginPage from "../features/auth/pages/LoginPage.jsx";

import PrincipalDashboard from "../features/principal/dashboard/pages/DashboardPage.jsx";

import TeacherDashboard from "../features/teacher/dashboard/pages/DashboardPage.jsx";

import TeachersPage from "../features/principal/teachers/pages/TeachersPage.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

import ClassesPage from "../features/principal/classes/pages/ClassesPage.jsx";


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

      <Route
      path="/principal/classes"
     element={<ClassesPage />}
     />


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