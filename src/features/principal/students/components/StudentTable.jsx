import { deleteStudentApi } from "../api/student.api";

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

const StudentsTable = ({
  students,
  fetchStudents,
  setEditingStudent,
  openModal,
}) => {
  const handleDelete = async (studentId) => {
    const confirmed = window.confirm(
      "Delete this student?"
    );

    if (!confirmed) return;

    try {
      await deleteStudentApi(studentId);
      fetchStudents();
    } catch (error) {
      console.error(error);
      alert("Failed to delete student");
    }
  };

  if (!students.length) {
    return (
      <div className="school-card p-8 sm:p-10">
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-lg font-bold text-white">
            ST
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            No student profiles yet
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
            Start with a polished student profile so principals and teachers can keep admissions, classroom placement, and support details in one place.
          </p>

          <button
            onClick={openModal}
            className="school-button-primary mt-6"
          >
            Add First Student
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="school-card overflow-hidden">
      <div className="border-b border-slate-200/80 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="school-pill">
              Student Directory
            </span>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Neat classroom-ready student records
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Each row keeps together placement, identity, and support details so the staff view stays easy to scan during a busy school day.
            </p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Profiles Shown
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {students.length}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:hidden">
        {students.map((student) => (
          <article
            key={student._id}
            className="school-card-muted p-5"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900 text-sm font-bold text-white">
                {getInitials(
                  student.nameEnglish
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
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
                  Class and Division
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

                <p className="mt-1 text-slate-500">
                  Academic Year:{" "}
                  {student.classId
                    ?.academicYear ||
                    "Pending"}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Identity
                </p>

                <p className="mt-2">
                  Gender:{" "}
                  <span className="font-semibold text-slate-900 capitalize">
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
              </div>

              <div className="rounded-2xl bg-white p-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Records
                </p>

                <p className="mt-2">
                  Exam No:{" "}
                  <span className="font-semibold text-slate-900">
                    {student.examRegisterNumber ||
                      "Not issued"}
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

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  setEditingStudent(student);
                  openModal();
                }}
                className="school-button-soft flex-1"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDelete(student._id)
                }
                className="inline-flex flex-1 items-center justify-center rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-rose-500"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-left">
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Student
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Placement
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Identity
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Records
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Support
              </th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr
                key={student._id}
                className="border-b border-slate-100 align-top transition duration-200 hover:bg-slate-50/70"
              >
                <td className="px-8 py-5">
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

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {student.nameEnglish ||
                          "Student name"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {student.nameArabic ||
                          "Secondary name not added"}
                      </p>

                      <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                        {student.status ||
                          "active"}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <p className="text-sm font-semibold text-slate-900">
                    {student.classId?.name ||
                      "Class pending"}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Division / Record:{" "}
                    {getDivisionLabel(
                      student.divisionId
                    )}
                  </p>

                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                    {student.classId
                      ?.academicYear ||
                      "Academic year pending"}
                  </p>
                </td>

                <td className="px-6 py-5">
                  <p className="text-sm text-slate-600">
                    Gender:{" "}
                    <span className="font-semibold capitalize text-slate-900">
                      {student.gender ||
                        "Not added"}
                    </span>
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    DOB:{" "}
                    <span className="font-semibold text-slate-900">
                      {formatDate(
                        student.dateOfBirth
                      )}
                    </span>
                  </p>
                </td>

                <td className="px-6 py-5">
                  <p className="text-sm text-slate-600">
                    Exam No:{" "}
                    <span className="font-semibold text-slate-900">
                      {student.examRegisterNumber ||
                        "Not issued"}
                    </span>
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    Aadhaar:{" "}
                    <span className="font-semibold text-slate-900">
                      {student.aadhaarNumber ||
                        "Not added"}
                    </span>
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    Admission:{" "}
                    <span className="font-semibold text-slate-900">
                      {formatDate(
                        student.admissionDate
                      )}
                    </span>
                  </p>
                </td>

                <td className="px-6 py-5">
                  <p className="text-sm font-semibold text-slate-900">
                    {student.economicCategory ||
                      "General"}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {student.photo
                      ? "Profile photo attached"
                      : "Photo pending"}
                  </p>
                </td>

                <td className="px-8 py-5">
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setEditingStudent(
                          student
                        );
                        openModal();
                      }}
                      className="school-button-soft"
                    >
                      Edit Profile
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          student._id
                        )
                      }
                      className="inline-flex items-center justify-center rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-rose-500"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsTable;
