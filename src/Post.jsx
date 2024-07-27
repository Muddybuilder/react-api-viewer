import { useState, useEffect } from "react";

function Post() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/posts");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("response came!");
      const data = await response.json();
      console.log(data);
      setPosts(data);
      setIsLoading(false);
    } catch (error) {
      setError("Error fetching posts: " + error.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Post Titles</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title} - {post.updatedAt}</li>
        ))}
      </ul>
    </div>
  );
}

export default Post;
