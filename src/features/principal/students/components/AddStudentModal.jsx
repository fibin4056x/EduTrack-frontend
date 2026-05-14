import StudentForm from "./StudentForm";

const AddStudentModal = ({
  isOpen,
  onClose,
  editingStudent,
  fetchStudents,
  clearEdit,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <div
          className="school-shell w-full max-w-6xl overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(248,250,252,0.95))]"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <div className="border-b border-slate-200/80 bg-white/70 px-6 py-5 backdrop-blur sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="school-pill">
                  Student Form
                </span>

                <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {editingStudent
                    ? "Refresh student details"
                    : "Create a new student profile"}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  This keeps your current save logic untouched and only improves the presentation for a cleaner school-facing workflow.
                </p>
              </div>

              <button
                onClick={onClose}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-500 transition duration-200 hover:border-slate-300 hover:text-slate-900"
              >
                x
              </button>
            </div>
          </div>

          <StudentForm
            editingStudent={editingStudent}
            fetchStudents={fetchStudents}
            clearEdit={clearEdit}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
