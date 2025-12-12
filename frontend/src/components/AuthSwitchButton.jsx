import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

export default function AuthSwitchButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { user, setUser } = useContext(UserContext);

  const isLoginPage = path === "/login";
  const isSignupPage = path === "/";

  // hide button on all other routes
  if (!isLoginPage && !isSignupPage && !user) {
    return null;
  }

  if (user) {
    return (
      <button
        className="login-button"
        onClick={() => {
          axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true })
            .then(() => {
              setUser(null)
              navigate("/login")
            });
        }}
      >
        Log Out
      </button>
    );
  }

  return (
    <Link to={isLoginPage ? "/" : "/login"}>
      <button className="login-button">
        {isLoginPage ? "Sign Up" : "Log In"}
      </button>
    </Link>
  );
}
