import api from "../../../../lib/api";



export const getTeachers =
  async () => {
    const response =
      await api.get("/teachers");

    return response.data;
  };



export const createTeacher =
  async (teacherData) => {
    const response =
      await api.post(
        "/teachers",
        teacherData
      );

    return response.data;
  };



export const updateTeacherStatus =
  async (teacherId, status) => {
    const response =
      await api.patch(
        `/teachers/${teacherId}/status`,
        { status }
      );

    return response.data;
  };