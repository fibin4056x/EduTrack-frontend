import { Outlet } from "react-router-dom";

import Navbar from "../components/ui/Navbar";

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md">
        {/* =====================================
            NAVBAR
        ===================================== */}
        <Navbar />

        {/* =====================================
            AUTH CARD
        ===================================== */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;