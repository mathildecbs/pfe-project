import { Post } from "../types/PostType";
import postService from "../services/PostService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppPost from "./AppPost";
import AppCommentWritingSection from "./AppCommentWritingSection";

export default function AppPostPage() {
  const [selectedPost, setSelectedPost] = useState<Post>();
  const { idPost } = useParams();

  useEffect(() => {
    fetchPost();
  }, [idPost]);

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

  function addNewComment(newComment: Post) {
    if (selectedPost) {
      setSelectedPost({
        ...selectedPost,
        children: [newComment, ...selectedPost.children],
      });
    }
  }

  return (
    <>
      {selectedPost && (
        <>
          <AppPost key={selectedPost.id} post={selectedPost}></AppPost>
          <div>
            <AppCommentWritingSection post={selectedPost} addNewComment={addNewComment} />
            <h2>Commentaires</h2>
          </div>
          {selectedPost.children.map((postComment) => (
            <AppPost key={postComment.id} post={postComment} />
          ))}
        </>
      )}
    </>
  );
}
