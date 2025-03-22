import AccountCircle from "@mui/icons-material/AccountCircle";
import CheckroomOutlinedIcon from "@mui/icons-material/CheckroomOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Button, Menu, MenuItem } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../auth/AuthContext.tsx";
import SearchCloset from "../../components/SearchCloset.tsx";
import baseTheme from "../../theme.ts";

const theme = createTheme({
  ...baseTheme,
});

export default function SearchAppBar() {
  const { setUser } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const Signout = () => {
    handleMenuClose();

    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setUser(null);
    routeSignin();
  };

  const menuId = "primary-search-account-menu";

  let navigate = useNavigate();
  const routeCloset = () =>
    routeChange(`/closetPage?username=${localStorage.getItem("userName")}`);
  const routeExplore = () => routeChange("/explorePage");
  const routeSignin = () => routeChange("/signIn");
  const routeProfile = () => routeChange("/editProfile");

  const routeChange = (path: string) => navigate(path);

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={routeProfile}>Profile</MenuItem>
      <MenuItem onClick={Signout}>Signout</MenuItem>
    </Menu>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <CheckroomOutlinedIcon sx={{ fontSize: "3vw" }} />
            <Button onClick={routeCloset} color="inherit">
              MyCloset
            </Button>
            <Button onClick={routeExplore} color="inherit">
              <SearchIcon />
              Explore
            </Button>
            <Typography
              onClick={routeCloset}
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            ></Typography>
            <SearchCloset />
            <MenuItem onClick={handleProfileMenuOpen}>
              <IconButton size="large" color="inherit">
                <AccountCircle />
              </IconButton>
            </MenuItem>
          </Toolbar>
        </AppBar>
        {renderMenu}
      </Box>
    </ThemeProvider>
  );
}
