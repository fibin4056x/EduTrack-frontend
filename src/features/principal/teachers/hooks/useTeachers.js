import {
  useEffect,
  useState,
} from "react";

import {
  getTeachers,
} from "../api/teacher.api.js";



const useTeachers = () => {
  const [teachers, setTeachers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);



  const fetchTeachers =
    async () => {
      try {
        setLoading(true);

        const response =
          await getTeachers();

        setTeachers(
          response.data || []
        );
      } catch (error) {
        console.error(
          "Error fetching teachers:",
          error
        );
      } finally {
        setLoading(false);
      }
    };



  useEffect(() => {
    fetchTeachers();
  }, []);




  return {
    teachers,
    loading,
    fetchTeachers,
  };
};

export default useTeachers;