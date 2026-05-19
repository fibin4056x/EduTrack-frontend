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
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* =====================================
          HEADER
      ===================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100/40">
        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
        
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/50 mb-3">
            📚 Teacher Administration Hub
          </span>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Teacher Dashboard
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed max-w-2xl">
            Coordinate your assigned divisions. Easily update class rosters, manage daily student files, and track academic attendance sheets.
          </p>
        </div>
      </div>

      {/* =====================================
          STATS
      ===================================== */}
      <div className="grid gap-6 sm:grid-cols-2">

        <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100/30 transition-all duration-300 hover:shadow-slate-200/40">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Divisions
              </p>
              <h2 className="mt-3 text-4xl font-extrabold text-slate-800 tracking-tight leading-none">
                {stats.total}
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 text-xl border border-indigo-100/50">
              📚
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100/30 transition-all duration-300 hover:shadow-slate-200/40">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Classes
              </p>
              <h2 className="mt-3 text-4xl font-extrabold text-slate-800 tracking-tight leading-none">
                {stats.classes}
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 text-xl border border-violet-100/50">
              🏫
            </div>
          </div>
        </div>

      </div>

      {/* =====================================
          SEARCH & CONTROLS
      ===================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100/30">
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 text-lg">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search divisions by name or class..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-3.5 text-sm outline-none bg-slate-50/60 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100/40 transition-all duration-300"
          />
        </div>
      </div>

      {/* =====================================
          DIVISIONS GRID
      ===================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-100/30">
        
        <div className="border-b border-slate-100 p-6 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              My Assigned Divisions
            </h2>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Select student listings or record attendance sheets
            </p>
          </div>
          
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100/50">
            {filteredDivisions.length} Active
          </span>
        </div>

        <div className="p-6">

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
              <p className="text-xs font-semibold text-slate-400 mt-3">
                Fetching school divisions...
              </p>
            </div>
          ) : !filteredDivisions.length ? (
            <div className="py-12 text-center flex flex-col items-center">
              <span className="text-3xl">📭</span>
              <p className="text-sm font-semibold text-slate-800 mt-3">
                No divisions found
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try refining your search keyword.
              </p>
            </div>
          ) : (

            <div className="grid gap-6 md:grid-cols-2">

              {filteredDivisions.map(
                (division) => {

                  const className =
                    division.classId
                      ?.name || "-";

                  const isActive = division.status === "active";

                  return (

                    <div
                      key={
                        division._id
                      }
                      className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-md shadow-slate-100/50 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-0.5 transition-all duration-300 group"
                    >
                      {/* Top banner tag */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                            {className}
                          </p>

                          <h3 className="mt-1.5 text-xl font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                            {division.name}
                          </h3>
                        </div>

                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}
                        >
                          {division.status}
                        </span>
                      </div>

                      {/* Capacity Indicator widget */}
                      <div className="mt-6">
                        <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                          <span>Division Capacity</span>
                          <span className="text-slate-700">{division.capacity} Students</span>
                        </div>
                        
                        {/* Custom visual progress bar bar */}
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                            style={{ width: `${Math.min(100, (division.capacity / 40) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Interactive Actions footer */}
                      <div className="mt-6 pt-4 border-t border-slate-50 flex gap-3">
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
                          className="flex-1 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 duration-200"
                        >
                          👨‍🎓 Students
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              "/teacher/attendance",
                              {
                                state: {
                                  selectedDivisionId:
                                    division._id,
                                },
                              }
                            )
                          }
                          className="flex-1 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-slate-950/10 hover:bg-slate-800 transition-all active:scale-95 duration-200"
                        >
                          📅 Attendance
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