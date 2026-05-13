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

  return (
    <div className="space-y-6">
      <ClassForm
        editingClass={editingClass}
        fetchClasses={fetchClasses}
        clearEdit={() =>
          setEditingClass(null)
        }
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ClassesTable
          classes={classes}
          fetchClasses={fetchClasses}
          setEditingClass={
            setEditingClass
          }
        />
      )}
    </div>
  );
};

export default ClassesPage;