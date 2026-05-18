import { deleteDivisionApi } from "../api/division.api.js";

const getStatusClassName = (status) =>
  status === "active"
    ? "school-badge-success"
    : "school-badge-danger";

const DivisionTable = ({
  divisions,
  fetchDivisions,
  setEditingDivision,
  openModal,
}) => {
  const handleDelete = async (
    divisionId
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this division?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteDivisionApi(
        divisionId
      );

      fetchDivisions();
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data
          ?.message ||
          "Failed to delete division"
      );
    }
  };

  if (!divisions.length) {
    return (
      <div className="school-card p-8 text-center sm:p-10">
        <div className="school-empty-state">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-lg font-bold text-white">
            DV
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            No divisions found
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
            Add a division to assign capacity, connect teachers, and organize each class into real classroom groups.
          </p>
        </div>
      </div>
    );
  }

 return (
  <div className="section overflow-hidden">

    {/* Header */}
    <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">

      <div>

        <h2 className="text-xl font-semibold text-gray-800">
          Divisions
        </h2>

        <p className="text-sm text-gray-500">
          Manage class divisions and teachers
        </p>

      </div>

      <div className="rounded-md border bg-gray-50 px-4 py-2">

        <p className="text-xs text-gray-500">
          Total Divisions
        </p>

        <p className="text-xl font-bold text-gray-800">
          {divisions.length}
        </p>

      </div>

    </div>

    {/* Empty */}
    {!divisions.length ? (

      <div className="p-10 text-center">

        <h2 className="text-lg font-semibold text-gray-700">
          No Divisions Found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Add divisions to display here
        </p>

      </div>

    ) : (

      <div className="table-container">

        <table className="table">

          <thead>
            <tr>
              <th>Division</th>
              <th>Class</th>
              <th>Teacher</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {divisions.map((division) => (

              <tr key={division._id}>

                <td>{division.name}</td>

                <td>
                  {division.classId?.name || "-"}
                </td>

                <td>
                  {division.assignedTeacher?.name || "-"}
                </td>

                <td>
                  {division.capacity}
                </td>

                <td>

                  <span
                    className={
                      division.status === "active"
                        ? "badge-success"
                        : "badge-danger"
                    }
                  >
                    {division.status}
                  </span>

                </td>

                <td>

                  <div className="flex gap-2">

                    <button
                      onClick={() => {
                        setEditingDivision(
                          division
                        );
                        openModal();
                      }}
                      className="btn-secondary"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          division._id
                        )
                      }
                      className="btn-danger"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    )}

  </div>
);
};

export default DivisionTable;
