import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
function DashboardLayout({ role }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
  logout();
  navigate("/login");
};

  return (
    <div className="flex h-screen">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-lg font-semibold mb-6">SLMS</h2>

        <nav className="flex flex-col gap-3 text-sm">
          {role === "principal" && (
            <>
              <Link to="/principal/dashboard">Dashboard</Link>
              <Link to="/principal/teachers">Teachers</Link>
              <Link to="/principal/students">Students</Link>
              <Link to="/principal/classes">Classes</Link>
            </>
          )}

          {role === "teacher" && (
            <>
              <Link to="/teacher/dashboard">Dashboard</Link>
              <Link to="/teacher/students">My Students</Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        
        {/* Topbar */}
        <header className="h-14 border-b flex items-center justify-end px-6">
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-500"
          >
            Logout
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;