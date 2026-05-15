import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/auth.api.js";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginRequest,
  });
};