import axios from "../../../../lib/api.js";

export const markAttendanceApi =
  (data) =>
    axios.post(
      "/attendance/mark",
      data
    );

export const getDivisionAttendanceApi =
  (divisionId) =>
    axios.get(
      `/attendance/division/${divisionId}`
    );