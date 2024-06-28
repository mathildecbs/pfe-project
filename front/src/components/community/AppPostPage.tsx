import { Post } from "../../types/PostType";
import postService from "../../services/PostService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppPost from "./AppPost";
import AppCommentWritingSection from "./AppCommentWritingSection";
import { useAuth } from "../../contexts/AuthProvider";
import styles from "../../css/AppPostPage.module.css";
import ToastUtils from "../../utils/ToastUtils";

export default function AppPostPage() {
  const [selectedPost, setSelectedPost] = useState<Post>();
  const { authToken } = useAuth();
  const { idPost } = useParams();

  useEffect(() => {
    fetchPost();
  }, [idPost]);

  async function fetchPost() {
    try {
      if (idPost && authToken) {
        const response = await postService.getOnePost(idPost, authToken);
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
    <div className={styles.PostPageContainer}>
      {selectedPost && (
        <>
          <AppPost
            key={selectedPost.id}
            post={selectedPost}
            repost={false}
          />
          <div>
            <AppCommentWritingSection
              post={selectedPost}
              addNewComment={addNewComment}
            />
            {selectedPost.nb_comments ? <h2>Commentaires</h2> : ""}
          </div>
          {selectedPost.children.map((postComment) => (
            <AppPost
              key={postComment.id}
              post={postComment}
              repost={false}
            />
          ))}
        </>
      )}
    </div>
  );
}
