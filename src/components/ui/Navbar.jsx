import { Link } from "react-router-dom";

function Navbar() {

return (
  <div className="flex items-center justify-between border-b pb-4">

    {/* Brand */}
    <Link
      to="/login"
      className="flex items-center gap-3"
    >

      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-900 text-sm font-bold text-white">
        SL
      </div>

      <div>
        <h1 className="text-sm font-semibold text-gray-800">
          SLMS
        </h1>

        <p className="text-xs text-gray-500">
          LP School
        </p>
      </div>

    </Link>

    {/* Status */}
    <div className="hidden sm:block">
      <span className="badge-muted">
        Secure Access
      </span>
    </div>

  </div>
);
}

export default Navbar;