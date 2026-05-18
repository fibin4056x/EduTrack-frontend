import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import {
  useAuth,
} from "../features/auth/hooks/useAuth";

function DashboardLayout({ role }) {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const { logout } =
    useAuth();

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const handleLogout =
    () => {

      logout();

      navigate("/login");
    };

  const navigation =
    role === "principal"
      ? [
          {
            to:
              "/principal/dashboard",
            label:
              "Dashboard",
          },

          {
            to:
              "/principal/students",
            label:
              "Students",
          },

          {
            to:
              "/principal/teachers",
            label:
              "Teachers",
          },

          {
            to:
              "/principal/classes",
            label:
              "Classes",
          },

          {
            to:
              "/principal/divisions",
            label:
              "Divisions",
          },
        ]
      : [
          {
            to:
              "/teacher/dashboard",
            label:
              "Dashboard",
          },

          {
            to:
              "/teacher/students",
            label:
              "Students",
          },
        ];

  return (

  <div className="min-h-screen bg-gray-100">
  <div className="flex min-h-screen">

    {/* Sidebar */}
    <aside
      className={`fixed left-0 top-0 z-50 h-full w-56 bg-white border-r transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">

        {/* Logo */}
        <div className="border-b p-5">
          <h1 className="text-xl font-bold text-gray-800">
            SLMS
          </h1>

          <p className="text-sm text-gray-500">
            School Management
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navigation.map((item) => {
            const isActive =
              location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() =>
                  setSidebarOpen(false)
                }
                className={`block rounded-md px-4 py-2 text-sm transition ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t p-3">
          <button
            onClick={handleLogout}
            className="w-full rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>

    {/* Main */}
    <div className="flex flex-1 flex-col lg:ml-56">

      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-4 py-3">

        <div className="flex items-center gap-3">

          <button
            onClick={() =>
              setSidebarOpen(true)
            }
            className="border rounded px-3 py-1 text-sm lg:hidden"
          >
            Menu
          </button>

          <h2 className="text-lg font-semibold text-gray-800">
            {role === "principal"
              ? "Principal Dashboard"
              : "Teacher Dashboard"}
          </h2>
        </div>

        <div className="text-sm text-gray-600">
          {role}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  </div>
</div>
  );
}

export default DashboardLayout;