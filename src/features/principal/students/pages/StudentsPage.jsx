import { useState } from "react";

import useStudents from "../hooks/useStudents";
import AddStudentModal from "../components/AddStudentModal";
import StudentsTable from "../components/StudentTable.jsx";

const StudentsPage = () => {
  const {
    students,
    loading,
    fetchStudents,
  } = useStudents();

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingStudent, setEditingStudent] =
    useState(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const totalStudents = students.length;

  const activeStudents =
    students.filter(
      (student) =>
        student.status !== "inactive"
    ).length;

  const photoProfiles =
    students.filter((student) =>
      Boolean(student.photo)
    ).length;

  const supportProfiles =
    students.filter(
      (student) =>
        student.economicCategory ===
        "BPL"
    ).length;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_55%,#38bdf8_100%)] px-6 py-8 text-white shadow-2xl sm:px-8">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_48%)]" />
        <div className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-sky-300/20 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-50">
              LP School Student Registry
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
              A kinder, cleaner student management desk for daily school work.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-sky-50/90 sm:text-base">
              Review admissions, organize classroom placement, and keep student records polished for principals and teachers without changing your current workflow.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-[24px] border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-100">
                Student Profiles
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {totalStudents}
              </p>
            </div>

            <button
              onClick={() =>
                setIsModalOpen(true)
              }
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Add Student
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="school-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            Total Students
          </p>

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {totalStudents}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Complete student profiles currently visible in the register.
          </p>
        </div>

        <div className="school-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            Active Records
          </p>

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {activeStudents}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Students ready for everyday attendance and class tracking.
          </p>
        </div>

        <div className="school-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            Photo Profiles
          </p>

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {photoProfiles}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Records with a visual profile for faster teacher recognition.
          </p>
        </div>

        <div className="school-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            Support Category
          </p>

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {supportProfiles}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Learners marked under BPL support for school follow-up.
          </p>
        </div>
      </section>

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
        <StudentsTable
          students={students}
          fetchStudents={fetchStudents}
          setEditingStudent={setEditingStudent}
          openModal={() =>
            setIsModalOpen(true)
          }
        />
      )}

      <AddStudentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingStudent={editingStudent}
        fetchStudents={fetchStudents}
        clearEdit={() =>
          setEditingStudent(null)
        }
      />
    </div>
  );
};

export default StudentsPage;
