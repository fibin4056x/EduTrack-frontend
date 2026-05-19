import {
  useEffect,
  useState,
} from "react";

import {
  createDivisionApi,
  getClassesApi,
  getTeachersApi,
  updateDivisionApi,
} from "../api/division.api.js";

/* =========================================
   DIVISION OPTIONS
========================================= */

const divisionOptions = [
  "A",
  "B",
  "C",
  "D",
  "E",
];

/* =========================================
   INITIAL STATE
========================================= */

const initialState = {
  name: "",
  classId: "",
  assignedTeacher: "",
  capacity: 40,
};

const DivisionForm = ({
  editingDivision,
  fetchDivisions,
  clearEdit,
  onClose,
}) => {
  const [formData, setFormData] =
    useState(initialState);

  const [classes, setClasses] =
    useState([]);

  const [teachers, setTeachers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  /* =========================================
     FETCH CLASSES
  ========================================= */

  const fetchClasses = async () => {
    try {
      const response =
        await getClassesApi();

      setClasses(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================================
     FETCH TEACHERS
  ========================================= */

  const fetchTeachers = async () => {
    try {
      const response =
        await getTeachersApi();

      setTeachers(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================================
     INITIAL FETCH
  ========================================= */

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  /* =========================================
     EDIT MODE
  ========================================= */

  useEffect(() => {
    if (editingDivision) {
      setFormData({
        name:
          editingDivision.name || "",

        classId:
          editingDivision.classId?._id ||
          "",

        assignedTeacher:
          editingDivision
            .assignedTeacher?._id || "",

        capacity:
          editingDivision.capacity || 40,
      });
    } else {
      setFormData(initialState);
    }
  }, [editingDivision]);

  /* =========================================
     HANDLE CHANGE
  ========================================= */

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,

      [event.target.name]:
        event.target.value,
    }));
  };

  /* =========================================
     HANDLE SUBMIT
  ========================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setLoading(true);

      if (editingDivision) {
        await updateDivisionApi(
          editingDivision._id,
          formData
        );
      } else {
        await createDivisionApi(
          formData
        );
      }

      setFormData(initialState);

      await fetchDivisions();

      if (onClose) {
        onClose();
      }

      if (clearEdit) {
        clearEdit();
      }
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data
          ?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* =========================================
          DIVISION NAME
      ========================================= */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Division
        </label>

        <select
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
        >
          <option value="">
            Select Division
          </option>

          {divisionOptions.map(
            (division) => (
              <option
                key={division}
                value={division}
              >
                {division}
              </option>
            )
          )}
        </select>
      </div>

      {/* =========================================
          CLASS
      ========================================= */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Class
        </label>

        <select
          name="classId"
          value={formData.classId}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
        >
          <option value="">
            Select Class
          </option>

          {classes.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* =========================================
          TEACHER
      ========================================= */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Assigned Teacher
        </label>

        <select
          name="assignedTeacher"
          value={
            formData.assignedTeacher
          }
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
        >
          <option value="">
            Select Teacher
          </option>

          {teachers.map((teacher) => (
            <option
              key={teacher._id}
              value={teacher._id}
            >
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      {/* =========================================
          CAPACITY
      ========================================= */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Capacity
        </label>

        <input
          type="number"
          name="capacity"
          min="1"
          value={formData.capacity}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
        />
      </div>

      {/* =========================================
          BUTTONS
      ========================================= */}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading
            ? "Saving..."
            : editingDivision
            ? "Update Division"
            : "Create Division"}
        </button>
      </div>
    </form>
  );
};

export default DivisionForm;