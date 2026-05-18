import {
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import useMyDivisions from "../../hooks/useMyDivisions.js";

const DashboardPage = () => {
  const navigate =
    useNavigate();

  // =========================================
  // STATES
  // =========================================
  const [search, setSearch] =
    useState("");

  // =========================================
  // DATA
  // =========================================
  const {
    divisions,
    loading,
  } = useMyDivisions();

  // =========================================
  // FILTERED DIVISIONS
  // =========================================
  const filteredDivisions =
    useMemo(() => {
      return divisions.filter(
        (division) => {
          const className =
            division.classId?.name?.toLowerCase() ||
            "";

          const divisionName =
            division.name?.toLowerCase() ||
            "";

          const value =
            search.toLowerCase();

          return (
            divisionName.includes(
              value
            ) ||
            className.includes(
              value
            )
          );
        }
      );
    }, [divisions, search]);

  // =========================================
  // STATS
  // =========================================
  const stats = useMemo(() => {
    const uniqueClasses =
      new Set();

    divisions.forEach(
      (division) => {
        if (
          division.classId?._id
        ) {
          uniqueClasses.add(
            division.classId._id
          );
        }
      }
    );

    return {
      total: divisions.length,
      classes:
        uniqueClasses.size,
    };
  }, [divisions]);

  return (
    <div className="space-y-6">
      {/* =====================================
          HEADER
      ===================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Teacher Dashboard
          </h1>

          <p className="text-sm text-slate-500">
            Manage assigned
            divisions and students
          </p>
        </div>
      </div>

      {/* =====================================
          STATS
      ===================================== */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm text-slate-500">
            Total Divisions
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {stats.total}
          </h2>
        </div>

        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm text-slate-500">
            Total Classes
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {stats.classes}
          </h2>
        </div>
      </div>

      {/* =====================================
          SEARCH
      ===================================== */}
      <div className="rounded-lg border bg-white p-4">
        <input
          type="text"
          placeholder="Search divisions..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-500"
        />
      </div>

      {/* =====================================
          DIVISIONS
      ===================================== */}
      <div className="rounded-lg border bg-white">
        <div className="border-b px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            My Divisions
          </h2>
        </div>

        <div className="p-5">
          {loading ? (
            <p className="text-sm text-slate-500">
              Loading divisions...
            </p>
          ) : !filteredDivisions.length ? (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-500">
                No divisions found
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredDivisions.map(
                (division) => {
                  const className =
                    division.classId
                      ?.name || "-";

                  return (
                    <div
                      key={
                        division._id
                      }
                      className="rounded-lg border p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-slate-500">
                            {
                              className
                            }
                          </p>

                          <h3 className="mt-1 text-xl font-semibold text-slate-800">
                            {
                              division.name
                            }
                          </h3>
                        </div>

                        <span
                          className={`rounded px-2 py-1 text-xs font-medium ${
                            division.status ===
                            "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {
                            division.status
                          }
                        </span>
                      </div>

                      <div className="mt-4 text-sm text-slate-600">
                        Capacity :{" "}
                        {
                          division.capacity
                        }
                      </div>

                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              "/teacher/students",
                              {
                                state: {
                                  selectedDivisionId:
                                    division._id,
                                },
                              }
                            )
                          }
                          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                        >
                          View Students
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;