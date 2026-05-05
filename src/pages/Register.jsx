import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import API, {
  authStorage,
  getApiErrorMessage,
} from "../api";
import { appConfig } from "../config/appConfig";
import { createLogger } from "../utils/logger";

import "./Register.css";

const logger =
  createLogger("register-page");

function Register() {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "teacher",
    });

  const [loading, setLoading] =
    useState(false);

  const [
    googleLoading,
    setGoogleLoading,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const changeHandler = (event) => {
    const { name, value } =
      event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setError("");
  };

  const submitHandler = async (
    event
  ) => {
    event.preventDefault();

    const payload = {
      ...form,
      name: form.name.trim(),
      email: form.email
        .trim()
        .toLowerCase(),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.password
    ) {
      setError(
        "Please fill all required fields."
      );
      return;
    }

    if (
      payload.password.length <
      6
    ) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      logger.info(
        "Submitting local registration request."
      );

      const response =
        await API.post(
          "/auth/register",
          payload
        );

      if (
        response.data
          ?.accessToken
      ) {
        authStorage.setToken(
          response.data
            .accessToken
        );
      }

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      const message =
        getApiErrorMessage(
          error,
          "Registration failed. Please try again."
        );

      logger.warn(
        "Local registration failed.",
        { message }
      );

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess =
    async (
      credentialResponse
    ) => {
      try {
        setGoogleLoading(
          true
        );
        setError("");
        logger.info(
          "Submitting Google registration request."
        );

        const response =
          await API.post(
            "/auth/google/login",
            {
              credential:
                credentialResponse.credential,
              role: form.role,
            }
          );

        if (
          response.data
            ?.accessToken
        ) {
          authStorage.setToken(
            response.data
              .accessToken
          );
        }

        navigate("/dashboard", {
          replace: true,
        });
      } catch (error) {
        const message =
          getApiErrorMessage(
            error,
            "Google sign up failed."
          );

        logger.warn(
          "Google registration failed.",
          { message }
        );

        setError(message);
      } finally {
        setGoogleLoading(
          false
        );
      }
    };

  const handleGoogleError =
    () => {
      logger.warn(
        "Google OAuth popup failed on the client."
      );
      setError(
        "Google authentication failed."
      );
    };

  return (
    <div className="register-page">
      <div className="register-left">
        <div className="register-overlay"></div>

        <div className="register-left-content">
          <span className="register-tag">
            Join SLMS
          </span>

          <h1>
            Create Your{" "}
            <span>
              School Account
            </span>
          </h1>

          <p>
            Register securely
            and start managing
            teachers, students,
            attendance,
            academic records
            and school
            operations.
          </p>

          <div className="benefit-list">
            <div className="benefit-card">
              <h3>Fast Setup</h3>
              <p>
                Start your
                institution
                dashboard in
                minutes.
              </p>
            </div>

            <div className="benefit-card">
              <h3>
                Secure Access
              </h3>
              <p>
                Protected login
                with role-based
                permissions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="register-right">
        <form
          className="register-form"
          onSubmit={
            submitHandler
          }
        >
          <h2>
            Create Account
          </h2>

          <p>
            Enter details to
            continue
          </p>

          {error ? (
            <div className="register-error">
              {error}
            </div>
          ) : null}

          <div className="register-group">
            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={
                changeHandler
              }
              autoComplete="name"
            />
          </div>

          <div className="register-group">
            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={
                changeHandler
              }
              autoComplete="email"
            />
          </div>

          <div className="register-group">
            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={
                form.password
              }
              onChange={
                changeHandler
              }
              autoComplete="new-password"
            />
          </div>

          <div className="register-group">
            <label>Role</label>

            <select
              name="role"
              value={form.role}
              onChange={
                changeHandler
              }
            >
              <option value="teacher">
                Teacher
              </option>

              <option value="principal">
                Principal
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Register"}
          </button>

          {appConfig.googleClientId ? (
            <>
              <div className="register-divider">
                <span>or</span>
              </div>

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "center",
                  opacity:
                    googleLoading
                      ? 0.7
                      : 1,
                }}
              >
                <GoogleLogin
                  onSuccess={
                    handleGoogleSuccess
                  }
                  onError={
                    handleGoogleError
                  }
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="pill"
                />
              </div>
            </>
          ) : (
            <p className="auth-note">
              Google sign-in is
              currently not
              configured for
              this environment.
            </p>
          )}

          <div className="register-bottom">
            Already have an
            account?{" "}
            <Link to="/login">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
