import useTeachers
  from "../hooks/useTeachers";

import TeacherTable
  from "../components/TeacherTable";

import AddTeacherModal
  from "../components/AddTeacherModal";



const TeachersPage = () => {
  const {
    teachers,
    loading,
    fetchTeachers,
  } = useTeachers();



  return (
    <div>
      <h1>Teachers</h1>

      <AddTeacherModal
        refreshTeachers={
          fetchTeachers
        }
      />

      <TeacherTable
        teachers={teachers}
        loading={loading}
        refreshTeachers={
          fetchTeachers
        }
      />
    </div>
  );
};

export default TeachersPage;