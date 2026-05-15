import {
  useEffect,
  useState,
} from "react";

import {
  getMyDivisionsApi,
} from "../api/teacher.api.js";



const useMyDivisions = () => {

  const [divisions,
    setDivisions] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);




  const fetchDivisions =
    async () => {

      try {

        setLoading(true);

      const response =
        await getMyDivisionsApi();



        setDivisions(
          response || []
        );
      } catch (error) {

        console.error(
          "Fetch teacher divisions error:",
          error
        );

        setDivisions([]);
      } finally {

        setLoading(false);
      }
    };




  useEffect(() => {

    fetchDivisions();

  }, []);




  return {
    divisions,
    loading,
    fetchDivisions,
  };
};



export default useMyDivisions;
