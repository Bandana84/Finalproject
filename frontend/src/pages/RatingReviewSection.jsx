import { useEffect, useState } from "react";
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

const RatingReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const { user, setUser } = useAppContext();

  // Format the review date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  console.log('Product ID:', productId);
  console.log('User:', user);

  useEffect(() => {
    if (!user || !user.tokens?.access) {
      alert("Please log in to view or submit reviews.");
      return;
    }

    console.log('Fetching reviews for product:', productId);
    axios.get(`http://localhost:8000/api/products/${productId}/reviews/`, {
      headers: {
        'Authorization': `Bearer ${user.tokens.access}`
      }
    })
    .catch(error => {
      if (error.response?.status === 401) {
        // Token is invalid, clear user data and show login
        localStorage.removeItem('user');
        localStorage.removeItem('tokens');
        setUser(null);
        alert("Your session has expired. Please log in again.");
        return;
      }
      throw error;
    })
    .then(response => {
      setReviews(response.data);
    })
    .catch(error => {
      console.error('Error fetching reviews:', error);
      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert("Failed to load reviews. Please try again later.");
      }
    });
  }, [productId, user, setUser]);

  const handleSubmit = async () => {
    if (!user || !user.tokens?.access) {
      alert("Please log in to submit a review.");
      return;
    }

    if (!rating || !text.trim()) return alert("Please provide rating and review text.");

    try {
      console.log('Submitting review for product:', productId);
      const response = await axios.post(`http://localhost:8000/api/products/${productId}/reviews/`, {
        rating,
        text,
        user: user.id
      }, {
        headers: {
          'Authorization': `Bearer ${user.tokens.access}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        const newReview = response.data;
        // Ensure we have the user object in the response
        if (!newReview.user) {
          newReview.user = { username: user.username };
        }
        setReviews([newReview, ...reviews]);
        setRating(0);
        setText("");
        alert("Review submitted successfully!");
      } else if (response.status === 400) {
        const error = response.data; // No need for await since we already have the response
        if (error.detail) {
          alert(error.detail);
        } else if (error.non_field_errors) {
          alert(error.non_field_errors[0]);
        } else {
          alert("Failed to submit review. Please try again.");
        }
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Token is invalid, clear user data and show login
        localStorage.removeItem('user');
        localStorage.removeItem('tokens');
        setUser(null);
        alert("Your session has expired. Please log in again.");
        return;
      }
      console.error('Error submitting review:', error);
      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else if (error.response?.data?.non_field_errors) {
        alert(error.response.data.non_field_errors[0]);
      } else {
        alert("Failed to submit review. Please try again.");
      }
    }
  };

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

  return (
    <div className="mt-20 w-full max-w-3xl mx-auto bg-white p-6 shadow-md rounded-2xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Customer Reviews
      </h2>

      {/* Average rating */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex gap-0.5 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i < avgRating ? "fill-current" : "stroke-current"
              }`}
              fill={i < avgRating ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {avgRating.toFixed(1)} ({reviews.length} reviews)
        </span>
      </div>

      {/* Review form */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Write a Review</h3>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700">Reviewing as:</span>
            <span className="text-sm font-semibold text-gray-900">{user?.username || 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className={`w-6 h-6 cursor-pointer transition ${
                  (hoverRating || rating) >= star
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.075 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
              </svg>
            ))}
          </div>
          <textarea
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-primary resize-none"
            rows={4}
            placeholder="Write your review here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <button
            onClick={handleSubmit}
            className="mt-3 bg-primary text-white font-medium px-5 py-2 rounded-md hover:bg-primary/90 transition"
          >
            Submit Review
          </button>
        </div>
      </div>

      {/* Existing reviews */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 p-4 rounded-lg bg-gray-50"
            >
              <div className="flex items-center gap-1 text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "fill-current" : "stroke-current"
                    }`}
                    fill={i < review.rating ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
                  </svg>
                ))}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{review.user?.username || 'Anonymous'}</span>
                  <span className="text-xs text-gray-500">{formatDate(review.created_at)}</span>
                </div>
                <p className="text-sm text-gray-700">{review.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RatingReviewSection;
