import API from "../../../lib/api.js";

export const loginRequest = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};