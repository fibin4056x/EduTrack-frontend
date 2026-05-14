import { deleteClassApi } from "../api/class.api.js";

const ClassesTable = ({
  classes,
  fetchClasses,
  setEditingClass,
}) => {
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this class?"
    );

    if (!confirmed) return;

    try {
      await deleteClassApi(id);
      fetchClasses();
    } catch (error) {
      console.error(error);
      alert("Failed to delete class");
    }
  };

  if (!classes.length) {
    return (
      <div className="school-card p-8 text-center sm:p-10">
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-lg font-bold text-white">
            CL
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            No classes added yet
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
            Add classes by name and academic year so the student records and principal dashboard can use real classroom data.
          </p>
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
              Class Records
            </span>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Academic year class register
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Keep a simple, real-world list of classes that school staff can reuse across admissions, attendance, and yearly planning.
            </p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Total Classes
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {classes.length}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 lg:hidden">
        {classes.map((item) => (
          <article
            key={item._id}
            className="school-card-muted p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {item.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Academic Year:{" "}
                  {item.academicYear}
                </p>
              </div>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${
                  item.status === "inactive"
                    ? "bg-slate-200 text-slate-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() =>
                  setEditingClass(item)
                }
                className="school-button-soft flex-1"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDelete(item._id)
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
                Class Name
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Academic Year
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Status
              </th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {classes.map((item) => (
              <tr
                key={item._id}
                className="border-b border-slate-100 transition duration-200 hover:bg-slate-50/70"
              >
                <td className="px-8 py-5">
                  <p className="text-sm font-bold text-slate-900">
                    {item.name}
                  </p>
                </td>

                <td className="px-6 py-5">
                  <p className="text-sm font-semibold text-slate-700">
                    {item.academicYear}
                  </p>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${
                      item.status ===
                      "inactive"
                        ? "bg-slate-200 text-slate-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-8 py-5">
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setEditingClass(item)
                      }
                      className="school-button-soft"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(item._id)
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

export default ClassesTable;
