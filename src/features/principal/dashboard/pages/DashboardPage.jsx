import { useEffect, useState } from "react";

import { getClassesApi } from "../../classes/api/class.api.js";
import { getStudentsApi } from "../../students/api/student.api.js";
import { getTeachers } from "../../teachers/api/teacher.api.js";

function DashboardPage() {
  const [counts, setCounts] = useState({
    teachers: 0,
    students: 0,
    classes: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const results = await Promise.allSettled([
          getTeachers(),
          getStudentsApi(),
          getClassesApi(),
        ]);

        const [
          teachersResult,
          studentsResult,
          classesResult,
        ] = results;

        setCounts({
          teachers:
            teachersResult.status === "fulfilled"
              ? teachersResult.value.data?.length || 0
              : 0,

          students:
            studentsResult.status === "fulfilled"
              ? studentsResult.value.data?.length || 0
              : 0,

          classes:
            classesResult.status === "fulfilled"
              ? classesResult.value.data?.length || 0
              : 0,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    {
      title: "Teachers",
      value: counts.teachers,
    },
    {
      title: "Students",
      value: counts.students,
    },
    {
      title: "Classes",
      value: counts.classes,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100/40">
        {/* Glow accent */}
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
        
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/50 mb-3">
            📍 Administrative Control Center
          </span>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            School Dashboard
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed max-w-2xl">
            Streamline your administration workspace. Monitor teachers, manage divisions, track student counts, and coordinate classes from a unified dashboard.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => {
          let icon = "🏫";
          let colorClass = "from-blue-500 to-indigo-500 shadow-indigo-500/10";
          let textColor = "text-indigo-600";
          let bgPill = "bg-indigo-50 border-indigo-100/50";
          
          if (card.title === "Teachers") {
            icon = "👨‍🏫";
            colorClass = "from-violet-500 to-fuchsia-500 shadow-fuchsia-500/10";
            textColor = "text-fuchsia-600";
            bgPill = "bg-fuchsia-50 border-fuchsia-100/50";
          } else if (card.title === "Students") {
            icon = "👨‍🎓";
            colorClass = "from-emerald-500 to-teal-500 shadow-teal-500/10";
            textColor = "text-teal-600";
            bgPill = "bg-teal-50 border-teal-100/50";
          }
          
          return (
            <div
              key={card.title}
              className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100/30 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${bgPill}`}>
                    {card.title}
                  </span>
                  <h2 className="mt-4 text-4xl font-extrabold text-slate-800 tracking-tight leading-none">
                    {loading ? (
                      <span className="inline-block h-8 w-12 rounded bg-slate-100 animate-pulse" />
                    ) : (
                      card.value
                    )}
                  </h2>
                </div>
                
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${colorClass} text-xl shadow-lg ring-4 ring-white group-hover:scale-110 transition-transform duration-300`}>
                  {icon}
                </div>
              </div>
              
              <div className="mt-5 border-t border-slate-50 pt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Active Records</span>
                <span className={`text-xs font-bold ${textColor} cursor-pointer group-hover:underline`}>View Details →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Info */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100/40">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span>💡</span> Platform Quick Overview
        </h2>
        <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500 max-w-3xl">
          This customized LP Student Learning Management System provides advanced record keeping for primary school administrators. Maintain highly structured teacher files, student demographics, class profiles, and subdivision assignments from an intuitive interface designed for absolute clarity.
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;