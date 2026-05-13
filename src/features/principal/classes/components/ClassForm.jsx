import { useEffect, useState } from "react";

import {
  createClassApi,
  updateClassApi,
} from "../api/class.api.js";

const initialState = {
  name: "",
  section: "",
  academicYear: "",
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
        name: editingClass.name,
        section: editingClass.section,
        academicYear:
          editingClass.academicYear,
      });
    } else {
      setFormData(initialState);
    }
  }, [editingClass]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg bg-white p-6 shadow"
    >
      <h2 className="text-xl font-bold">
        {editingClass
          ? "Edit Class"
          : "Create Class"}
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Class Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full rounded border p-3"
        required
      />

      <input
        type="text"
        name="section"
        placeholder="Division"
        value={formData.section}
        onChange={handleChange}
        className="w-full rounded border p-3"
        required
      />

      <input
        type="text"
        name="academicYear"
        placeholder="Academic Year"
        value={formData.academicYear}
        onChange={handleChange}
        className="w-full rounded border p-3"
        required
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white"
        >
          {loading
            ? "Saving..."
            : editingClass
            ? "Update"
            : "Create"}
        </button>

        {editingClass && (
          <button
            type="button"
            onClick={clearEdit}
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ClassForm;