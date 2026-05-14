import { useState } from "react";

import useClasses from "../hooks/useClasses.js";
import ClassForm from "../components/ClassForm.jsx";
import ClassesTable from "../components/ClassesTable.jsx";

const ClassesPage = () => {
  const {
    classes,
    loading,
    fetchClasses,
  } = useClasses();

  const [editingClass, setEditingClass] =
    useState(null);

  const activeClasses =
    classes.filter(
      (item) => item.status !== "inactive"
    ).length;

  const inactiveClasses =
    classes.filter(
      (item) => item.status === "inactive"
    ).length;

  const latestAcademicYear =
    classes[0]?.academicYear || "Not added";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#111827_0%,#0f766e_55%,#2dd4bf_100%)] px-6 py-8 text-white shadow-2xl sm:px-8">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_48%)]" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-teal-50">
              LP School Class Register
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
              Organize classes by year, keep the register simple, and make the school structure clear.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-teal-50/90 sm:text-base">
              This class section now follows the real class model: class name, academic year, and status only.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-100">
              Latest Academic Year
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {latestAcademicYear}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="school-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            Total Classes
          </p>

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {classes.length}
          </p>
        </div>

        <div className="school-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            Active Classes
          </p>

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {activeClasses}
          </p>
        </div>

        <div className="school-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            Inactive Classes
          </p>

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {inactiveClasses}
          </p>
        </div>
      </section>

      <ClassForm
        editingClass={editingClass}
        fetchClasses={fetchClasses}
        clearEdit={() =>
          setEditingClass(null)
        }
      />

      {loading ? (
        <div className="school-card p-6 sm:p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-56 rounded-full bg-slate-200" />
            <div className="h-20 rounded-[28px] bg-slate-100" />
            <div className="h-20 rounded-[28px] bg-slate-100" />
            <div className="h-20 rounded-[28px] bg-slate-100" />
          </div>
        </div>
      ) : (
        <ClassesTable
          classes={classes}
          fetchClasses={fetchClasses}
          setEditingClass={setEditingClass}
        />
      )}
    </div>
  );
};

export default ClassesPage;
