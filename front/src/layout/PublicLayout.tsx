import React, { useContext } from "react";
import { Navigate, Routes, useLocation } from "react-router-dom";
import AuthContext from "../auth/AuthContext.tsx";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}
function RequireAuth({ isAuthenticated, children, redirectTo }) {
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

export default function PublicLayout() {
  let query = useQuery();
  const { user, setUser } = useContext(AuthContext);

  //TODO: GUY
  return (
    <>
      {/* <SearchAppBar /> */}
      <div
        style={{
          marginTop: "64px" /* Adjust the value based on your navbar height */,
        }}
      >
        <Routes>
          
        </Routes>
      </div>
    </>
  );
}
