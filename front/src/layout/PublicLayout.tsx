import React, { PropsWithChildren, useContext } from "react";
import { Navigate, Route, Routes, To, useLocation } from "react-router-dom";
import AuthContext from "../auth/AuthContext.tsx";
import ClosetPage from "../pages/closet-page/ClosetPage.tsx";
import EditProfile from "../pages/edit-profile-page/EditProfile.tsx";
import ExplorePage from "../pages/explore-page/ExplorePage";
import OutfitPage from "../pages/outfit-page/OutfitPage.tsx";
import SignIn from "../pages/sign-in/SignIn.tsx";
import SignUp from "../pages/sign-up/SignUp.tsx";
import SearchAppBar from "./Appbar/Appbar";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

interface iRequireAuthProps extends PropsWithChildren {
  isAuthenticated?: boolean
  redirectTo: To
}

const RequireAuth: React.FC<iRequireAuthProps> = ({ isAuthenticated, children, redirectTo }) => {
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

export default function PublicLayout() {
  let query = useQuery();
  const { user } = useContext(AuthContext);

  return (
    <>
      {Object.keys(user).length > 0 && <SearchAppBar />}

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
            path="/explorePage"
            element={
              <RequireAuth
                redirectTo="/signIn"
                isAuthenticated={Object.keys(user).length > 0}
              >
                <ExplorePage />
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

          <Route
            path="/"
            element={
              <RequireAuth
                redirectTo="/signIn"
                isAuthenticated={Object.keys(user).length > 0}
              >
                <ExplorePage />
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
