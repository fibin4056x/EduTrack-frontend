import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import useMyStudents from "../hooks/useMyStudents.js";

const formatDate = (value) => {
  if (!value) {
    return "Not added";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Not added";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const getInitials = (
  name
) => {
  if (!name) {
    return "ST";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part[0].toUpperCase()
    )
    .join("");
};

const MyStudentsPage = () => {
  const location =
    useLocation();

  // =========================================
  // STATES
  // =========================================
  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  // =========================================
  // HOOK
  // =========================================
  const {
    divisions,
    selectedDivisionId,
    setSelectedDivisionId,
    students,
    loadingDivisions,
    loadingStudents,
  } = useMyStudents();

  // =========================================
  // ROUTE DIVISION
  // =========================================
  const routeDivisionId =
    location.state
      ?.selectedDivisionId ||
    "";

  const hasAppliedRouteDivision =
    useRef(false);

  useEffect(() => {
    if (
      hasAppliedRouteDivision.current ||
      !routeDivisionId ||
      divisions.length === 0
    ) {
      return;
    }

    const exists =
      divisions.some(
        (division) =>
          division._id ===
          routeDivisionId
      );

    if (exists) {
      setSelectedDivisionId(
        routeDivisionId
      );
    }

    hasAppliedRouteDivision.current =
      true;
  }, [
    divisions,
    routeDivisionId,
    setSelectedDivisionId,
  ]);

  // =========================================
  // SELECTED DIVISION
  // =========================================
  const selectedDivision =
    divisions.find(
      (division) =>
        division._id ===
        selectedDivisionId
    ) || null;

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
              .includes(searchValue);

          const matchesStatus =
            statusFilter === "all"
              ? true
              : student.status ===
                statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      students,
      search,
      statusFilter,
    ]);

  return (
    <div className="space-y-6">
      {/* =====================================
          HEADER
      ===================================== */}
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            My Students
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage students
            assigned to your
            classroom divisions.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Total Students
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loadingStudents
              ? "..."
              : filteredStudents.length}
          </p>
        </div>
      </section>

      {/* =====================================
          MAIN LAYOUT
      ===================================== */}
      <div className="grid gap-5 lg:grid-cols-[260px,1fr]">
        {/* =====================================
            DIVISION SIDEBAR
        ===================================== */}
        <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-bold text-slate-900">
              Divisions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Assigned classroom
              groups.
            </p>
          </div>

          <div className="space-y-2 p-4">
            {loadingDivisions ? (
              <div className="space-y-3">
                <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />

                <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
              </div>
            ) : divisions.length ===
              0 ? (
              <p className="text-sm text-slate-500">
                No divisions assigned.
              </p>
            ) : (
              divisions.map(
                (division) => {
                  const isActive =
                    division._id ===
                    selectedDivisionId;

                  return (
                    <button
                      key={
                        division._id
                      }
                      type="button"
                      onClick={() =>
                        setSelectedDivisionId(
                          division._id
                        )
                      }
                      className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                        isActive
                          ? "bg-slate-900 text-white shadow-lg"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <p className="text-sm font-semibold">
                        {
                          division
                            .classId
                            ?.name
                        }
                      </p>

                      <p className="mt-1 text-xs opacity-80">
                        {
                          division.name
                        }
                      </p>
                    </button>
                  );
                }
              )
            )}
          </div>
        </aside>

        {/* =====================================
            STUDENTS SECTION
        ===================================== */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* TOP */}
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedDivision
                    ? `${selectedDivision.classId?.name} - ${selectedDivision.name}`
                    : "Select Division"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Student records
                  inside this division.
                </p>
              </div>

              {/* SEARCH + FILTER */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  className="school-input"
                />

                <select
                  value={
                    statusFilter
                  }
                  onChange={(
                    event
                  ) =>
                    setStatusFilter(
                      event.target
                        .value
                    )
                  }
                  className="school-select sm:max-w-[180px]"
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
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-5">
            {loadingStudents ? (
              <div className="space-y-4">
                <div className="h-24 animate-pulse rounded-3xl bg-slate-100" />

                <div className="h-24 animate-pulse rounded-3xl bg-slate-100" />

                <div className="h-24 animate-pulse rounded-3xl bg-slate-100" />
              </div>
            ) : !selectedDivision ? (
              <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center">
                <h3 className="text-lg font-semibold text-slate-800">
                  Select a division
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Choose a division
                  from the sidebar.
                </p>
              </div>
            ) : !filteredStudents.length ? (
              <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center">
                <h3 className="text-lg font-semibold text-slate-800">
                  No students found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try adjusting the
                  filters or search.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStudents.map(
                  (student) => (
                    <div
                      key={
                        student._id
                      }
                      className="flex flex-col gap-5 rounded-3xl border border-slate-200 p-5 transition hover:shadow-md lg:flex-row lg:items-center lg:justify-between"
                    >
                      {/* LEFT */}
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-bold text-white">
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
                          <h3 className="text-lg font-semibold text-slate-900">
                            {
                              student.nameEnglish
                            }
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {student.gender ||
                              "Not added"}

                            {" • "}

                            {formatDate(
                              student.dateOfBirth
                            )}
                          </p>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
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

                        <button
                          type="button"
                          className="school-button-primary"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyStudentsPage;