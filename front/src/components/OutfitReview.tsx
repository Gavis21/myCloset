import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { IComment } from "../services/posts-service.ts";
import theme from "../theme.ts";

const OutfitReview = ({ comment }: { comment: IComment }) => {
  return (
    <Card
      sx={{ display: "flex" }}
      style={{
        width: "100%",
        borderColor: theme.palette.primary.main,
        borderWidth: "3px",
        borderStyle: "solid",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              bgcolor: "background.paper",
            }}
          >
            <Typography component="div" variant="h5">
              {comment.username}'s Review
            </Typography>
          </Box>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
            align="left"
          >
            {comment.text}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default OutfitReview;
