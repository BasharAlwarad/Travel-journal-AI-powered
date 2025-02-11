import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/posts/${id}`,
          {
            withCredentials: true,
          }
        );
        setPost(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to retrieve post');
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) return <p>Loading post details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-lg">
      {post ? (
        <>
          <h2 className="mb-4 text-3xl font-semibold">{post.text}</h2>
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="object-cover w-full h-64 mb-4 rounded-lg"
            />
          )}
          <p className="mb-4 text-gray-700">{post.text}</p>
          <p className="text-sm text-gray-500">
            Posted by: {post.user.name} ({post.user.email})
          </p>
          <p className="text-sm text-gray-500">
            Created at: {new Date(post.createdAt).toLocaleString()}
          </p>
        </>
      ) : (
        <p className="text-center text-gray-500">Post not found.</p>
      )}
    </div>
  );
};

export default PostDetail;
