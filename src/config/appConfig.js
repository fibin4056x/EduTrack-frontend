const fallbackApiUrl = "http://localhost:5000/api";

export const appConfig = Object.freeze({
  apiUrl:
    import.meta.env.VITE_API_URL?.trim() ||
    fallbackApiUrl,
  googleClientId:
    import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ||
    "",
});
