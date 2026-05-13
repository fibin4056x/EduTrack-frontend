import useTeachers
  from "../hooks/useTeachers";

import AddTeacherModal
  from "../components/AddTeacherModal";

import TeacherTable
  from "../components/TeacherTable";



function TeachersPage() {
  const {
    teachers,
    fetchTeachers,
  } = useTeachers();



  return (
    <div>

      <h1 className="text-2xl font-semibold mb-6">
        Teachers
      </h1>

      <AddTeacherModal
        refreshTeachers={
          fetchTeachers
        }
      />

      <TeacherTable
        teachers={teachers}
        refreshTeachers={
          fetchTeachers
        }
      />

    </div>
  );
}

export default TeachersPage;