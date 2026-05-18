import { updateTeacherStatus } from "../api/teacher.api.js";

const getInitials = (name) => {
  if (!name) {
    return "TC";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part[0].toUpperCase()
    )
    .join("");
};

function TeacherTable({
  teachers,
  refreshTeachers,
}) {
  const handleStatusChange = async (
    id,
    currentStatus
  ) => {
    const newStatus =
      currentStatus === "active"
        ? "suspended"
        : "active";

    try {
      await updateTeacherStatus(
        id,
        newStatus
      );

      refreshTeachers();
    } catch (error) {
      console.log(error);
    }
  };
return (
  <div className="section overflow-hidden">

    {/* Header */}
    <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">

      <div>

        <h2 className="text-xl font-semibold text-gray-800">
          Teachers
        </h2>

        <p className="text-sm text-gray-500">
          Manage teacher accounts and access
        </p>

      </div>

      <div className="rounded-md border bg-gray-50 px-4 py-2">

        <p className="text-xs text-gray-500">
          Total Teachers
        </p>

        <p className="text-xl font-bold text-gray-800">
          {teachers.length}
        </p>

      </div>

    </div>

    {/* Empty */}
    {!teachers.length ? (

      <div className="p-10 text-center">

        <h2 className="text-lg font-semibold text-gray-700">
          No Teachers Found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Add teachers to display here
        </p>

      </div>

    ) : (

      <div className="table-container">

        <table className="table">

          <thead>
            <tr>
              <th>Teacher</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {teachers.map((teacher) => {

              const isActive =
                teacher.status === "active";

              return (

                <tr key={teacher._id}>

                  {/* Teacher */}
                  <td>

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">

                        {getInitials(
                          teacher.name
                        )}

                      </div>

                      <p className="font-medium text-gray-800">
                        {teacher.name}
                      </p>

                    </div>

                  </td>

                  {/* Email */}
                  <td>
                    {teacher.email}
                  </td>

                  {/* Status */}
                  <td>

                    <span
                      className={
                        isActive
                          ? "badge-success"
                          : "badge-danger"
                      }
                    >
                      {teacher.status}
                    </span>

                  </td>

                  {/* Action */}
                  <td>

                    <button
                      onClick={() =>
                        handleStatusChange(
                          teacher._id,
                          teacher.status
                        )
                      }
                      className={
                        isActive
                          ? "btn-danger"
                          : "btn-primary"
                      }
                    >

                      {isActive
                        ? "Suspend"
                        : "Activate"}

                    </button>

                  </td>

                </tr>

              );
            })}

          </tbody>

        </table>

      </div>

    )}

  </div>
);
}

export default TeacherTable;
