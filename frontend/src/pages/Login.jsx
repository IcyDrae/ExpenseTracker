import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../components/UserContext";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  function logIn(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const firstName = formData.get("first_name");
    const lastName = formData.get("last_name");
    const password = formData.get("password");

    if (firstName == "") {
      alert("First Name is required");
      return;
    }

    if (lastName == "") {
      alert("Last Name is required");
      return;
    }

    if (password == "") {
      alert("Password is required");
      return;
    }

    axios
      .post("http://localhost:3000/api/auth/login", {
        firstName: firstName,
        lastName: lastName,
        password: password,
      },
      {
        withCredentials: true
      })
      .then((response) => {
        setUser({ id: response.data.userId });
        navigate("/dashboard");
      })
      .catch((error) => {
        alert("Log in failed. Please try again." + error);
      });
  }

  return (
    <div className="login-container">
      <h1>Log In</h1>

      <form onSubmit={logIn}>
        <input name="first_name" placeholder="First Name" />
        <input name="last_name" placeholder="Last Name" />
        <input name="password" placeholder="Password" type="password" />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
