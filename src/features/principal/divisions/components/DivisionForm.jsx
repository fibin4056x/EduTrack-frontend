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

  const fetchClasses = async () => {
    try {
      const response =
        await getClassesApi();

      setClasses(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response =
        await getTeachersApi();

      setTeachers(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

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

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]:
        event.target.value,
    }));
  };

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
      fetchDivisions();

      if (onClose) {
        onClose();
      } else {
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
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    onClick={onClose}
  >

    {/* Modal */}
    <div
      className="w-full max-w-3xl rounded-lg bg-white shadow-lg"
      onClick={(event) =>
        event.stopPropagation()
      }
    >

      {/* Header */}
      <div className="flex items-center justify-between border-b p-5">

        <div>

          <h2 className="text-xl font-semibold text-gray-800">

            {editingDivision
              ? "Edit Division"
              : "Add Division"}

          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage division details and class assignment
          </p>

        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-md border text-sm text-gray-600 hover:bg-gray-100"
        >
          ✕
        </button>

      </div>

      {/* Form */}
      <div className="p-5">

        <DivisionForm
          editingDivision={editingDivision}
          fetchDivisions={fetchDivisions}
          clearEdit={clearEdit}
          onClose={onClose}
        />

      </div>

    </div>

  </div>
);
};

export default DivisionForm;
