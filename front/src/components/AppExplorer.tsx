import { Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import groupService from "../services/GroupService";
import ToastUtils from "../utils/ToastUtils";

export default function AppExplorer() {

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    try {
      const response = await groupService.getGroups();
      console.log(response);
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des groupes");
    }
  }
  return (
    <Paper>
      <Typography variant="h4">Albums</Typography>
    </Paper>
  );
}
