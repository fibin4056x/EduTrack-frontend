import {
  useEffect,
  useState,
} from "react";

import {
  getDivisionsApi,
} from "../api/division.api.js";



const useDivisions = () => {

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
          await getDivisionsApi();



        setDivisions(
          response.data || []
        );

      } catch (error) {

        console.error(
          "Error fetching divisions:",
          error
        );

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



export default useDivisions;