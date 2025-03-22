import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Avatar, Card } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ChangeEvent, useRef, useState } from "react";
import LoadingOverlay from "react-loading-overlay-ts";
import { useNavigate } from "react-router-dom";
import { uploadPhoto } from "../../services/file-service.ts";
import { IUser, register } from "../../services/user-service.ts";
import baseTheme from "../../theme.ts";
import "./SignUp.css";

const SignUpTheme = createTheme({
  ...baseTheme,
});

const getInitials = (first: string, last: string) =>
  `${first.charAt(0).toUpperCase()}${last.charAt(0).toUpperCase()}`;

export default function SignUp() {
  let navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [startedRegister, setStartedRegister] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [isLoadingActive, setIsLoadingActive] = useState(false);
  const [imageUrl, setImageUrl] = useState<File>();

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartedRegister(true);
    setFirstNameInput(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartedRegister(true);
    setLastNameInput(event.target.value);
  };

  const handleUsernamechange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartedRegister(true);
    setUsernameInput(event.target.value);
  };

  const handleEmailchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartedRegister(true);
    setEmailInput(event.target.value);
  };

  const handlePasswordchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartedRegister(true);
    setPasswordInput(event.target.value);
  };

  const handleConfirmPasswordchange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartedRegister(true);
    setConfirmPasswordInput(event.target.value);
  };

  const selectImg = () => {
    console.log("Selecting image...");
    fileInputRef.current?.click();
  };

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    if (e.target.files && e.target.files.length > 0) {
      setImageUrl(e.target.files![0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoadingActive(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (
      data.get("email") &&
      data.get("password") &&
      data.get("firstname") &&
      data.get("lastname") &&
      imageUrl
    ) {
      const url = await uploadPhoto(imageUrl!);
      const newUser: IUser = {
        email: data.get("email")?.toString(),
        password: data.get("password")?.toString(),
        username: data.get("username")?.toString(),
        firstName: data.get("firstname")?.toString(),
        lastName: data.get("lastname")?.toString(),
        imageUrl: url,
      };
      register(newUser)
        .then(() => {
          navigate("/signIn");
        })
        .finally(() => {
          setIsLoadingActive(false);
        });
    }

    setIsLoadingActive(false);
  };

  const handleSignin = () => {
    navigate("/signIn");
  };

  return (
    <ThemeProvider theme={SignUpTheme}>
      <div className="signupcard">
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          style={{ height: "100vh" }}
        >
          <LoadingOverlay active={isLoadingActive} spinner text="Signing up...">
            <Card className="mainCard" variant="outlined">
              <Container component="main" maxWidth="xs">
                <Box
                  sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar>{getInitials(firstNameInput, lastNameInput)}</Avatar>
                  <Typography component="h1" variant="h5">
                    Sign up
                  </Typography>
                  <Box
                    component="form"
                    noValidate
                    sx={{ mt: 3 }}
                    onSubmit={handleSubmit}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          autoComplete="given-name"
                          name="firstname"
                          required
                          fullWidth
                          color="secondary"
                          id="firstname"
                          label="First Name"
                          autoFocus
                          onChange={handleFirstNameChange}
                          error={startedRegister && firstNameInput.length < 3}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          color="secondary"
                          id="lastname"
                          label="Last Name"
                          name="lastname"
                          autoComplete="family-name"
                          onChange={handleLastNameChange}
                          error={startedRegister && lastNameInput.length < 3}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          color="secondary"
                          id="username"
                          label="User Name"
                          name="username"
                          autoComplete="family-name"
                          onChange={handleUsernamechange}
                          error={startedRegister && usernameInput.length < 3}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          color="secondary"
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          onChange={handleEmailchange}
                          error={startedRegister && emailInput.length < 3}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          color="secondary"
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          autoComplete="new-password"
                          onChange={handlePasswordchange}
                          error={startedRegister && passwordInput.length < 3}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          color="secondary"
                          name="confirmpassword"
                          label="Confirm Password"
                          type="password"
                          id="confirmpassword"
                          onChange={handleConfirmPasswordchange}
                          error={
                            passwordInput !== confirmPasswordInput ||
                            confirmPasswordInput.length < 3
                          }
                        />
                      </Grid>
                    </Grid>
                    <Button
                      color="primary"
                      className="addPhotoBtn"
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 1, mb: 0 }}
                      startIcon={<CameraAltIcon />}
                      onClick={selectImg}
                    >
                      {imageUrl?.name
                        ? `${imageUrl?.name} is selected!`
                        : "Add profile photo"}
                    </Button>
                    <input
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      type="file"
                      onChange={imgSelected}
                    ></input>
                    <Button
                      color="primary"
                      className="signupBtn"
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2 }}
                    >
                      Sign Up
                    </Button>
                    <Button
                      onClick={handleSignin}
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 2, mb: 1 }}
                    >
                      Already have an account? Sign in
                    </Button>
                  </Box>
                </Box>
              </Container>
            </Card>
          </LoadingOverlay>
        </Grid>
      </div>
    </ThemeProvider>
  );
}
