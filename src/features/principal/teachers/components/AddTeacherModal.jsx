import { useState } from "react";

import { createTeacher } from "../api/teacher.api.js";

function AddTeacherModal({
  refreshTeachers,
}) {
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      await createTeacher(formData);

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      refreshTeachers();
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data
          ?.message ||
          "Failed to create teacher"
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
          Add Teacher
        </h2>

        <p className="text-sm text-gray-500">
          Create a new teacher account
        </p>

      </div>

      <div className="rounded-md border bg-gray-50 px-4 py-2">

        <p className="text-xs text-gray-500">
          Account Setup
        </p>

        <p className="text-sm font-medium text-gray-700">
          Name, Email & Password
        </p>

      </div>

    </div>

    {/* Fields */}
    <div className="grid gap-4 md:grid-cols-3">

      {/* Name */}
      <div>

        <label
          htmlFor="name"
          className="label"
        >
          Teacher Name
        </label>

        <input
          id="name"
          type="text"
          name="name"
          placeholder="Teacher name"
          value={formData.name}
          onChange={handleChange}
          className="input"
          required
        />

      </div>

      {/* Email */}
      <div>

        <label
          htmlFor="email"
          className="label"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          name="email"
          placeholder="teacher@email.com"
          value={formData.email}
          onChange={handleChange}
          className="input"
          required
        />

      </div>

      {/* Password */}
      <div>

        <label
          htmlFor="password"
          className="label"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input"
          required
        />

      </div>

    </div>

    {/* Footer */}
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">

      <button
        type="submit"
        disabled={loading}
        className="btn-primary disabled:opacity-70"
      >

        {loading
          ? "Creating..."
          : "Create Teacher"}

      </button>

      <p className="text-sm text-gray-500">
        Teacher records can be updated later
      </p>

    </div>

  </form>
);
}

export default AddTeacherModal;
