import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../config/axios'; // ← adjust to where you keep your axios setup
import styled from 'styled-components';
import './RestaurantDetails.css';

// styled‐components for the booking button
const FlexContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const BookButton = styled(Link)`
  background-color: #ef7d70;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
  &:hover {
    background-color: #db6659;
  }
`;

// defaults if the restaurant has no tags of its own
const defaultTags = [
  'Serves alcohol',
  'Valet parking available',
  'Smoking allowed',
  'Outdoor seating',
  'Brunch',
  'Dinner',
  'Smart Casual',
  'Credit Cards',
  'Cash',
];

export default function RestaurantDetails() {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axiosInstance
      .get(`/restaurants/${restaurantId}`)
      .then((res) => setRestaurant(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load restaurant details.');
      });
  }, [restaurantId]);

  if (error) return <div className="error">{error}</div>;
  if (!restaurant) return <div>Loading…</div>;

  // pick up to 3 images (falling back to placeholder if needed)
  const imgs =
    restaurant.images && restaurant.images.length > 0
      ? restaurant.images
      : ['/placeholder1.jpg', '/placeholder2.jpg', '/placeholder3.jpg'];
  const [mainImg, ...others] = imgs;

  // use restaurant.tags if present, otherwise our defaults
  const tags =
    restaurant.tags && restaurant.tags.length > 0
      ? restaurant.tags
      : defaultTags;

  return (
    <div className="restaurant-details">
      {/* 1) Top image gallery */}
      <div className="image-gallery">
        <div className="main-image">
          <img src={mainImg} alt={restaurant.name} />
        </div>
        <div className="sub-images">
          {others.slice(0, 2).map((src, i) => (
            <div key={i} className="sub-image">
              <img src={src} alt={`${restaurant.name} ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* 2) Thumbnail + name/address/etc + BOOK button */}
      <div className="info-booking">
        <div className="info">
          <img
            className="thumbnail"
            src={restaurant.thumbnail || mainImg}
            alt={restaurant.name + ' logo'}
          />
          <div className="text">
            <h1>{restaurant.name}</h1>
            <p className="address">{restaurant.address}</p>
            <p className="meta">{restaurant.cuisineType} • $$</p>
          </div>
        </div>
        <FlexContainer>
          <BookButton to={`/restaurant/${restaurantId}`}>
            BOOK A TABLE
          </BookButton>
        </FlexContainer>
      </div>

      {/* 3) Description */}
      <div className="description-section">
        <h2>Description</h2>
        <p>{restaurant.description}</p>
      </div>

      {/* 4) Tags */}
      <div className="tags-section">
        {tags.map((t, i) => (
          <span key={i} className="tag">
            {t}
          </span>
        ))}
      </div>

      {/* 5) Map */}
      {restaurant.location?.latitude && restaurant.location?.longitude && (
        <div className="map-section">
          <iframe
            title="restaurant-map"
            src={`https://www.google.com/maps?q=${restaurant.location.latitude},${restaurant.location.longitude}&z=15&output=embed`}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
