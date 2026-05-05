import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import API, {
  getApiErrorMessage,
} from "../api";
import Navbar from "../components/Navbar";
import { useAuthSession } from "../hooks/useAuthSession";
import { createLogger } from "../utils/logger";

import "./Dashboard.css";

const logger =
  createLogger("dashboard-page");

const formatLabel = (value) => {
  if (!value) {
    return "Not available";
  }

  const normalizedValue =
    String(value).trim();

  return (
    normalizedValue.charAt(0).toUpperCase() +
    normalizedValue.slice(1)
  );
};

function Dashboard() {
  const navigate =
    useNavigate();

  const {
    loading,
    user,
    isAuthenticated,
    clearSession,
  } = useAuthSession();

  useEffect(() => {
    if (
      !loading &&
      !isAuthenticated
    ) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    loading,
    navigate,
  ]);

  const handleLogout =
    async () => {
      try {
        logger.info(
          "Logging out current user."
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
      <div className="dashboard-loader">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-page">
      <Navbar
        isAuthenticated
        onLogout={handleLogout}
        showAnchors={false}
      />

      <main className="dashboard-shell">
        <section className="dashboard-hero">
          <p className="dashboard-kicker">
            Session active
          </p>

          <h1>
            Welcome back,{" "}
            {user.name}
          </h1>

          <p>
            Your account is
            connected and ready.
            This page gives you a
            cleaner place to
            verify login state
            while you build the
            rest of the product.
          </p>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-card">
            <h2>
              Account Summary
            </h2>

            <div className="dashboard-row">
              <span>Name</span>
              <strong>
                {user.name}
              </strong>
            </div>

            <div className="dashboard-row">
              <span>Email</span>
              <strong>
                {user.email ||
                  "Not provided"}
              </strong>
            </div>

            <div className="dashboard-row">
              <span>Role</span>
              <strong>
                {formatLabel(
                  user.role
                )}
              </strong>
            </div>

            <div className="dashboard-row">
              <span>Status</span>
              <strong>
                {formatLabel(
                  user.status
                )}
              </strong>
            </div>
          </article>

          <article className="dashboard-card">
            <h2>
              Auth Details
            </h2>

            <div className="dashboard-row">
              <span>
                Login provider
              </span>
              <strong>
                {formatLabel(
                  user.loginProvider
                )}
              </strong>
            </div>

            <div className="dashboard-row">
              <span>
                Email verified
              </span>
              <strong>
                {user.emailVerified
                  ? "Yes"
                  : "No"}
              </strong>
            </div>

            <div className="dashboard-row">
              <span>
                School
              </span>
              <strong>
                {user.school?.name ||
                  "Not assigned"}
              </strong>
            </div>

            <div className="dashboard-row">
              <span>
                School code
              </span>
              <strong>
                {user.school?.code ||
                  "Not assigned"}
              </strong>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
