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
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">
        Classes
      </h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">
              Class
            </th>

            <th className="p-3 text-left">
              Division
            </th>

            <th className="p-3 text-left">
              Academic Year
            </th>

            <th className="p-3 text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {classes.map((item) => (
            <tr
              key={item._id}
              className="border-b"
            >
              <td className="p-3">
                {item.name}
              </td>

              <td className="p-3">
                {item.section}
              </td>

              <td className="p-3">
                {item.academicYear}
              </td>

              <td className="flex gap-2 p-3">
                <button
                  onClick={() =>
                    setEditingClass(item)
                  }
                  className="rounded bg-blue-500 px-3 py-1 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(item._id)
                  }
                  className="rounded bg-red-500 px-3 py-1 text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassesTable;