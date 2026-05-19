import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-5">
      {/* Brand */}
      <Link
        to="/login"
        className="flex items-center gap-3 group transition-transform duration-200"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-extrabold text-white shadow-lg shadow-indigo-500/20 ring-2 ring-white group-hover:scale-105 transition-transform duration-200">
          SL
        </div>

        <div>
          <h1 className="text-base font-bold text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
            SLMS
          </h1>
          <p className="text-xs font-medium text-slate-400">
            LP School Hub
          </p>
        </div>
      </Link>

      {/* Status */}
      <div className="hidden sm:block">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/50 shadow-sm shadow-indigo-100/10">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Secure Access Portal
        </span>
      </div>
    </div>
  );
}

export default Navbar;