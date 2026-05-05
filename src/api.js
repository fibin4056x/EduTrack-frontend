import axios from "axios";

import { appConfig } from "./config/appConfig";
import { createLogger } from "./utils/logger";

const logger = createLogger("api");

const NON_REFRESHABLE_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/google/login",
  "/auth/google/config",
  "/auth/logout",
];

const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
];

export const getApiErrorMessage = (
  error,
  fallback = "Something went wrong."
) =>
  error.response?.data?.message ||
  error.message ||
  fallback;

const shouldSkipRefresh = (
  requestUrl = ""
) =>
  NON_REFRESHABLE_ROUTES.some(
    (route) =>
      requestUrl.includes(route)
  );

const shouldRedirectToLogin =
  (pathname = "") =>
    PROTECTED_ROUTE_PREFIXES.some(
      (routePrefix) =>
        pathname.startsWith(
          routePrefix
        )
    );

const API = axios.create({
  baseURL: appConfig.apiUrl,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type":
      "application/json",
  },
});

const getToken = () =>
  localStorage.getItem("accessToken");

const setToken = (token) => {
  localStorage.setItem(
    "accessToken",
    token
  );
};

const removeToken = () => {
  localStorage.removeItem(
    "accessToken"
  );
};

const storedToken = getToken();

if (storedToken) {
  API.defaults.headers.common.Authorization =
    `Bearer ${storedToken}`;
}

API.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    logger.debug("Request started.", {
      method:
        config.method?.toUpperCase(),
      url: config.url,
    });

    return config;
  },
  (error) => {
    logger.error(
      "Request setup failed.",
      error
    );

    return Promise.reject(error);
  }
);

let isRefreshing = false;
let queue = [];

const runQueue = (
  error,
  token = null
) => {
  queue.forEach((item) => {
    if (error) {
      item.reject(error);
      return;
    }

    item.resolve(token);
  });

  queue = [];
};

API.interceptors.response.use(
  (response) => {
    logger.debug("Request finished.", {
      method:
        response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
    });

    return response;
  },
  async (error) => {
    const originalRequest =
      error.config;
    const status =
      error.response?.status;
    const requestUrl =
      originalRequest?.url || "";
    const refreshRoute =
      requestUrl.includes(
        "/auth/refresh"
      );

    logger.warn("Request failed.", {
      method:
        originalRequest?.method?.toUpperCase(),
      url: requestUrl,
      status,
      message:
        getApiErrorMessage(
          error,
          "API request failed."
        ),
    });

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !refreshRoute &&
      !shouldSkipRefresh(
        requestUrl
      )
    ) {
      if (isRefreshing) {
        return new Promise(
          (resolve, reject) => {
            queue.push({
              resolve,
              reject,
            });
          }
        )
          .then((token) => {
            originalRequest.headers =
              originalRequest.headers ||
              {};

            originalRequest.headers.Authorization =
              `Bearer ${token}`;

            return API(
              originalRequest
            );
          })
          .catch((queueError) =>
            Promise.reject(
              queueError
            )
          );
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        logger.info(
          "Refreshing access token."
        );

        const response =
          await axios.post(
            `${appConfig.apiUrl}/auth/refresh`,
            {},
            {
              withCredentials:
                true,
            }
          );

        const newToken =
          response.data
            ?.accessToken;

        if (!newToken) {
          throw new Error(
            "No access token returned from refresh."
          );
        }

        setToken(newToken);

        API.defaults.headers.common.Authorization =
          `Bearer ${newToken}`;

        runQueue(null, newToken);

        originalRequest.headers =
          originalRequest.headers ||
          {};
        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        logger.info(
          "Access token refreshed successfully."
        );

        return API(
          originalRequest
        );
      } catch (refreshError) {
        logger.warn(
          "Token refresh failed.",
          {
            message:
              getApiErrorMessage(
                refreshError,
                "Unable to refresh the current session."
              ),
          }
        );

        runQueue(
          refreshError,
          null
        );
        removeToken();

        if (
          shouldRedirectToLogin(
            window.location
              .pathname
          )
        ) {
          window.location.assign(
            "/login"
          );
        }

        return Promise.reject(
          refreshError
        );
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authStorage = {
  getToken,
  setToken,
  removeToken,
};

export default API;
