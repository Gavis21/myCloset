import React, { useContext } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import ClosetPage from "../pages/closet-page/ClosetPage.tsx";
import OutfitPage from "../pages/outfit-page/OutfitPage.tsx";
import SignIn from "../pages/sign-in/SignIn.tsx";
import AuthContext from "../auth/AuthContext.tsx";
import SignUp from "../pages/sign-up/SignUp.tsx";
import EditProfile from "../pages/edit-profile-page/EditProfile.tsx";

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
          <Route
            path="/closetPage"
            element={
              <RequireAuth
                redirectTo="/signIn"
                isAuthenticated={Object.keys(user).length > 0}
              >
                <ClosetPage username={query.get("username")} />
              </RequireAuth>
            }
          />
          <Route
            path="/outfitPage"
            element={
              <RequireAuth
                redirectTo="/signIn"
                isAuthenticated={Object.keys(user).length > 0}
              >
                <OutfitPage postId={query.get("postId")} />
              </RequireAuth>
            }
          />
          <Route
            path="/editProfile"
            element={
              <RequireAuth
                redirectTo="/signIn"
                isAuthenticated={Object.keys(user).length > 0}
              >
                <EditProfile />
              </RequireAuth>
            }
          />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
        </Routes>
      </div>
    </>
  );
}
