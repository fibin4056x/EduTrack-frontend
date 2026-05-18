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
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-white p-6 shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-800">
          School Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage teachers, students, and classes easily.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">
              {card.title}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-800">
              {loading ? "..." : card.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Quick Info */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          Overview
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          This dashboard helps administrators manage
          school records including students, teachers,
          and classes from one place.
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;