import { Paper, Typography } from "@mui/material";
import AppPost from "./AppPost";

export default function AppHome() {
  return (
    <>
      <Paper>
        <Typography variant="h4">New Albums</Typography>
      </Paper>
      <Paper>
        <Typography variant="h4">Posts</Typography>
        <AppPost></AppPost>
      </Paper>
    </>
  );
}
