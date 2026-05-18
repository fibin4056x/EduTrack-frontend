import { useMemo, useState } from "react";

import { deleteStudentApi } from "../api/student.api.js";

const getInitials = (name) => {
  if (!name) {
    return "ST";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part[0].toUpperCase()
    )
    .join("");
};

const StudentTable = ({
  students,
  fetchStudents,
  setEditingStudent,
  openModal,
}) => {
  // =========================================
  // STATES
  // =========================================
  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [genderFilter, setGenderFilter] =
    useState("all");

  // =========================================
  // DELETE STUDENT
  // =========================================
  const handleDelete = async (
    studentId
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this student?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteStudentApi(studentId);

      fetchStudents();
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data
          ?.message ||
          "Failed to delete student"
      );
    }
  };

  // =========================================
  // FILTERED STUDENTS
  // =========================================
  const filteredStudents =
    useMemo(() => {
      return students.filter(
        (student) => {
          const searchValue =
            search.toLowerCase();

          const matchesSearch =
            student.nameEnglish
              ?.toLowerCase()
              .includes(searchValue) ||
            student.nameArabic
              ?.toLowerCase()
              .includes(searchValue) ||
            student.classId?.name
              ?.toLowerCase()
              .includes(searchValue) ||
            student.divisionId?.name
              ?.toLowerCase()
              .includes(searchValue);

          const matchesStatus =
            statusFilter === "all"
              ? true
              : student.status ===
                statusFilter;

          const matchesGender =
            genderFilter === "all"
              ? true
              : student.gender ===
                genderFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesGender
          );
        }
      );
    }, [
      students,
      search,
      statusFilter,
      genderFilter,
    ]);

  // =========================================
  // EMPTY STATE
  // =========================================
  if (!students.length) {
    return (
      <div className="school-card p-8 text-center sm:p-10">
        <div className="school-empty-state">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-lg font-bold text-white">
            ST
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            No students found
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
            Add students one by one
            or use bulk upload to
            populate the register.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* =====================================
          HEADER
      ===================================== */}
      <div className="border-b border-slate-200 p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Student Register
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Total Students :{" "}
              {
                filteredStudents.length
              }
            </p>
          </div>

          {/* =====================================
              SEARCH + FILTERS
          ===================================== */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              className="school-input min-w-[240px]"
            />

            {/* STATUS FILTER */}
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="school-select"
            >
              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>

            {/* GENDER FILTER */}
            <select
              value={genderFilter}
              onChange={(event) =>
                setGenderFilter(
                  event.target.value
                )
              }
              className="school-select"
            >
              <option value="all">
                All Gender
              </option>

              <option value="male">
                Male
              </option>

              <option value="female">
                Female
              </option>

              <option value="other">
                Other
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* =====================================
          EMPTY FILTER RESULT
      ===================================== */}
      {!filteredStudents.length ? (
        <div className="p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-800">
            No matching students
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Try changing the search
            or filter options.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            {/* TABLE HEAD */}
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-4 text-left font-semibold text-slate-700">
                  Student
                </th>

                <th className="px-4 py-4 text-left font-semibold text-slate-700">
                  Class
                </th>

                <th className="px-4 py-4 text-left font-semibold text-slate-700">
                  Division
                </th>

                <th className="px-4 py-4 text-left font-semibold text-slate-700">
                  Gender
                </th>

                <th className="px-4 py-4 text-left font-semibold text-slate-700">
                  Status
                </th>

                <th className="px-4 py-4 text-left font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {filteredStudents.map(
                (student) => (
                  <tr
                    key={student._id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    {/* STUDENT */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-bold text-white">
                          {student.photo ? (
                            <img
                              src={
                                student.photo
                              }
                              alt={
                                student.nameEnglish
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitials(
                              student.nameEnglish
                            )
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {
                              student.nameEnglish
                            }
                          </p>

                          {student.nameArabic && (
                            <p className="text-xs text-slate-500">
                              {
                                student.nameArabic
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* CLASS */}
                    <td className="px-4 py-4 text-slate-700">
                      {student.classId
                        ?.name || "-"}
                    </td>

                    {/* DIVISION */}
                    <td className="px-4 py-4 text-slate-700">
                      {student.divisionId
                        ?.name || "-"}
                    </td>

                    {/* GENDER */}
                    <td className="px-4 py-4 capitalize text-slate-700">
                      {student.gender ||
                        "-"}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          student.status ===
                          "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {
                          student.status
                        }
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        {/* EDIT */}
                        <button
                          onClick={() => {
                            setEditingStudent(
                              student
                            );

                            openModal();
                          }}
                          className="rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                        >
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            handleDelete(
                              student._id
                            )
                          }
                          className="rounded-xl bg-rose-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentTable;