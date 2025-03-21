import { createTheme, ThemeProvider } from "@mui/material/styles";
import baseTheme from "../../theme.ts";
import OutfitCard from "../../components/Posts/PostOutfitCard.tsx";
import NewPostModal from "../../components/Posts/NewPostModal";
import { useState, useEffect } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { fetchPostsByUser, IPost } from "../../services/posts-service";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ClosetPageTheme = createTheme({
  ...baseTheme,
});

async function getPostByUser(username: String): Promise<IPost[]> {
  const response = await fetchPostsByUser(username);
  return response;
}

interface iProps {
  username: string | null;
}

const ClosetPage: React.FC<iProps> = ({ username }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [openAddModal, setOpenAddModal] = useState(false);

  const handleOpenAddModal = () => setOpenAddModal(true);

  const handleCloseAddModal = () => setOpenAddModal(false);

  useEffect(() => {
    if (username) {
      getPostByUser(username).then((posts: IPost[]) => {
        setPosts(posts);
      });
    }
  }, [username]);

  return (
    <ThemeProvider theme={ClosetPageTheme}>
      {posts.length ? (
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          spacing={2}
          style={{ flexDirection: "column" }}
        >
          {posts.map((post, index) => (
            <Grid item xs={10} sm={10} md={10} lg={10} key={index} width="100%">
              <OutfitCard post={post} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="subtitle1" color="text.secondary" component="div">
          {" "}
          There aren't posts yet...
        </Typography>
      )}
      {localStorage.getItem("userName") == username && (
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <Button
            onClick={handleOpenAddModal}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            New post
          </Button>
          <NewPostModal
            open={openAddModal}
            handleClose={handleCloseAddModal}
            isNew={true}
          />
        </div>
      )}
    </ThemeProvider>
  );
};

export default ClosetPage