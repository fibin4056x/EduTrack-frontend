import useMyStudents from "../hooks/useMyStudents.js";

const formatDate = (value) => {
  if (!value) {
    return "Not added";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
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

const getDivisionLabel = (division) => {
  if (!division) {
    return "Pending";
  }

  if (typeof division === "string") {
    return division;
  }

  return (
    division.name ||
    division.code ||
    division._id ||
    "Pending"
  );
};

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

const MyStudentsPage = () => {
  const {
    divisions,
    selectedDivisionId,
    setSelectedDivisionId,
    students,
    loadingDivisions,
    loadingStudents,
  } = useMyStudents();

  const selectedDivision =
    divisions.find(
      (division) =>
        division._id === selectedDivisionId
    ) || null;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_55%,#06b6d4_100%)] px-6 py-8 text-white shadow-2xl sm:px-8">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-50">
              Teacher Student View
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
              See the students attached to your classroom divisions.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-sky-50/90 sm:text-base">
              Switch between assigned divisions and review student profiles without leaving the teacher workspace.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-100">
              Visible Students
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {loadingStudents
                ? "..."
                : students.length}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[340px,1fr]">
        <div className="school-card p-6">
          <span className="school-pill">
            My Divisions
          </span>

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Assigned classroom groups
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Choose a division to load students from that group.
          </p>

          <div className="mt-6 space-y-3">
            {loadingDivisions ? (
              <div className="animate-pulse space-y-3">
                <div className="h-20 rounded-[24px] bg-slate-100" />
                <div className="h-20 rounded-[24px] bg-slate-100" />
              </div>
            ) : divisions.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                No divisions assigned yet.
              </div>
            ) : (
              divisions.map((division) => {
                const isActive =
                  division._id ===
                  selectedDivisionId;

                return (
                  <button
                    key={division._id}
                    type="button"
                    onClick={() =>
                      setSelectedDivisionId(
                        division._id
                      )
                    }
                    className={`w-full rounded-[24px] border px-4 py-4 text-left transition duration-200 ${
                      isActive
                        ? "border-sky-300 bg-sky-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-base font-bold text-slate-900">
                      {division.classId?.name ||
                        "Class"}{" "}
                      / {division.name}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Capacity:{" "}
                      {division.capacity}
                    </p>

                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                      {division.classId
                        ?.academicYear ||
                        "Academic year pending"}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="school-card overflow-hidden">
          <div className="border-b border-slate-200/80 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="school-pill">
                  Division Students
                </span>

                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                  {selectedDivision
                    ? `${selectedDivision.classId?.name || "Class"} / ${selectedDivision.name}`
                    : "Select a division"}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {selectedDivision
                    ? "Student records shown for the selected division."
                    : "Choose a division from the left panel to load students."}
                </p>
              </div>

              {selectedDivision && (
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                    Assigned Division
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {selectedDivision.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {loadingStudents ? (
              <div className="animate-pulse space-y-4">
                <div className="h-24 rounded-[24px] bg-slate-100" />
                <div className="h-24 rounded-[24px] bg-slate-100" />
                <div className="h-24 rounded-[24px] bg-slate-100" />
              </div>
            ) : !selectedDivision ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
                Select a division to see students.
              </div>
            ) : students.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
                No students found in this division yet.
              </div>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {students.map((student) => (
                  <article
                    key={student._id}
                    className="school-card-muted p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-slate-900 text-sm font-bold text-white">
                        {student.photo ? (
                          <img
                            src={student.photo}
                            alt={
                              student.nameEnglish ||
                              "Student"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitials(
                            student.nameEnglish
                          )
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            {student.nameEnglish ||
                              "Student name"}
                          </h3>

                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                            {student.status ||
                              "active"}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {student.nameArabic ||
                            "Secondary name not added"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm text-slate-600">
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                          Class Details
                        </p>

                        <p className="mt-2 font-semibold text-slate-900">
                          {student.classId?.name ||
                            "Class pending"}
                        </p>

                        <p className="mt-1 text-slate-500">
                          Division / Record:{" "}
                          {getDivisionLabel(
                            student.divisionId
                          )}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                          Student Info
                        </p>

                        <p className="mt-2">
                          Gender:{" "}
                          <span className="font-semibold capitalize text-slate-900">
                            {student.gender ||
                              "Not added"}
                          </span>
                        </p>

                        <p className="mt-1">
                          DOB:{" "}
                          <span className="font-semibold text-slate-900">
                            {formatDate(
                              student.dateOfBirth
                            )}
                          </span>
                        </p>

                        <p className="mt-1">
                          Admission:{" "}
                          <span className="font-semibold text-slate-900">
                            {formatDate(
                              student.admissionDate
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyStudentsPage;
