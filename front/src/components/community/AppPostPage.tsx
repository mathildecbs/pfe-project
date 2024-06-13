import { Post } from "../../types/PostType";
import postService from "../../services/PostService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppPost from "./AppPost";
import AppCommentWritingSection from "./AppCommentWritingSection";
import { useAuth } from "../../contexts/AuthProvider";
import ToastUtils from "../../utils/ToastUtils";

export default function AppPostPage() {
  const [selectedPost, setSelectedPost] = useState<Post>();
  const { user } = useAuth();
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
      ToastUtils.error(error, "Erreur lors de la récupération du post");
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
          <AppPost key={selectedPost.id} post={selectedPost} repost={selectedPost.user.username !== user?.username}/>
          <div>
            <AppCommentWritingSection post={selectedPost} addNewComment={addNewComment} />
            <h2>Commentaires</h2>
          </div>
          {selectedPost.children.map((postComment) => (
            <AppPost key={postComment.id} post={postComment} repost={selectedPost.user.username !== user?.username}/>
          ))}
        </>
      )}
    </>
  );
}
