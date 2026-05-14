import { useState } from "react";

import useDivisions
  from "../hooks/useDivisions.js";

import AddDivisionModal
  from "../components/AddDivisionModal.jsx";

import DivisionTable
  from "../components/DivisionTable.jsx";



const DivisionsPage = () => {

  const {
    divisions,
    loading,
    fetchDivisions,
  } = useDivisions();




  const [isModalOpen,
    setIsModalOpen] =
    useState(false);

  const [editingDivision,
    setEditingDivision] =
    useState(null);




  /* =========================================
     CLOSE MODAL
  ========================================= */

  const handleCloseModal =
    () => {

      setIsModalOpen(false);

      setEditingDivision(null);
    };




  return (
    <div className="space-y-6">




      {/* HEADER */}

      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-bold">
          Divisions
        </h1>




        <button
          onClick={() =>
            setIsModalOpen(true)
          }
          className="rounded bg-black px-4 py-2 text-white"
        >
          Add Division
        </button>

      </div>




      {/* TABLE */}

      {loading ? (

        <p>Loading...</p>

      ) : (

        <DivisionTable
          divisions={divisions}

          fetchDivisions={
            fetchDivisions
          }

          setEditingDivision={
            setEditingDivision
          }

          openModal={() =>
            setIsModalOpen(true)
          }
        />
      )}




      {/* MODAL */}

      <AddDivisionModal
        isOpen={isModalOpen}

        onClose={handleCloseModal}

        editingDivision={
          editingDivision
        }

        fetchDivisions={
          fetchDivisions
        }

        clearEdit={() =>
          setEditingDivision(null)
        }
      />
    </div>
  );
};



export default DivisionsPage;