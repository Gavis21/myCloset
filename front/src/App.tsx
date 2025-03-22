import "./App.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import baseTheme from "./theme.ts";
import PublicLayout from "./layout/PublicLayout.tsx";
import AuthContext from "./auth/AuthContext.tsx";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App() {
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("accessToken")
  );

  useEffect(() => {
    console.log("Updated default token");
  }, [currentUser]);

  return (
    <>
      <ThemeProvider theme={baseTheme}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_KEY}>
          <AuthContext.Provider
            value={{ user: currentUser, setUser: setCurrentUser }}
          >
            <PublicLayout />
          </AuthContext.Provider>

          <CssBaseline />

          <Outlet />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </>
  );
}
