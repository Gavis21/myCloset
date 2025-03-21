import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import baseTheme from "../../theme.ts";
import theme from "../../theme.ts";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { uploadPhoto } from "../../services/file-service.ts";
import {
  createPost,
  IPost,
  updatePostById,
  deletePostById,
} from "../../services/posts-service.ts";
import { useNavigate } from "react-router-dom";

const ClosetPageTheme = createTheme({
  ...baseTheme,
});

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const NewPostModal = ({ open, handleClose, isNew, post }: any) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    outfitName: "",
    description: "",
    imageUrl: null,
  });
  const imgPreviewUrl = (url: string, imgOnServer: boolean) =>
    imgOnServer
      ? url
      : URL.createObjectURL(new Blob([url], { type: "plain/text" }));

  useEffect(() => {
    setIsImgOnServer(false);
    if (!isNew) {
      setIsImgOnServer(true);
      setFormData({
        outfitName: post?.outfitName,
        description: post?.description,
        imageUrl: post?.imageUrl,
      });
    }
  }, [post, isNew]);

  const [isImgOnServer, setIsImgOnServer] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsImgOnServer(false);
      setFormData((prevData) => ({
        ...prevData,
        imageUrl: e.target.files![0],
      }));
    }
  };
  const selectImg = () => {
    console.log("Selecting image...");
    fileInputRef.current?.click();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (
      data.get("outfitName")?.toString() &&
      data.get("description")?.toString()
    ) {
      isNew ? handleCreateSubmit(data) : handleEditSubmit(data);
    }
  };

  const handleCreateSubmit = async (data: FormData) => {
    const url = await uploadPhoto(formData.imageUrl!);
    console.log("upload returned:" + url);
    const post: IPost = {
      username: localStorage.getItem("userName")!,
      outfitName: data.get("outfitName")?.toString(),
      imageUrl: url,
      description: data.get("description")?.toString(),
      comments: [],
    };

    await createPost(post);
    navigate(0);
  };

  const handleEditSubmit = async (data: FormData) => {
    const url = isImgOnServer
      ? post.imageUrl
      : await uploadPhoto(formData.imageUrl!);
    const newPost: IPost = {
      ...post,
      username: localStorage.getItem("userName")!,
      outfitName: data.get("outfitName")?.toString(),
      imageUrl: url,
      description: data.get("description")?.toString(),
    };

    await updatePostById(newPost._id!, newPost);
    navigate(0);
  };

  const deletePost = async () => {
    await deletePostById(post._id);
    navigate(0);
  };
  return (
    <ThemeProvider theme={ClosetPageTheme}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
          <Box
            sx={style}
            style={{
              borderColor: theme.palette.primary.main,
              borderWidth: "3px",
              borderStyle: "solid",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography component="div" variant="h5" align="left">
                {isNew ? "New" : "Edit"} Outfit Post
              </Typography>

              <TextField
                name="outfitName"
                variant="standard"
                required
                color="secondary"
                id="outfitName"
                label="Outfit name"
                value={formData.outfitName}
                onChange={handleChange}
              />
              <TextField
                name="description"
                variant="standard"
                required
                color="secondary"
                id="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              {formData.imageUrl && (
                <img
                  src={imgPreviewUrl(formData.imageUrl, isImgOnServer)}
                  onClick={selectImg}
                  style={{ height: "150px", width: "150px" }}
                  className="img-fluid"
                />
              )}
              <input
                style={{ display: "none" }}
                ref={fileInputRef}
                type="file"
                onChange={imgSelected}
              ></input>
              {!formData.imageUrl && (
                <Button type="button" onClick={selectImg}>
                  select image
                </Button>
              )}
            </Box>
            <Button style={{ marginTop: "20px" }} type="submit">
              Post
            </Button>
            {!isNew && (
              <Button
                style={{ marginTop: "20px" }}
                onClick={deletePost}
                color="error"
              >
                Delete post
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default NewPostModal;