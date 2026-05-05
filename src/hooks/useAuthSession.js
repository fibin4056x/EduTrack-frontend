import { useEffect, useState } from "react";

import API, {
  authStorage,
  getApiErrorMessage,
} from "../api";
import { createLogger } from "../utils/logger";

const logger =
  createLogger("auth-session");

export function useAuthSession() {
  const hasStoredToken = Boolean(
    authStorage.getToken()
  );

  const [state, setState] = useState({
    loading: hasStoredToken,
    user: null,
  });

  useEffect(() => {
    let isActive = true;

    if (!hasStoredToken) {
      return undefined;
    }

    const loadSession = async () => {
      try {
        logger.debug(
          "Checking current user session."
        );

        const response =
          await API.get("/auth/me");

        if (!isActive) {
          return;
        }

        setState({
          loading: false,
          user:
            response.data?.user ||
            null,
        });
      } catch (error) {
        logger.warn(
          "Session lookup failed.",
          {
            message:
              getApiErrorMessage(
                error,
                "Unable to verify the current user session."
              ),
          }
        );

        authStorage.removeToken();

        if (!isActive) {
          return;
        }

        setState({
          loading: false,
          user: null,
        });
      }
    };

    loadSession();

    return () => {
      isActive = false;
    };
  }, [hasStoredToken]);

  const clearSession = () => {
    authStorage.removeToken();
    setState({
      loading: false,
      user: null,
    });
  };

  const setUser = (user) => {
    setState({
      loading: false,
      user,
    });
  };

  return {
    ...state,
    isAuthenticated: Boolean(
      state.user
    ),
    clearSession,
    setUser,
  };
}
