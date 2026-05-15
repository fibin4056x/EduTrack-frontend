import api
  from "../../../lib/api.js";



/* =========================================
   GET MY DIVISIONS
========================================= */

export const getMyDivisionsApi =
  async () => {

    const response =
      await api.get(
        "/divisions/my/divisions"
      );

    return response.data?.data || [];
  };
  /* =========================================
   GET STUDENTS BY DIVISION
========================================= */

export const getStudentsByDivisionApi =
  async (divisionId) => {

    const response =
      await api.get(
        `/students/division/${divisionId}`
      );

    return response.data?.data || [];
  };

  
