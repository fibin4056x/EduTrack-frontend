import { Outlet } from "react-router-dom";

import Navbar from "../components/ui/Navbar";

function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50/60 via-slate-50 to-violet-50/60 px-4 py-12">
      {/* Decorative gradient glowing blobs */}
      <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-indigo-200/40 blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-violet-200/40 blur-[100px]" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* =====================================
            NAVBAR
        ===================================== */}
        <Navbar />

        {/* =====================================
            AUTH CARD
        ===================================== */}
        <div className="mt-8 rounded-3xl border border-white/80 bg-white/70 p-6 shadow-2xl shadow-indigo-100/40 backdrop-blur-xl sm:p-10 animate-in fade-in zoom-in-95 duration-500">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;