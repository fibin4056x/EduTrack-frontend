import { useState } from "react";

import useClasses from "../hooks/useClasses.js";
import ClassForm from "../components/ClassForm.jsx";
import ClassesTable from "../components/ClassesTable.jsx";

const ClassesPage = () => {
  const {
    classes,
    loading,
    fetchClasses,
  } = useClasses();

  const [editingClass, setEditingClass] =
    useState(null);

  const activeClasses =
    classes.filter(
      (item) => item.status !== "inactive"
    ).length;

  const inactiveClasses =
    classes.filter(
      (item) => item.status === "inactive"
    ).length;

  const latestAcademicYear =
    classes[0]?.academicYear || "Not added";

  return (
  <div className="page">

    {/* Header */}
    <div className="section flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div>

        <h1 className="text-2xl font-bold text-gray-800">
          Classes
        </h1>

        <p className="text-sm text-gray-500">
          Manage school classes and academic years
        </p>

      </div>

      <div className="rounded-md border bg-gray-50 px-4 py-3">

        <p className="text-xs text-gray-500">
          Latest Academic Year
        </p>

        <p className="text-lg font-semibold text-gray-800">
          {latestAcademicYear}
        </p>

      </div>

    </div>

    {/* Stats */}
    <div className="grid gap-4 sm:grid-cols-3">

      <div className="section">

        <p className="text-sm text-gray-500">
          Total Classes
        </p>

        <h2 className="mt-2 text-3xl font-bold text-gray-800">
          {classes.length}
        </h2>

      </div>

      <div className="section">

        <p className="text-sm text-gray-500">
          Active Classes
        </p>

        <h2 className="mt-2 text-3xl font-bold text-gray-800">
          {activeClasses}
        </h2>

      </div>

      <div className="section">

        <p className="text-sm text-gray-500">
          Inactive Classes
        </p>

        <h2 className="mt-2 text-3xl font-bold text-gray-800">
          {inactiveClasses}
        </h2>

      </div>

    </div>

    {/* Form */}
    <ClassForm
      editingClass={editingClass}
      fetchClasses={fetchClasses}
      clearEdit={() =>
        setEditingClass(null)
      }
    />

    {/* Table */}
    {loading ? (

      <div className="section">

        <p className="text-sm text-gray-500">
          Loading classes...
        </p>

      </div>

    ) : (

      <ClassesTable
        classes={classes}
        fetchClasses={fetchClasses}
        setEditingClass={setEditingClass}
      />

    )}

  </div>
);
};

export default ClassesPage;
