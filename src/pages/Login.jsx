import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import API, {
  authStorage,
  getApiErrorMessage,
} from "../api";
import { appConfig } from "../config/appConfig";
import { createLogger } from "../utils/logger";

import "./Login.css";

const logger =
  createLogger("login-page");

function Login() {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      email: "",
      password: "",
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
      email: form.email
        .trim()
        .toLowerCase(),
      password:
        form.password,
    };

    if (
      !payload.email ||
      !payload.password
    ) {
      setError(
        "Please fill all fields."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      logger.info(
        "Submitting local login request."
      );

      const response =
        await API.post(
          "/auth/login",
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
          "Login failed. Please try again."
        );

      logger.warn(
        "Local login failed.",
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
          "Submitting Google login request."
        );

        const response =
          await API.post(
            "/auth/google/login",
            {
              credential:
                credentialResponse.credential,
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
            "Google login failed."
          );

        logger.warn(
          "Google login failed.",
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
    <div className="login-page">
      <div className="login-left">
        <div className="overlay"></div>

        <div className="left-content">
          <span className="tagline">
            SLMS Portal
          </span>

          <h1>
            Welcome{" "}
            <span>Back</span>
          </h1>

          <p>
            Securely access your
            school dashboard,
            manage classes,
            students, records
            and communication
            from one place.
          </p>

          <div className="info-boxes">
            <div className="info-card">
              <h3>
                Smart Access
              </h3>
              <p>
                Role-based login
                for principals
                and teachers.
              </p>
            </div>

            <div className="info-card">
              <h3>
                Secure System
              </h3>
              <p>
                Protected
                academic data
                with JWT
                authentication.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <form
          className="login-form"
          onSubmit={
            submitHandler
          }
        >
          <h2>
            Login Account
          </h2>

          <p>
            Enter your
            credentials to
            continue
          </p>

          {error ? (
            <div className="error-box">
              {error}
            </div>
          ) : null}

          <div className="input-group">
            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={
                changeHandler
              }
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={
                form.password
              }
              onChange={
                changeHandler
              }
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </button>

          {appConfig.googleClientId ? (
            <>
              <div className="divider">
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

          <div className="bottom-text">
            Don't have an
            account?{" "}
            <Link to="/register">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
