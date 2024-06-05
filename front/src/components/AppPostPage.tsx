import { Paper, Typography, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import RepeatIcon from "@mui/icons-material/Repeat";
import styles from "../css/AppPost.module.css";
import { Post } from "../types/PostType";
import { DateUtils } from "../utils/DateUtils";
import postService from "../services/PostService";
import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppPost from "./AppPost";

export default function AppPostPage() {
  const [selectedPost, setSelectedPost] = useState<Post>();
  const { idPost } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    fetchPost();
  }, []);

  async function fetchPost() {
    try {
      if (idPost) {
        const response = await postService.getOnePost(idPost);
        setSelectedPost(response);
      }
    } catch (error) {
      console.log("Erreur lors de la récupération du post");
    }
  }

  return (
    <>
      {selectedPost && <AppPost key={selectedPost.id} post={selectedPost}></AppPost>}
    </>
  );
}
