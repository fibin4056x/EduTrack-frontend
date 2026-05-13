import api from "../../../../lib/api.js";

export const getClassesApi = async () => {
  const response = await api.get("/classes");

  return response.data;
};

export const createClassApi = async (payload) => {
  const response = await api.post(
    "/classes",
    payload
  );

  return response.data;
};

export const updateClassApi = async (
  id,
  payload
) => {
  const response = await api.put(
    `/classes/${id}`,
    payload
  );

  return response.data;
};

export const deleteClassApi = async (id) => {
  const response = await api.delete(
    `/classes/${id}`
  );

  return response.data;
};