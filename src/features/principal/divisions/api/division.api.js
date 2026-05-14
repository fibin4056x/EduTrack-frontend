import api
  from "../../../../lib/api.js";



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



/* =========================================
   CREATE DIVISION
========================================= */

export const createDivisionApi =
  async (payload) => {

    const response =
      await api.post(
        "/divisions",
        payload
      );

    return response.data;
  };



/* =========================================
   UPDATE DIVISION
========================================= */

export const updateDivisionApi =
  async (
    id,
    payload
  ) => {

    const response =
      await api.patch(
        `/divisions/${id}`,
        payload
      );

    return response.data;
  };



/* =========================================
   DELETE DIVISION
========================================= */

export const deleteDivisionApi =
  async (id) => {

    const response =
      await api.delete(
        `/divisions/${id}`
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
   GET TEACHERS
========================================= */

export const getTeachersApi =
  async () => {

    const response =
      await api.get(
        "/teachers"
      );

    return response.data;
  };