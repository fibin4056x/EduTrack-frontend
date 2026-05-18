import { deleteClassApi } from "../api/class.api.js";

const ClassesTable = ({
  classes,
  fetchClasses,
  setEditingClass,
}) => {
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this class?"
    );

    if (!confirmed) return;

    try {
      await deleteClassApi(id);
      fetchClasses();
    } catch (error) {
      console.error(error);
      alert("Failed to delete class");
    }
  };

 return (
  <div className="section overflow-hidden">

    {/* Header */}
    <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Classes
        </h2>

        <p className="text-sm text-gray-500">
          Manage school classes and academic years
        </p>
      </div>

      <div className="rounded-md border bg-gray-50 px-4 py-2">
        <p className="text-xs text-gray-500">
          Total Classes
        </p>

        <p className="text-xl font-bold text-gray-800">
          {classes.length}
        </p>
      </div>

    </div>

    {/* Empty */}
    {!classes.length ? (

      <div className="p-10 text-center">

        <h2 className="text-lg font-semibold text-gray-700">
          No Classes Found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Add classes to display here
        </p>

      </div>

    ) : (

      <div className="table-container">

        <table className="table">

          <thead>
            <tr>
              <th>Class Name</th>
              <th>Academic Year</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {classes.map((item) => (

              <tr key={item._id}>

                {/* Name */}
                <td>
                  <p className="font-medium">
                    {item.name}
                  </p>
                </td>

                {/* Academic Year */}
                <td>
                  {item.academicYear}
                </td>

                {/* Status */}
                <td>

                  <span
                    className={
                      item.status === "inactive"
                        ? "badge-muted"
                        : "badge-success"
                    }
                  >
                    {item.status}
                  </span>

                </td>

                {/* Actions */}
                <td>

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        setEditingClass(item)
                      }
                      className="btn-secondary"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(item._id)
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

export default ClassesTable;
