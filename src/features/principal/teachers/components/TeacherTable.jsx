import {
  updateTeacherStatus,
} from "../api/teacher.api.js";



function TeacherTable({
  teachers,
  refreshTeachers,
}) {

  const handleStatusChange =
    async (id, currentStatus) => {

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
    <div className="bg-white p-6 rounded-lg border">

      <h2 className="text-lg font-semibold mb-4">
        Teachers
      </h2>

      <table className="w-full border-collapse">

        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>

          {teachers.map((teacher) => (
            <tr
              key={teacher._id}
              className="border-b"
            >

              <td className="p-2">
                {teacher.name}
              </td>

              <td className="p-2">
                {teacher.email}
              </td>

              <td className="p-2">
                {teacher.status}
              </td>

              <td className="p-2">

                <button
                  onClick={() =>
                    handleStatusChange(
                      teacher._id,
                      teacher.status
                    )
                  }
                  className="bg-gray-900 text-white px-3 py-1 rounded"
                >
                  {teacher.status ===
                  "active"
                    ? "Suspend"
                    : "Activate"}
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>
    </div>
  );
}

export default TeacherTable;