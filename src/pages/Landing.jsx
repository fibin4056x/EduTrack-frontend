import {
  Link,
  useNavigate,
} from "react-router-dom";

import API, {
  getApiErrorMessage,
} from "../api";
import Navbar from "../components/Navbar";
import { useAuthSession } from "../hooks/useAuthSession";
import { createLogger } from "../utils/logger";

import "./Landing.css";

const logger =
  createLogger("landing-page");

function Landing() {
  const navigate =
    useNavigate();

  const {
    loading,
    user,
    isAuthenticated,
    clearSession,
  } = useAuthSession();

  const handleLogout =
    async () => {
      try {
        logger.info(
          "Logging out from landing page."
        );

        await API.post(
          "/auth/logout"
        );
      } catch (error) {
        logger.warn(
          "Logout request failed.",
          {
            message:
              getApiErrorMessage(
                error,
                "Unable to complete logout on the server."
              ),
          }
        );
      } finally {
        clearSession();

        navigate("/", {
          replace: true,
        });
      }
    };

  if (loading) {
    return (
      <div className="loader">
        Loading...
      </div>
    );
  }

  return (
    <div className="landing-page">
      <Navbar
        isAuthenticated={
          isAuthenticated
        }
        onLogout={handleLogout}
      />

      <section className="hero-section">
        <div className="hero-left">
          <span className="tag">
            Modern School
            Management
          </span>

          <h1>
            Manage Your
            School <br />
            <span>
              Smarter & Faster
            </span>
          </h1>

          <p>
            Powerful School
            Learning Management
            System to manage
            students, teachers,
            attendance, academic
            records and
            communication in one
            secure platform.
          </p>

          {isAuthenticated &&
          user ? (
            <p className="welcome-message">
              Welcome,{" "}
              {user.name}
            </p>
          ) : null}

          <div className="hero-buttons">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="primary-btn"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="primary-btn"
                >
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="secondary-btn"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          <div className="stats">
            <div>
              <h3>500+</h3>
              <p>Schools</p>
            </div>

            <div>
              <h3>25k+</h3>
              <p>Students</p>
            </div>

            <div>
              <h3>99%</h3>
              <p>Uptime</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="dashboard-card">
            <h3>
              School Dashboard
            </h3>

            <div className="card-item">
              <span>
                Total Students
              </span>
              <strong>1,248</strong>
            </div>

            <div className="card-item">
              <span>Teachers</span>
              <strong>86</strong>
            </div>

            <div className="card-item">
              <span>Attendance</span>
              <strong>94%</strong>
            </div>

            <div className="card-item">
              <span>
                Assignments
              </span>
              <strong>312</strong>
            </div>
          </div>
        </div>
      </section>

      <section
        className="features-section"
        id="features"
      >
        <h2>
          Everything You Need
        </h2>

        <p>
          Built for modern
          schools with speed,
          security and
          simplicity.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>
              Student
              Management
            </h3>

            <p>
              Organize student
              profiles, classes
              and records.
            </p>
          </div>

          <div className="feature-card">
            <h3>Attendance</h3>

            <p>
              Mark daily
              attendance
              digitally.
            </p>
          </div>

          <div className="feature-card">
            <h3>Reports</h3>

            <p>
              Monitor growth and
              academic
              performance.
            </p>
          </div>
        </div>
      </section>

      <section
        className="cta-section"
        id="about"
      >
        <h2>
          Ready to Digitize
          Your School?
        </h2>

        <p>
          Join schools using
          SLMS to simplify
          operations.
        </p>

        {!isAuthenticated ? (
          <Link
            to="/register"
            className="primary-btn"
          >
            Start Free Today
          </Link>
        ) : null}
      </section>

      <footer className="footer">
        <p>
          &copy; 2026 SLMS. All
          rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Landing;
