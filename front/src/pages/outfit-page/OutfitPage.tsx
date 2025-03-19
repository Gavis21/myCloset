import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OutfitReview from '../../components/OutfitReview.tsx';
import OutfitCard from '../../components/Posts/PostOutfitCard.tsx';
import { fetchPostsById, IComment, IPost, updatePostById } from '../../services/posts-service.ts';
import baseTheme from '../../theme.ts';

const OutfitPageTheme = createTheme({
  ...baseTheme,
});

const newCommentStyle = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px', // Space between elements
    padding: '16px', // Padding for the card content
  },
  textField: {
    width: '100%', // TextField takes full width
  },
  button: {
    // alignSelf: 'flex-end', // Button is aligned to the end of the card
  },
});

async function getPostById(_id: String): Promise<IPost> {
  const response = await fetchPostsById(_id);
  return response;
}

export default function OutfitPage({postId}) {
  const [post, setPost] = useState<IPost>({});
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getPostById(postId).then((p: IPost) => {
      setPost(p);
    });

    console.log(post)
  }, [postId]);

  const handleAddComment = () => {
    if (inputValue.trim() !== '') {
      const username = localStorage.getItem('userName')!;

      const newComment: IComment = {
        username,
        text: inputValue
      }
      
      const newPost: IPost = {
        ...post,
         comments: post.comments ? [...post.comments, newComment] : [newComment]
        }
      updatePostById(postId, newPost).then(() => {
        navigate(0);

      });
      
      setInputValue('');
    }
  };
  const classes = newCommentStyle();

  return (
    <ThemeProvider theme={OutfitPageTheme}>       
      <Grid container alignItems="center" justifyContent="center"  spacing={2} style={{ flexDirection: 'column' }}>
          <Grid item xs={8} sm={8} md={8} lg={8} width="100%">
          <OutfitCard 
              post={post}
            />
          </Grid>
          {post.comments?.map((comment) => (
            <Grid item xs={8} sm={8} md={8} lg={8} width="100%">
            <OutfitReview 
              comment={comment}
            />
          </Grid>
          ))}

          <Grid item xs={8} sm={8} md={8} lg={8}  width="100%">
          <Card sx={{ display: 'flex'}} style={{ width: '100%', borderColor: baseTheme.palette.primary.main, borderWidth: '3px', borderStyle: 'solid' }}>
           {/* <Box sx={{ display: 'flex', flexDirection: 'column' , flexWrap: 'wrap' }}> */}
            <TextField
              label="Add new comment"
              variant="outlined"
              value={inputValue}
              className={classes.textField}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ margin: '10px' }}
            />   
          <IconButton aria-label="add" size="large"  color="primary"  onClick={handleAddComment} className={classes.button}  style={{ margin: '10px' }}>
        <AddIcon fontSize="inherit" />
      </IconButton>
            
          {/* </Box> */}
      
          </Card>
          </Grid>
      </Grid>
    </ThemeProvider>
  );
}