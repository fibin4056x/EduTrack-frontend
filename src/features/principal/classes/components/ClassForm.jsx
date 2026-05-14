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
      className="school-card space-y-6 p-6 sm:p-7"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="school-pill">
            Class Register
          </span>

          <h2 className="mt-4 text-2xl font-bold text-slate-900">
            {editingClass
              ? "Edit class details"
              : "Create a class for the school year"}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Keep the class name, academic year, and availability status ready for real school operations.
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Editing Mode
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {editingClass
              ? "Updating existing class"
              : "Creating new class"}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr,1fr,0.8fr]">
        <div>
          <label
            htmlFor="name"
            className="school-label"
          >
            Class Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="Example: Grade 1, UKG, LKG"
            value={formData.name}
            onChange={handleChange}
            className="school-input"
            required
          />

          <p className="school-helper">
            Use the name exactly as the class should appear in attendance and school records.
          </p>
        </div>

        <div>
          <label
            htmlFor="academicYear"
            className="school-label"
          >
            Academic Year
          </label>

          <input
            id="academicYear"
            type="text"
            name="academicYear"
            placeholder="Example: 2026-2027"
            value={formData.academicYear}
            onChange={handleChange}
            className="school-input"
            required
          />

          <p className="school-helper">
            A class can repeat across years, so pair the name with the active school year.
          </p>
        </div>

        <div>
          <label
            htmlFor="status"
            className="school-label"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="school-input"
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>

          <p className="school-helper">
            Inactive classes stay in records but are treated as not currently in use.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
        <button
          type="submit"
          disabled={loading}
          className="school-button-primary disabled:cursor-not-allowed disabled:opacity-70"
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
            className="school-button-soft"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ClassForm;
