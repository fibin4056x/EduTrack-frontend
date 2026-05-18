import {
  useMemo,
} from "react";

import AddTeacherModal from "../components/AddTeacherModal";

import TeacherTable from "../components/TeacherTable";

import useTeachers from "../hooks/useTeachers";

function TeachersPage() {
  // =========================================
  // DATA
  // =========================================
  const {
    teachers,
    loading,
    error,
    fetchTeachers,
  } = useTeachers();

  // =========================================
  // STATS
  // =========================================
  const stats = useMemo(() => {
    return teachers.reduce(
      (acc, teacher) => {
        acc.total += 1;

        if (
          teacher.status ===
          "active"
        ) {
          acc.active += 1;
        }

        if (
          teacher.status ===
          "suspended"
        ) {
          acc.suspended += 1;
        }

        return acc;
      },
      {
        total: 0,
        active: 0,
        suspended: 0,
      }
    );
  }, [teachers]);

  // =========================================
  // ERROR
  // =========================================
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Failed to load teachers.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* =====================================
          HEADER
      ===================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Teachers
          </h1>

          <p className="text-sm text-slate-500">
            Manage teacher accounts
            and faculty records
          </p>
        </div>

        <AddTeacherModal
          refreshTeachers={
            fetchTeachers
          }
        />
      </div>

      {/* =====================================
          STATS
      ===================================== */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm text-slate-500">
            Total Teachers
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {stats.total}
          </h2>
        </div>

        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm text-slate-500">
            Active Accounts
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {stats.active}
          </h2>
        </div>

        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm text-slate-500">
            Suspended Accounts
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {stats.suspended}
          </h2>
        </div>
      </div>

      {/* =====================================
          TABLE
      ===================================== */}
      {loading ? (
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-slate-500">
            Loading teachers...
          </p>
        </div>
      ) : teachers.length ===
        0 ? (
        <div className="rounded-lg border bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-800">
            No Teachers Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Add teachers to
            display them here.
          </p>
        </div>
      ) : (
        <TeacherTable
          teachers={teachers}
          refreshTeachers={
            fetchTeachers
          }
        />
      )}
    </div>
  );
}

export default TeachersPage;