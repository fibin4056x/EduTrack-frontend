import DivisionForm
  from "./DivisionForm.jsx";



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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-2xl rounded-xl bg-white">




        {/* HEADER */}

        <div className="flex items-center justify-between border-b p-4">

          <h2 className="text-xl font-bold">

            {editingDivision
              ? "Edit Division"
              : "Add Division"}

          </h2>




          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>

        </div>




        {/* FORM */}

        <div className="p-4">

          <DivisionForm
            editingDivision={
              editingDivision
            }

            fetchDivisions={
              fetchDivisions
            }

            clearEdit={clearEdit}

            onClose={onClose}
          />

        </div>
      </div>
    </div>
  );
};



export default AddDivisionModal;