import useMyDivisions
  from "../../hooks/useMyDivisions.js";
import { useNavigate } from "react-router-dom";



const DashboardPage = () => {
  const navigate = useNavigate();

  const {
    divisions,
    loading,
  } = useMyDivisions();




  return (
    <div className="space-y-6">




      {/* =====================================
         PAGE HEADER
      ===================================== */}

      <div>

        <h1 className="text-3xl font-bold">
          Teacher Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your classroom divisions
          and daily school activities.
        </p>

      </div>




      {/* =====================================
         STATS
      ===================================== */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-xl bg-white p-5 shadow">

          <p className="text-sm text-gray-500">
            Assigned Divisions
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {divisions.length}
          </h2>

        </div>




        <div className="rounded-xl bg-white p-5 shadow">

          <p className="text-sm text-gray-500">
            Active Classes
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {
              new Set(
                divisions.map(
                  (item) =>
                    item.classId?._id
                )
              ).size
            }
          </h2>

        </div>




        <div className="rounded-xl bg-white p-5 shadow">

          <p className="text-sm text-gray-500">
            School Role
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Class Teacher
          </h2>

        </div>

      </div>




      {/* =====================================
         MY DIVISIONS
      ===================================== */}

      <div className="rounded-xl bg-white p-6 shadow">

        <div className="mb-5 flex items-center justify-between">

          <div>

            <h2 className="text-xl font-semibold">
              My Divisions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Divisions currently assigned
              to you.
            </p>

          </div>

        </div>




        {loading ? (

          <p>Loading...</p>

        ) : divisions.length === 0 ? (

          <p className="text-gray-500">
            No divisions assigned yet.
          </p>

        ) : (

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {divisions.map(
              (division) => (

                <div
                  key={division._id}
                  className="rounded-xl border p-5"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <h3 className="text-2xl font-bold">

                        {division.classId?.name}
                        -
                        {division.name}

                      </h3>




                      <p className="mt-2 text-sm text-gray-500">

                        Capacity:
                        {" "}
                        {division.capacity}

                      </p>

                    </div>




                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        division.status ===
                        "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >

                      {division.status}

                    </span>

                  </div>




                  <div className="mt-5">

                        <button
                          onClick={() =>
                            navigate(
                              `/teacher/students/${division._id}`
                            )
                          }
                          className="rounded bg-black px-4 py-2 text-sm text-white"
                        >
                          View Students
                        </button>

                  </div>

                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};



export default DashboardPage;
