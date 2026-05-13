import { useState } from "react";

import {
  createTeacher,
} from "../api/teacher.api";



function AddTeacherModal({
  refreshTeachers,
}) {
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTeacher(formData);

      alert("Teacher created");

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      refreshTeachers();
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div className="bg-white p-6 rounded-lg border mb-6">

      <h2 className="text-lg font-semibold mb-4">
        Add Teacher
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4"
      >

        <input
          type="text"
          name="name"
          placeholder="Teacher Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Teacher Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-black text-white p-2 rounded"
        >
          Create Teacher
        </button>

      </form>
    </div>
  );
}

export default AddTeacherModal;