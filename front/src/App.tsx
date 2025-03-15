import "./App.css";
import { CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import AuthContext from "./auth/AuthContext.tsx";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App() {
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("accessToken") || {}
  );

  useEffect(() => {
    console.log("Updated default token");
    // apiClient.defaults.headers.common = {'authorization': `bearer ${localStorage.getItem('accessToken')}`};
  }, [currentUser]);

  return (
    <>
      <GoogleOAuthProvider clientId="179334466716-uvk404sbcsdvf7ptcjf3n1rqfi4sha95.apps.googleusercontent.com">
        <AuthContext.Provider
          value={{ user: currentUser, setUser: setCurrentUser }}
        ></AuthContext.Provider>

        <CssBaseline />

        <Outlet />
      </GoogleOAuthProvider>
    </>
  );
}
