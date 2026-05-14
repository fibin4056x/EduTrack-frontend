import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

function DashboardLayout({ role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation =
    role === "principal"
      ? [
          {
            to: "/principal/dashboard",
            label: "Dashboard",
            description:
              "Whole school overview",
          },
          {
            to: "/principal/teachers",
            label: "Teachers",
            description:
              "Faculty records and status",
          },
          {
            to: "/principal/students",
            label: "Students",
            description:
              "Admissions and student profiles",
          },
          {
            to: "/principal/classes",
            label: "Classes",
            description:
              "Classrooms and assignments",
          },
          {
          to: "/principal/divisions",
         label: "Divisions",
         description:
        "Manage divisions and class teachers",
        },
        ]
      : [
          {
            to: "/teacher/dashboard",
            label: "Dashboard",
            description:
              "Daily classroom snapshot",
          },
          {
            to: "/teacher/students",
            label: "My Students",
            description:
              "Track student activity",
          },
        ];

  const roleMeta =
    role === "principal"
      ? {
          badge: "Principal Console",
          title: "LP School Administration",
          description:
            "Guide admissions, teacher records, classes, and daily school activity from one calm workspace.",
        }
      : {
          badge: "Teacher Workspace",
          title: "LP School Classroom Desk",
          description:
            "Stay focused on your learners, class routines, and the details that matter during the school day.",
        };

  return (
    <div className="min-h-screen px-3 py-3 sm:px-5 sm:py-5">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1600px] flex-col overflow-hidden rounded-[36px] border border-white/70 bg-white/45 shadow-2xl backdrop-blur-xl lg:flex-row">
        <aside className="relative overflow-hidden border-b border-slate-800 bg-slate-950 px-6 py-8 text-white lg:min-h-full lg:w-80 lg:border-b-0 lg:border-r">
          <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.35),transparent_62%)]" />
          <div className="absolute -right-14 top-24 h-32 w-32 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              LP School
            </div>

            <div className="mt-8">
              <h2 className="text-3xl font-bold text-white">
                Student Life
                <br />
                Management
              </h2>

              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-300">
                A brighter school dashboard for teachers and principals to manage everyday work with clarity.
              </p>
            </div>

            <nav className="mt-10 space-y-3">
              {navigation.map((item) => {
                const isActive =
                  location.pathname === item.to;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`block rounded-[24px] border px-4 py-4 transition duration-200 ${
                      isActive
                        ? "border-sky-300/60 bg-white text-slate-950 shadow-lg"
                        : "border-white/10 bg-white/5 text-slate-100 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <span className="block text-sm font-semibold">
                      {item.label}
                    </span>

                    <span
                      className={`mt-1 block text-xs leading-5 ${
                        isActive
                          ? "text-slate-500"
                          : "text-slate-300"
                      }`}
                    >
                      {item.description}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-300">
                Campus Focus
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-200">
                Keep records tidy, support teachers quickly, and make student updates feel calm during a busy school day.
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-h-[70vh] flex-1 flex-col">
          <header className="border-b border-slate-200/70 bg-white/75 px-5 py-5 backdrop-blur sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="school-pill">
                  {roleMeta.badge}
                </span>

                <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {roleMeta.title}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {roleMeta.description}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Active Role
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {role === "principal"
                      ? "Principal Access"
                      : "Teacher Access"}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="school-button-primary"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
