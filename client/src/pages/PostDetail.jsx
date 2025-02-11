import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ORIGIN_URL } from '../config';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPostAndReviews = async () => {
      setLoading(true);
      try {
        const postResponse = await axios.get(
          `${ORIGIN_URL}/api/v1/posts/${id}`,
          {
            withCredentials: true,
          }
        );
        const reviewsResponse = await axios.get(
          `${ORIGIN_URL}/api/v1/reviews/post/${id}`,
          {
            withCredentials: true,
          }
        );
        setPost(postResponse.data);
        setReviews(reviewsResponse.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to retrieve post');
      }
      setLoading(false);
    };

    fetchPostAndReviews();
  }, [id]);

  const handleAddReview = async () => {
    if (!newReviewText.trim()) return;

    try {
      const response = await axios.post(
        `${ORIGIN_URL}/api/v1/reviews/post/${id}`,
        { text: newReviewText },
        { withCredentials: true }
      );
      setReviews([...reviews, response.data]);
      setNewReviewText('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add review');
    }
  };

  const handleUpdateReview = async (reviewId, updatedText) => {
    try {
      const response = await axios.put(
        `${ORIGIN_URL}/api/v1/reviews/${reviewId}`,
        { text: updatedText },
        { withCredentials: true }
      );
      setReviews(
        reviews.map((review) =>
          review._id === reviewId ? response.data : review
        )
      );
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`${ORIGIN_URL}/api/v1/reviews/${reviewId}`, {
        withCredentials: true,
      });
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete review');
    }
  };

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
            Posted by: {post?.user?.name} ({post?.user?.email})
          </p>
          <p className="text-sm text-gray-500">
            Created at: {new Date(post.createdAt).toLocaleString()}
          </p>

          <hr className="my-4" />

          <h3 className="mb-2 text-xl font-semibold">Reviews</h3>
          <ul className="mb-4 space-y-3">
            {reviews?.map((review) => (
              <li key={review._id} className="p-3 bg-gray-100 rounded-lg">
                <p className="mb-1 text-gray-800">{review.text}</p>
                <p className="text-sm text-gray-500">
                  {review.user
                    ? `${review.user.name} - ${new Date(
                        review.createdAt
                      ).toLocaleString()}`
                    : 'Unknown User'}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      const updatedText = prompt(
                        'Update your review:',
                        review.text
                      );
                      if (updatedText)
                        handleUpdateReview(review._id, updatedText);
                    }}
                    className="px-3 py-1 text-white bg-blue-500 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="px-3 py-1 text-white bg-red-500 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* {!hasUserReviewed && ()} */}
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Add a Review</h3>
            <textarea
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              className="w-full p-2 mt-2 border rounded"
              rows="3"
              placeholder="Write your review..."
            ></textarea>
            <button
              onClick={handleAddReview}
              className="px-4 py-2 mt-2 text-white bg-green-500 rounded"
            >
              Submit
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">Post not found.</p>
      )}
    </div>
  );
};

export default PostDetail;
