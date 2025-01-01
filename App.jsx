import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch reviews from backend
    axios.get('http://localhost:5002/scrape-reviews')
      .then(response => {
        console.log(response.data); // Check the full response in the console
        setReviews(response.data.reviews); // Assuming the response has a 'reviews' array
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div>
      <h1>Product Reviews</h1>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review, index) => (
            <li key={index}>
              <p><strong>Review:</strong> {review.text}</p>
              <p><strong>Sentiment Score:</strong> {review.sentimentScore}</p>
              <p><strong>Sentiment Comparative:</strong> {review.sentimentComparative}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading reviews...</p>
      )}
    </div>
  );
};

export default App;
