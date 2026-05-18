import {
  useEffect,
  useState,
} from "react";

import {
  createClassApi,
  updateClassApi,
} from "../api/class.api.js";

const initialState = {
  name: "",
  academicYear: "",
  status: "active",
};

const ClassForm = ({
  editingClass,
  fetchClasses,
  clearEdit,
}) => {
  const [formData, setFormData] =
    useState(initialState);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (editingClass) {
      setFormData({
        name: editingClass.name || "",
        academicYear:
          editingClass.academicYear ||
          "",
        status:
          editingClass.status ||
          "active",
      });
    } else {
      setFormData(initialState);
    }
  }, [editingClass]);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]:
        event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      if (editingClass) {
        await updateClassApi(
          editingClass._id,
          formData
        );
      } else {
        await createClassApi(formData);
      }

      setFormData(initialState);
      fetchClasses();
      clearEdit();
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
    className="section space-y-5"
  >

    {/* Header */}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <h2 className="text-xl font-semibold text-gray-800">

          {editingClass
            ? "Edit Class"
            : "Create Class"}

        </h2>

        <p className="text-sm text-gray-500">
          Manage class details and academic year
        </p>
      </div>

      <div className="rounded-md border bg-gray-50 px-4 py-2">

        <p className="text-xs text-gray-500">
          Mode
        </p>

        <p className="text-sm font-medium text-gray-700">

          {editingClass
            ? "Editing"
            : "Creating"}

        </p>

      </div>

    </div>

    {/* Fields */}
    <div className="grid gap-4 md:grid-cols-3">

      {/* Class Name */}
      <div>

        <label
          htmlFor="name"
          className="label"
        >
          Class Name
        </label>

        <input
          id="name"
          type="text"
          name="name"
          placeholder="Grade 1"
          value={formData.name}
          onChange={handleChange}
          className="input"
          required
        />

      </div>

      {/* Academic Year */}
      <div>

        <label
          htmlFor="academicYear"
          className="label"
        >
          Academic Year
        </label>

        <input
          id="academicYear"
          type="text"
          name="academicYear"
          placeholder="2026-2027"
          value={formData.academicYear}
          onChange={handleChange}
          className="input"
          required
        />

      </div>

      {/* Status */}
      <div>

        <label
          htmlFor="status"
          className="label"
        >
          Status
        </label>

        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="select"
        >

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>

        </select>

      </div>

    </div>

    {/* Buttons */}
    <div className="flex gap-3 border-t pt-4">

      <button
        type="submit"
        disabled={loading}
        className="btn-primary disabled:opacity-70"
      >

        {loading
          ? "Saving..."
          : editingClass
          ? "Update Class"
          : "Create Class"}

      </button>

      {editingClass && (

        <button
          type="button"
          onClick={clearEdit}
          className="btn-secondary"
        >
          Cancel
        </button>

      )}

    </div>

  </form>
);
};

export default ClassForm;
