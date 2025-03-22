import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { getAllUsers } from "../services/user-service";
import { useNavigate } from "react-router-dom";

const SearchCloset = () => {
  const [usernames, setUserNames] = useState<String[]>([]);

  useEffect(() => {
    const { req, abort } = getAllUsers();
    req
      .then((res) => {
        if (res?.data) setUserNames(res.data.map((u) => u.username!));
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      abort();
    };
  }, []);

  let navigate = useNavigate();
  const routeChange = (path: string) => navigate(path);

  const routeUserCloset = (username: string) =>
    routeChange(`/closetPage?username=${username}`);

  const handleOptionSelected = (_event: React.SyntheticEvent<Element, Event>, value: String | null) => {
    if (value) {
      routeUserCloset(value.toString());
    }
  };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={usernames}
      sx={{ width: 300 }}
      onChange={handleOptionSelected}
      renderInput={(params) => (
        <TextField {...params} label="Search closets..." />
      )}
    />
  );
};

export default SearchCloset;
