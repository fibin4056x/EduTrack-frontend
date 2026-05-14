import {
  useEffect,
  useState,
} from "react";

import {
  getStudentsApi,
} from "../api/student.api";

const useStudents = () => {

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(false);



  const fetchStudents =
    async () => {

      try {

        setLoading(true);

        const response =
          await getStudentsApi();

        setStudents(response.data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };



  useEffect(() => {

    fetchStudents();

  }, []);



  return {
    students,
    loading,
    fetchStudents,
  };
};

export default useStudents;