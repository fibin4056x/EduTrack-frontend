import {
  useEffect,
  useMemo,
  useState,
} from "react";

import useStudents from "../hooks/useStudents";

import AddStudentModal from "../components/AddStudentModal";

import StudentsTable from "../components/StudentTable";

import BulkStudentUpload from "../components/BulkStudentUpload";

import {
  getClassesApi,
  getDivisionsApi,
} from "../api/student.api.js";

const StudentsPage = () => {
  // =========================================
  // STUDENTS
  // =========================================
  const {
    students,
    loading,
    fetchStudents,
  } = useStudents();

  // =========================================
  // STATES
  // =========================================
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingStudent, setEditingStudent] =
    useState(null);

  const [classes, setClasses] =
    useState([]);

  const [divisions, setDivisions] =
    useState([]);

  const [pageError, setPageError] =
    useState("");

  // =========================================
  // FETCH INITIAL DATA
  // =========================================
  const fetchInitialData =
    async () => {
      try {
        setPageError("");

        const [
          classesResponse,
          divisionsResponse,
        ] = await Promise.all([
          getClassesApi(),
          getDivisionsApi(),
        ]);

        setClasses(
          classesResponse.data || []
        );

        setDivisions(
          divisionsResponse.data || []
        );
      } catch (error) {
        console.error(error);

        setPageError(
          "Failed to load data."
        );
      }
    };

  // =========================================
  // INITIAL FETCH
  // =========================================
  useEffect(() => {
    fetchInitialData();
  }, []);

  // =========================================
  // CLOSE MODAL
  // =========================================
  const handleCloseModal = () => {
    setIsModalOpen(false);

    setEditingStudent(null);
  };

  // =========================================
  // STATS
  // =========================================
  const stats = useMemo(() => {
    return students.reduce(
      (acc, student) => {
        acc.total += 1;

        if (
          student.status !==
          "inactive"
        ) {
          acc.active += 1;
        }

        return acc;
      },
      {
        total: 0,
        active: 0,
      }
    );
  }, [students]);

  return (
    <div className="space-y-6">
      {/* =====================================
          HEADER
      ===================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Students
          </h1>

          <p className="text-sm text-slate-500">
            Manage student records
          </p>
        </div>

        <button
          onClick={() =>
            setIsModalOpen(true)
          }
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add Student
        </button>
      </div>

      {/* =====================================
          ERROR
      ===================================== */}
      {pageError && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {pageError}
        </div>
      )}

      {/* =====================================
          STATS
      ===================================== */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm text-slate-500">
            Total Students
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {stats.total}
          </h2>
        </div>

        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm text-slate-500">
            Active Students
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {stats.active}
          </h2>
        </div>
      </div>

      {/* =====================================
          BULK UPLOAD
      ===================================== */}
      <BulkStudentUpload
        classes={classes}
        divisions={divisions}
        fetchStudents={fetchStudents}
      />

      {/* =====================================
          TABLE
      ===================================== */}
      {loading ? (
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-slate-500">
            Loading students...
          </p>
        </div>
      ) : (
        <StudentsTable
          students={students}
          fetchStudents={fetchStudents}
          setEditingStudent={
            setEditingStudent
          }
          openModal={() =>
            setIsModalOpen(true)
          }
        />
      )}

      {/* =====================================
          MODAL
      ===================================== */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingStudent={
          editingStudent
        }
        fetchStudents={
          fetchStudents
        }
        clearEdit={() =>
          setEditingStudent(null)
        }
      />
    </div>
  );
};

export default StudentsPage;