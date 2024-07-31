import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Post() {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { postId } = useParams();
  const [newComment, setNewComment] = useState({ username: "", content: "" });
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment(prev => ({ ...prev, [name]: value }));
  };

   //TODO: Figure out why this fails
  const handleAddComment = async () => {
    const authorName = newComment.username;
    const content = newComment.content;
    console.log(authorName, content)
    if (content) {
      try {
        const headers = new Headers({
          "Content-Type": "application/json",
        });
        console.log("posting....")
        console.log(`${import.meta.env.VITE_API_ENDPOINT}/${postId}/comments`)

        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/${postId}/comments`,
          {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ authorName, content }),
          }
        );

        setIsCommentFormVisible(false);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        // Refresh the comments
        fetchPosts();
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };
  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/${postId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("response came!");
      const data = await response.json();
      setPost(data.post);
      setComments(data.comments);
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
      <h1>Title: {post.title}</h1>
      <h2>Modified Date: {new Date(post.updatedAt).toLocaleDateString()}</h2>
      <p>Content:</p>
      <p>{post.content}</p>
      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.content} - {comment.authorName}
          </li>
        ))}
      </ul>
      {!isCommentFormVisible && (
        <button onClick={() => setIsCommentFormVisible(true)}>
          Add Comment
        </button>
      )}
      {isCommentFormVisible && (
        <form onSubmit={handleAddComment}>
          <input
            type="text"
            name="username"
            defaultValue={""}
            onChange={handleInputChange}
            placeholder="Your username"
          />
          <textarea
            name="content"
            defaultValue={""}
            onChange={handleInputChange}
            placeholder="Your comment"
            required
          />
          <button type="submit">Submit Comment</button>
          <button type="button" onClick={() => setIsCommentFormVisible(false)}>
            Cancel
          </button>
        </form>
      )}{" "}
    </div>
  );
}

export default Post;
