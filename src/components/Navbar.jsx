
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({
  isAuthenticated = false,
  onLogout,
  showAnchors = true,
}) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          to="/"
          className="site-logo"
        >
          SLMS
        </Link>

        <nav className="site-menu">
          {showAnchors ? (
            <>
              <a
                href="#features"
                className="site-link"
              >
                Features
              </a>

              <a
                href="#about"
                className="site-link"
              >
                About
              </a>
            </>
          ) : (
            <Link
              to="/"
              className="site-link"
            >
              Home
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Link
                to={
                  showAnchors
                    ? "/dashboard"
                    : "/"
                }
                className="site-button site-button--secondary"
              >
                {showAnchors
                  ? "Dashboard"
                  : "Home"}
              </Link>

              <button
                type="button"
                className="site-button site-button--primary"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="site-button site-button--secondary"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="site-button site-button--primary"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
