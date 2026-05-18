import { useState } from "react";

import AddDivisionModal from "../components/AddDivisionModal.jsx";
import DivisionTable from "../components/DivisionTable.jsx";
import useDivisions from "../hooks/useDivisions.js";

const DivisionsPage = () => {
  const {
    divisions,
    loading,
    fetchDivisions,
  } = useDivisions();

  const [isModalOpen, setIsModalOpen] =
    useState(false);
  const [editingDivision, setEditingDivision] =
    useState(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDivision(null);
  };

  const activeDivisions =
    divisions.filter(
      (division) =>
        division.status === "active"
    ).length;

  const totalCapacity =
    divisions.reduce(
      (total, division) =>
        total +
        (Number(division.capacity) || 0),
      0
    );

  const assignedTeachers =
    divisions.filter((division) =>
      Boolean(
        division.assignedTeacher?._id ||
          division.assignedTeacher
      )
    ).length;

  return (
  <div className="page">

    {/* Header */}
    <div className="section flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div>

        <h1 className="text-2xl font-bold text-gray-800">
          Divisions
        </h1>

        <p className="text-sm text-gray-500">
          Manage school divisions and teachers
        </p>

      </div>

      <button
        onClick={() =>
          setIsModalOpen(true)
        }
        className="btn-primary"
      >
        Add Division
      </button>

    </div>

    {/* Stats */}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

      <div className="section">

        <p className="text-sm text-gray-500">
          Total Divisions
        </p>

        <h2 className="mt-2 text-3xl font-bold text-gray-800">
          {divisions.length}
        </h2>

      </div>

      <div className="section">

        <p className="text-sm text-gray-500">
          Active Divisions
        </p>

        <h2 className="mt-2 text-3xl font-bold text-gray-800">
          {activeDivisions}
        </h2>

      </div>

      <div className="section">

        <p className="text-sm text-gray-500">
          Assigned Teachers
        </p>

        <h2 className="mt-2 text-3xl font-bold text-gray-800">
          {assignedTeachers}
        </h2>

      </div>

      <div className="section">

        <p className="text-sm text-gray-500">
          Total Capacity
        </p>

        <h2 className="mt-2 text-3xl font-bold text-gray-800">
          {totalCapacity}
        </h2>

      </div>

    </div>

    {/* Table */}
    {loading ? (

      <div className="section">

        <p className="text-sm text-gray-500">
          Loading divisions...
        </p>

      </div>

    ) : (

      <DivisionTable
        divisions={divisions}
        fetchDivisions={fetchDivisions}
        setEditingDivision={
          setEditingDivision
        }
        openModal={() =>
          setIsModalOpen(true)
        }
      />

    )}

    {/* Modal */}
    <AddDivisionModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      editingDivision={editingDivision}
      fetchDivisions={fetchDivisions}
      clearEdit={() =>
        setEditingDivision(null)
      }
    />

  </div>
);
};

export default DivisionsPage;
