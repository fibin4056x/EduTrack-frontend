import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getMyDivisionsApi,
  getStudentsByDivisionApi,
} from "../api/myStudents.api.js";

const useMyStudents = () => {
  const [divisions, setDivisions] =
    useState([]);

  const [selectedDivisionId, setSelectedDivisionId] =
    useState("");

  const [students, setStudents] =
    useState([]);

  const [loadingDivisions, setLoadingDivisions] =
    useState(false);

  const [loadingStudents, setLoadingStudents] =
    useState(false);

  const fetchDivisions = useCallback(async () => {
    try {
      setLoadingDivisions(true);

      const response =
        await getMyDivisionsApi();

      const divisionData =
        response || [];

      setDivisions(divisionData);

      setSelectedDivisionId(
        (currentDivisionId) => {
          if (
            divisionData.length > 0 &&
            !currentDivisionId
          ) {
            return divisionData[0]._id;
          }

          return currentDivisionId;
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDivisions(false);
    }
  }, []);

  const fetchStudents = useCallback(async (
    divisionId
  ) => {
    if (!divisionId) {
      setStudents([]);
      return;
    }

    try {
      setLoadingStudents(true);

      const response =
        await getStudentsByDivisionApi(
          divisionId
        );

      setStudents(response || []);
    } catch (error) {
      console.error(error);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  useEffect(() => {
    fetchStudents(selectedDivisionId);
  }, [
    fetchStudents,
    selectedDivisionId,
  ]);

  return {
    divisions,
    selectedDivisionId,
    setSelectedDivisionId,
    students,
    loadingDivisions,
    loadingStudents,
    refreshStudents: () =>
      fetchStudents(selectedDivisionId),
  };
};

export default useMyStudents;
