import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const refreshUser = () => {
    axios.get("http://localhost:3000/api/auth/me", { withCredentials: true })
      .then(res => {
        if (res.data.loggedIn) setUser({ id: res.data.userId });
        else setUser(null);
      })
      .catch(() => setUser(null));
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};
