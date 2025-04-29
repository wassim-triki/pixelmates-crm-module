import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../config/axios';
import RestaurantLayout from '../components/RestaurantLayout';
import Loader from '../components/Loader.jsx';

const ReservationPage = () => {
  const { restaurantId } = useParams();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get(`/restaurants/${restaurantId}/tables`);
        setTables(response.data);
      } catch (err) {
        setError('Erreur de chargement des tables');
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, [restaurantId]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen">
      {error ? (
        <div className="p-6 text-red-500">{error}</div>
      ) : (
        <RestaurantLayout tables={tables} />
      )}
    </div>
  );
};

export default ReservationPage;