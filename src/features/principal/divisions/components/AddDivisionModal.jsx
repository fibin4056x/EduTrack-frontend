import DivisionForm from "./DivisionForm.jsx";

const AddDivisionModal = ({
  isOpen,
  onClose,
  editingDivision,
  fetchDivisions,
  clearEdit,
}) => {
  if (!isOpen) {
    return null;
  }

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

export default AddDivisionModal;
