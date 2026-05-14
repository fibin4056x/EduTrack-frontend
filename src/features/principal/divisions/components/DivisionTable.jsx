import {
  deleteDivisionApi,
} from "../api/division.api.js";



const DivisionTable = ({
  divisions,
  fetchDivisions,
  setEditingDivision,
  openModal,
}) => {




  /* =========================================
     DELETE DIVISION
  ========================================= */

  const handleDelete =
    async (divisionId) => {

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




  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="px-4 py-3 text-left">
              Division
            </th>

            <th className="px-4 py-3 text-left">
              Class
            </th>

            <th className="px-4 py-3 text-left">
              Teacher
            </th>

            <th className="px-4 py-3 text-left">
              Capacity
            </th>

            <th className="px-4 py-3 text-left">
              Status
            </th>

            <th className="px-4 py-3 text-left">
              Actions
            </th>

          </tr>
        </thead>




        <tbody>

          {divisions.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                className="px-4 py-6 text-center text-gray-500"
              >
                No divisions found
              </td>

            </tr>

          ) : (

            divisions.map((division) => (

              <tr
                key={division._id}
                className="border-t"
              >

                {/* DIVISION NAME */}

                <td className="px-4 py-3">

                  {division.name}

                </td>



                {/* CLASS */}

                <td className="px-4 py-3">

                  {division.classId?.name || "-"}

                </td>



                {/* TEACHER */}

                <td className="px-4 py-3">

                  {division.assignedTeacher
                    ?.name || "-"}

                </td>



                {/* CAPACITY */}

                <td className="px-4 py-3">

                  {division.capacity}

                </td>



                {/* STATUS */}

                <td className="px-4 py-3">

                  <span
                    className={`rounded px-2 py-1 text-sm ${
                      division.status ===
                      "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    {division.status}

                  </span>

                </td>



                {/* ACTIONS */}

                <td className="px-4 py-3">

                  <div className="flex gap-2">

                    <button
                      onClick={() => {

                        setEditingDivision(
                          division
                        );

                        openModal();
                      }}
                      className="rounded bg-blue-500 px-3 py-1 text-white"
                    >
                      Edit
                    </button>



                    <button
                      onClick={() =>
                        handleDelete(
                          division._id
                        )
                      }
                      className="rounded bg-red-500 px-3 py-1 text-white"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};



export default DivisionTable;