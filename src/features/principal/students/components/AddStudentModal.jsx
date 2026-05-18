import { useEffect } from "react";

import StudentForm from "./StudentForm";

const AddStudentModal = ({
  isOpen,
  onClose,
  editingStudent,
  fetchStudents,
  clearEdit,
}) => {
  // =========================================
  // ESC KEY CLOSE
  // =========================================
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener(
        "keydown",
        handleEscape
      );

      // ===============================
      // PREVENT BODY SCROLL
      // ===============================
      document.body.style.overflow =
        "hidden";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow =
        "auto";
    };
  }, [isOpen, onClose]);

  // =========================================
  // HIDE MODAL
  // =========================================
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-full items-start justify-center sm:items-center">
        {/* =====================================
            MODAL CONTAINER
        ===================================== */}
        <div
          className="school-shell w-full max-w-6xl overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          {/* =====================================
              HEADER
          ===================================== */}
          <div className="border-b border-slate-200/80 bg-white/70 px-6 py-5 backdrop-blur sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="school-pill">
                  Student Form
                </span>

                <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {editingStudent
                    ? "Update Student Details"
                    : "Create New Student"}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Add and manage student
                  information with a cleaner
                  school-friendly workflow.
                </p>
              </div>

              {/* =====================================
                  CLOSE BUTTON
              ===================================== */}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-semibold text-slate-500 transition duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                ✕
              </button>
            </div>
          </div>

          {/* =====================================
              FORM SECTION
          ===================================== */}
          <div className="max-h-[80vh] overflow-y-auto">
            <StudentForm
              editingStudent={
                editingStudent
              }
              fetchStudents={
                fetchStudents
              }
              clearEdit={clearEdit}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;