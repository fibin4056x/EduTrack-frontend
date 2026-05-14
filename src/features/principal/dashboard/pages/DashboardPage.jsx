import {
  useEffect,
  useState,
} from "react";

import { getTeachers } from "../../teachers/api/teacher.api.js";
import { getStudentsApi } from "../../students/api/student.api.js";
import { getClassesApi } from "../../classes/api/class.api.js";

const initialCounts = {
  teachers: 0,
  students: 0,
  classes: 0,
};

function DashboardPage() {
  const [counts, setCounts] =
    useState(initialCounts);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);

        const results =
          await Promise.allSettled([
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
            teachersResult.status ===
            "fulfilled"
              ? teachersResult.value.data
                  ?.length || 0
              : 0,
          students:
            studentsResult.status ===
            "fulfilled"
              ? studentsResult.value.data
                  ?.length || 0
              : 0,
          classes:
            classesResult.status ===
            "fulfilled"
              ? classesResult.value.data
                  ?.length || 0
              : 0,
        });

        results.forEach((result) => {
          if (result.status === "rejected") {
            console.error(result.reason);
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const summaryCards = [
    {
      label: "Teachers",
      value: counts.teachers,
      tone:
        "from-sky-500/15 to-cyan-400/10",
    },
    {
      label: "Students",
      value: counts.students,
      tone:
        "from-emerald-500/15 to-lime-400/10",
    },
    {
      label: "Classes",
      value: counts.classes,
      tone:
        "from-amber-500/15 to-orange-400/10",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="school-card overflow-hidden p-6 sm:p-8">
        <span className="school-pill">
          Principal Overview
        </span>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          School dashboard at a glance
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          These numbers are now pulled from your live teachers, students, and classes data.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`school-card overflow-hidden bg-gradient-to-br ${card.tone} p-6`}
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              {card.label}
            </p>

            <p className="mt-5 text-4xl font-bold text-slate-900">
              {loading ? "..." : card.value}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Total {card.label.toLowerCase()} currently available in the system.
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default DashboardPage;
