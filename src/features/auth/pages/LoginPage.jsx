import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useLogin } from "../hooks/useLogin";

function LoginPage() {
  const navigate = useNavigate();

  const { mutate, isPending } =
    useLogin();

  const { setUser } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================
  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // HANDLE SUBMIT
  // =========================================
  const handleSubmit = (event) => {
    event.preventDefault();

    setErrorMessage("");

    const payload = {
      email: form.email.trim(),
      password: form.password,
    };

    mutate(payload, {
      onSuccess: (response) => {
        const data = response.data;

        // =========================
        // STORE TOKEN
        // =========================
        localStorage.setItem(
          "token",
          data.token
        );

        // =========================
        // STORE USER
        // =========================
        setUser(data.user);

        // =========================
        // NAVIGATION
        // =========================
        switch (data.user.role) {
          case "principal":
            navigate(
              "/principal/dashboard"
            );
            break;

          case "teacher":
            navigate(
              "/teacher/dashboard"
            );
            break;

          default:
            navigate("/");
        }
      },

      onError: (error) => {
        setErrorMessage(
          error?.response?.data
            ?.message ||
            "Invalid email or password."
        );
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* =====================================
          HEADER
      ===================================== */}
      <div>
        <span className="school-pill">
          Welcome Back
        </span>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          Sign in to your workspace
        </h1>

        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
          Use your school email and
          password to access the
          principal or teacher dashboard.
        </p>
      </div>

      {/* =====================================
          FORM
      ===================================== */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* =====================================
            EMAIL
        ===================================== */}
        <div>
          <label
            htmlFor="email"
            className="school-label"
          >
            School Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@school.com"
            className="school-input"
            value={form.email}
            onChange={handleChange}
            disabled={isPending}
            required
          />

          <p className="school-helper">
            Use the email assigned to
            your school account.
          </p>
        </div>

        {/* =====================================
            PASSWORD
        ===================================== */}
        <div>
          <label
            htmlFor="password"
            className="school-label"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              className="school-input pr-14"
              value={form.password}
              onChange={handleChange}
              disabled={isPending}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>
        </div>

        {/* =====================================
            ERROR MESSAGE
        ===================================== */}
        {errorMessage && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        )}

        {/* =====================================
            ACTIONS
        ===================================== */}
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isPending}
            className="school-button-primary disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending
              ? "Signing In..."
              : "Open Dashboard"}
          </button>

          <p className="text-sm text-slate-500">
            Principals and teachers
            use the same secure login.
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;