import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

// Styles globaux
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(0, 0, 0, 0.7) 100%
    ),
    url('/bg.jpg') center/cover fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  max-width: 1280px;
  padding-top: 2.5rem;
  animation: ${fadeIn} 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Playfair Display', serif;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SearchInput = styled.div`
  position: relative;
  width: 16rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: white;
  transition: all 0.3s ease;
  height: 3rem;

  input {
    width: 100%;
    height: 100%;
    padding: 0.75rem 1rem;
    border: none;
    outline: none;
    background: transparent;
    font-size: 1rem;
    color: #333;
    border-radius: 0.75rem;
  }

  @media (min-width: 640px) {
    width: 20rem;
  }
`;

const CuisineSelect = styled.select`
  padding: 0.75rem 1rem;
  width: 10rem;
  height: 3rem; /* Ajouter une hauteur explicite identique à celle de SearchInput */
  border-radius: 0.75rem;
  border: 2px solid #fa8072;
  background: white;
  color: black;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FA8072'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.2em;

  &:hover {
    border-color: #ff6347;
  }

  @media (min-width: 640px) {
    width: 13rem;
  }
`;

const RestaurantGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  padding: 1rem 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const RestaurantCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  color: white;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
  }
`;

const RestaurantImage = styled.img`
  width: 100%;
  height: 10rem;
  object-fit: cover;
  background: white;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const BookButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #fa8072 0%, #ff6347 100%);
  color: white;
  font-weight: 600;
  border-radius: 0.75rem;
  text-align: center;
  margin-top: auto;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    background: linear-gradient(135deg, #ff6347 0%, #fa8072 100%);
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 25%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 75%
    );
    animation: ${shimmer} 4s infinite;
  }
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-weight: 500;
  min-width: 2.5rem;
  transition: all 0.3s ease;
  background: ${(props) => (props.active ? '#FA8072' : 'white')};
  color: ${(props) => (props.active ? 'white' : 'black')};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    background: #fa8072;
    color: white;
  }
`;

const Loader = styled.div`
  width: 3rem;
  height: 3rem;
  border: 4px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const InfoContainer = styled.div`
  text-align: left;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.25rem;
`;

const PromotionText = styled.p`
  font-size: 0.875rem;
  color: #fa8072;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: auto;
`;

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCuisine, setSelectedCuisine] = useState('');

  const restaurantsPerPage = 8;
  const indexOfLast = currentPage * restaurantsPerPage;
  const indexOfFirst = indexOfLast - restaurantsPerPage;
  const currentRestaurants = filteredRestaurants.slice(
    indexOfFirst,
    indexOfLast
  );
  const navigate = useNavigate();

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/restaurants'
        );
        setRestaurants(response.data.restaurants);
        setFilteredRestaurants(response.data.restaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    getRestaurants();
  }, []);

  useEffect(() => {
    const filterRestaurants = () => {
      let filtered = restaurants;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.name.toLowerCase().includes(term) ||
            r.address.toLowerCase().includes(term)
        );
      }

      if (selectedCuisine) {
        filtered = filtered.filter((r) => r.cuisineType === selectedCuisine);
      }

      setFilteredRestaurants(filtered);
      setCurrentPage(1);
    };

    filterRestaurants();
  }, [searchTerm, selectedCuisine, restaurants]);

  const cuisines = [...new Set(restaurants.map((r) => r.cuisineType))];

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Container>
      <BackgroundOverlay />
      <ContentWrapper>
        <div className="absolute top-10 left-0 z-10">
          <button
            onClick={handleBackToHome}
            className="text-white bg-transparent p-2 rounded-full hover:bg-gray-500 transition-all duration-300"
          >
            <FaArrowLeft className="text-2xl" />
          </button>
        </div>
        <Title>🍽️ Our Partnered Restaurants</Title>

        <div className="flex flex-wrap gap-4 justify-center items-center mb-8">
          <SearchInput>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
          </SearchInput>

          <CuisineSelect
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
          >
            <option value="">All Cuisines</option>
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </CuisineSelect>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : currentRestaurants.length === 0 ? (
          <p className="text-white text-center text-lg">
            No restaurants found.
          </p>
        ) : (
          <>
            <RestaurantGrid>
              {currentRestaurants
                .filter((res) => res.isPublished)
                .map((restaurant, index) => (
                  <RestaurantCard
                    key={restaurant._id}
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RestaurantImage
                      src={
                        restaurant.thumbnail || restaurant.logo || '/test.png'
                      }
                      alt={restaurant.name}
                    />

                    <CardTitle>{restaurant.name}</CardTitle>

                    <InfoContainer>
                      <InfoText>Adress: {restaurant.address}</InfoText>
                      <InfoText>Cuisine: {restaurant.cuisineType}</InfoText>
                      <InfoText>Rating: {restaurant.note} ⭐</InfoText>

                      {restaurant.promotion && (
                        <PromotionText>
                          🔥 Promo: {restaurant.promotion}
                        </PromotionText>
                      )}
                    </InfoContainer>

                    <FlexContainer>
                      <BookButton to={`/restaurants/${restaurant._id}`}>
                        Book Now
                      </BookButton>
                    </FlexContainer>
                  </RestaurantCard>
                ))}
            </RestaurantGrid>
            <div className="flex justify-center mt-8 gap-2 flex-wrap">
              {Array.from(
                {
                  length: Math.ceil(
                    filteredRestaurants.length / restaurantsPerPage
                  ),
                },
                (_, i) => (
                  <PaginationButton
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    active={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationButton>
                )
              )}
            </div>
          </>
        )}
      </ContentWrapper>
    </Container>
  );
};

export default RestaurantList;
