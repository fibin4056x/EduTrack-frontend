import api from "../../../../lib/api.js";



export const getStudentsApi =
  async () => {

    const response =
      await api.get("/students");

    return response.data;
  };



export const createStudentApi =
  async (payload) => {

    const response =
      await api.post(
        "/students",
        payload
      );

    return response.data;
  };



export const updateStudentApi =
  async (
    id,
    payload
  ) => {

    const response =
      await api.patch(
        `/students/${id}`,
        payload
      );

    return response.data;
  };



export const deleteStudentApi =
  async (id) => {

    const response =
      await api.delete(
        `/students/${id}`
      );

    return response.data;
  };



export const getClassesApi =
  async () => {

    const response =
      await api.get("/classes");

    return response.data;
  };