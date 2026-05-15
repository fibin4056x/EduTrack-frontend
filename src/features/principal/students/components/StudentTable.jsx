import {
  deleteStudentApi,
} from "../api/student.api.js";



const StudentTable = ({
  students,
  fetchStudents,
  setEditingStudent,
  openModal,
}) => {




  /* =========================================
     DELETE STUDENT
  ========================================= */

  const handleDelete =
    async (studentId) => {

      const confirmDelete =
        window.confirm(
          "Delete this student?"
        );



      if (!confirmDelete) {
        return;
      }



      try {

        await deleteStudentApi(
          studentId
        );

        fetchStudents();

      } catch (error) {

        console.error(error);

        alert(
          error?.response?.data
            ?.message ||
            "Failed to delete student"
        );
      }
    };




  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">

      <table className="min-w-full">




        {/* =====================================
           TABLE HEAD
        ===================================== */}

        <thead className="bg-gray-100">

          <tr>

            <th className="px-4 py-3 text-left">
              Student
            </th>

            <th className="px-4 py-3 text-left">
              Class
            </th>

            <th className="px-4 py-3 text-left">
              Division
            </th>

            <th className="px-4 py-3 text-left">
              Gender
            </th>

            <th className="px-4 py-3 text-left">
              Status
            </th>

            <th className="px-4 py-3 text-left">
              Actions
            </th>

          </tr>
        </thead>




        {/* =====================================
           TABLE BODY
        ===================================== */}

        <tbody>

          {students.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                className="px-4 py-6 text-center text-gray-500"
              >
                No students found
              </td>

            </tr>

          ) : (

            students.map((student) => (

              <tr
                key={student._id}
                className="border-t"
              >




                {/* STUDENT */}

                <td className="px-4 py-3">

                  <div>

                    <p className="font-medium">

                      {student.nameEnglish}

                    </p>



                    {student.nameArabic && (

                      <p className="text-sm text-gray-500">

                        {student.nameArabic}

                      </p>
                    )}
                  </div>

                </td>




                {/* CLASS */}

                <td className="px-4 py-3">

                  {student.classId?.name || "-"}

                </td>




                {/* DIVISION */}

                <td className="px-4 py-3">

                  {student.divisionId?.name || "-"}

                </td>




                {/* GENDER */}

                <td className="px-4 py-3 capitalize">

                  {student.gender || "-"}

                </td>




                {/* STATUS */}

                <td className="px-4 py-3">

                  <span
                    className={`rounded px-2 py-1 text-sm ${
                      student.status ===
                      "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    {student.status}

                  </span>

                </td>




                {/* ACTIONS */}

                <td className="px-4 py-3">

                  <div className="flex gap-2">

                    <button
                      onClick={() => {

                        setEditingStudent(
                          student
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
                          student._id
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



export default StudentTable;
