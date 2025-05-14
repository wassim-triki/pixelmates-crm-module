import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import styled from 'styled-components';
import './RestaurantDetails.css';
import { useModal } from '../../context/modalContext';
import BookingForm from './BookingForm';
import { useAuth } from '../../context/authContext';

// Styled-components for the booking button and background
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

// Styled-component for the container with background
const RestaurantDetailsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(0, 0, 0, 0.7) 100%
    ),
    url('/Backg_Login.png') center/cover fixed; /* Replace with '/van-gogh-bg.jpg' if available */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 1rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 0;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1200px;
`;

// Defaults if the restaurant has no tags of its own
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
  const navigate = useNavigate();
  const { user } = useAuth();

  const { openModal } = useModal();

  const handleBookATable = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    openModal(
      <BookingForm restaurant={restaurant} />,
      `Book - “${restaurant.name}”`
    );
  };

  useEffect(() => {
    axiosInstance
      .get(`/restaurants/${restaurantId}`)
      .then((res) => setRestaurant(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load restaurant details.');
      });
  }, [restaurantId]);

  if (error)
    return <div className="error">Failed to load restaurant details.</div>;
  if (!restaurant) return <div>Loading…</div>;

  // Pick up to 3 images (falling back to placeholder if needed)
  const imgs =
    restaurant.images && restaurant.images.length > 0
      ? restaurant.images
      : ['/placeholder1.jpg', '/placeholder2.jpg', '/placeholder3.jpg'];
  const [mainImg, ...others] = imgs;

  // Use restaurant.tags if present, otherwise our defaults
  const tags =
    restaurant.tags && restaurant.tags.length > 0
      ? restaurant.tags
      : defaultTags;

  return (
    <RestaurantDetailsContainer>
      <BackgroundOverlay />
      <ContentWrapper className="restaurant-details">
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
              <p className="meta">{restaurant.cuisineType}</p>
            </div>
          </div>
          <FlexContainer>
            <BookButton type="button" onClick={handleBookATable}>
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
      </ContentWrapper>
    </RestaurantDetailsContainer>
  );
}
