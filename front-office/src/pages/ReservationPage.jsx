import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RestaurantLayout from '../components/RestaurantLayout';

const ReservationPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tables');
        setTables(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des tables. Veuillez rafraîchir la page.");
        console.error("Erreur API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg max-w-md mx-auto mt-10">
      {error}
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Réessayer
      </button>
    </div>
  );

  return <RestaurantLayout tables={tables} />;
};

export default ReservationPage;