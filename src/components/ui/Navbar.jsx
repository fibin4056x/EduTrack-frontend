import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="h-14 border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/login" className="text-lg font-semibold">
          SLMS
        </Link>

        <span className="text-sm text-gray-500">
          School Learning System
        </span>
      </div>
    </header>
  );
}

export default Navbar;