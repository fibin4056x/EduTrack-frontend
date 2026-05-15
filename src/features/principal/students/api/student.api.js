import api
  from "../../../../lib/api.js";



/* =========================================
   GET STUDENTS
========================================= */

export const getStudentsApi =
  async () => {

    const response =
      await api.get(
        "/students"
      );

    return response.data;
  };



/* =========================================
   CREATE STUDENT
========================================= */

export const createStudentApi =
  async (payload) => {

    const response =
      await api.post(
        "/students",
        payload
      );

    return response.data;
  };



/* =========================================
   UPDATE STUDENT
========================================= */

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



/* =========================================
   DELETE STUDENT
========================================= */

export const deleteStudentApi =
  async (id) => {

    const response =
      await api.delete(
        `/students/${id}`
      );

    return response.data;
  };



/* =========================================
   GET CLASSES
========================================= */

export const getClassesApi =
  async () => {

    const response =
      await api.get(
        "/classes"
      );

    return response.data;
  };



/* =========================================
   GET DIVISIONS
========================================= */

export const getDivisionsApi =
  async () => {

    const response =
      await api.get(
        "/divisions"
      );

    return response.data;
  };

export const bulkUploadStudentsApi =
  async (formData) => {

    const response =
      await api.post(
        "/students/bulk-upload",
        formData
      );

    return response.data;
  };

