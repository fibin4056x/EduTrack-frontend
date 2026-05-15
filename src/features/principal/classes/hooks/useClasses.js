import { useEffect, useState } from "react";

import { getClassesApi } from "../api/class.api.js";

const useClasses = () => {
  const [classes, setClasses] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const fetchClasses = async () => {
    try {
      setLoading(true);

      const response =
        await getClassesApi();

      setClasses(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return {
    classes,
    loading,
    fetchClasses,
    setClasses,
  };
};

export default useClasses;