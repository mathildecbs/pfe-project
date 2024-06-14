import { createContext, useContext, useState, ReactNode } from "react";
import { Post } from "../types/PostType";
import { Tag } from "../types/TagType";

interface PostsContextType {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  followingPosts: Post[];
  setFollowingPosts: (posts: Post[]) => void;
  trendingPosts: Post[];
  setTrendingPosts: (posts: Post[]) => void;
  trendingTags: Tag[];
  setTrendingTags: (tags: Tag[]) => void; 
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
}

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [followingPosts, setFollowingPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [trendingTags, setTrendingTags] = useState<Tag[]>([]);

  function addPost(post: Post) {
    setPosts([post, ...posts]);
  }

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
        addPost,
        followingPosts,
        setFollowingPosts,
        trendingPosts,
        setTrendingPosts,
        trendingTags,
        setTrendingTags,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}
