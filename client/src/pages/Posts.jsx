import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ORIGIN_URL } from '../config';
import { useAuthContext } from '../contexts/userContext';

const Posts = () => {
  const { user, setUser } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [AIImage, setAIImage] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ORIGIN_URL}/api/v1/posts`, {
        withCredentials: true,
      });
      setUser(response?.data?.user);
      setPosts(Array.isArray(response.data.posts) ? response.data.posts : []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch posts');
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    const formData = new FormData();
    formData.append('text', prompt);
    if (image) {
      formData.append('image', image);
    }
    if (AIImage) {
      formData.append('AIImage', AIImage);
    }
    try {
      const response = await axios.post(
        `${ORIGIN_URL}/api/v1/posts`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setPosts([response.data, ...posts]);
      setPrompt('');
      setImage('');
      setImagePreview(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create post');
    }
  };

  const updatePost = async (id) => {
    try {
      const response = await axios.put(
        `${ORIGIN_URL}/api/v1/posts/${id}`,
        { text: prompt, image },
        { withCredentials: true }
      );
      setPosts(posts.map((post) => (post._id === id ? response.data : post)));
      setEditingPost(null);
      setPrompt('');
      setImage('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update post');
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`${ORIGIN_URL}/api/v1/posts/${id}`, {
        withCredentials: true,
      });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleGenerateAIImage = async () => {
    try {
      const { data } = await axios.post(
        `${ORIGIN_URL}/api/v1/images/generations`,
        { prompt },
        {
          withCredentials: true,
        }
      );
      const base64Image = data[0].b64_json;
      if (base64Image) {
        const imageSrc = `data:image/png;base64,${base64Image}`;
        setImagePreview(imageSrc);
        setAIImage(imageSrc);
      } else {
        console.error('No base64 image data found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="mb-4 text-3xl font-semibold text-center">Posts</h2>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <div className="mb-6">
        <h3 className="mb-2 text-xl font-semibold">
          {editingPost ? 'Edit Post' : 'Create Post'}
        </h3>
        <input
          type="text"
          placeholder="Post text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full mb-2 input input-bordered"
        />
        <button
          type="button"
          onClick={handleImageUploadClick}
          className="w-full btn btn-secondary"
        >
          Upload Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={handleGenerateAIImage}
          className="w-full btn btn-accent mt-2"
        >
          Generate AI Image
        </button>

        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Image Preview"
              className="object-cover w-32 h-32 mx-auto rounded-full"
            />
          </div>
        )}
        <button
          onClick={editingPost ? () => updatePost(editingPost) : createPost}
          className="w-full btn btn-primary"
        >
          {editingPost ? 'Update Post' : 'Create Post'}
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : posts.length > 0 ? (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post._id} className="p-4 rounded-lg shadow-md bg-gray-50">
              <p className="text-lg font-medium">{post.text}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="object-cover w-full h-48 mt-2 rounded-lg"
                />
              )}
              <p className="mt-2 text-sm text-gray-500">
                Posted by: {post?.user?.name}
              </p>
              <div className="flex justify-between mt-4">
                <Link
                  to={`/posts/${post._id}`}
                  className="text-blue-500 hover:underline"
                >
                  Read More
                </Link>
                {user && post.user?._id === user.id && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setPrompt(post.text);
                        setImage(post.image);
                        setEditingPost(post._id);
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePost(post._id)}
                      className="btn btn-error btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No posts available.</p>
      )}
    </div>
  );
};

export default Posts;
