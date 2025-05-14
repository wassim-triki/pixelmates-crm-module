import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import BlurContainer from '../components/blurContainer';
import Button from '../components/button';
import {
  FaArrowLeft,
  FaExclamationCircle,
  FaEdit,
  FaTrash,
  FaInfoCircle,
  FaPlus,
  FaUtensils,
  FaTag,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../config/axios';
import { FaTable, FaUser, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';

const ComplaintModal = ({ complaint, isOpen, onClose }) => {
  if (!isOpen || !complaint) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full mx-4 border border-[#FA8072] relative overflow-hidden"
      >
        {/* Floating background elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FA8072]/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#FA8072]/10 rounded-full filter blur-3xl"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-4">
            {complaint.title}
          </h2>
          <div className="space-y-4 text-white">
            <p>
              <span className="font-medium">Restaurant:</span>{' '}
              {complaint.restaurant?.name || 'Unknown'}
            </p>
            <p>
              <span className="font-medium">Category:</span>{' '}
              {complaint.category || 'Other'}
            </p>
            <p>
              <span className="font-medium">Status:</span>{' '}
              {complaint.status || 'Pending'}
            </p>
            <p>
              <span className="font-medium">Description:</span>{' '}
              {complaint.description}
            </p>
            <p>
              <span className="font-medium">Response:</span>{' '}
              {complaint.response || 'No response yet'}
            </p>
            <p>
              <span className="font-medium">Created:</span>{' '}
              {formatDistanceToNow(new Date(complaint.createdAt), {
                addSuffix: true,
              })}
            </p>
            {complaint.images?.length > 0 && (
              <div>
                <p className="font-medium">Images:</p>
                <div className="flex gap-2 overflow-x-auto mt-2">
                  {complaint.images.map((image, index) => (
                    <motion.img
                      key={index}
                      src={image}
                      alt={`Complaint ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-md border border-[#FA8072]"
                      whileHover={{ scale: 1.05 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <motion.button
              onClick={onClose}
              className="bg-[#FA8072] hover:bg-[#e0685a] text-white py-2 px-6 rounded-full transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Reservations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Example: fetch reservations from API (replace with your API logic)
  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with your fetch logic
      const response = await axiosInstance('/reservations');
      const data = await response.data;
      setReservations(data.data);
    } catch (err) {
      setError('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('reservations:', reservations);
  }, [reservations]);

  // Example: delete reservation (replace with your API logic)
  const deleteReservation = async (reservationId) => {
    setLoading(true);
    setError(null);
    try {
      // Replace with your delete logic
      // await fetch(`/api/reservations/${reservationId}`, { method: 'DELETE' });
      const response = await axiosInstance.delete(
        `/reservations/${reservationId}`
      );
      setReservations((prev) =>
        prev.filter((reservation) => reservation._id !== reservationId)
      );
    } catch (err) {
      setError('Failed to delete reservation');
    } finally {
      setLoading(false);
    }
  };

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadComplaints = async () => {
      if (!user || !isMounted) return;

      try {
        await fetchReservations();
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching user complaints:', err);
          toast.error(
            err.response?.data || 'Too many requests. Please try again later.'
          );
        }
      }
    };

    loadComplaints();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleBackClick = () => navigate('/');

  const handleUpdateClick = (reservationId) => {
    navigate(`/complaint?editId=${reservationId}`);
  };

  const handleDeleteClick = async (reservationId) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await deleteReservation(reservationId);
        toast.success('Complaint deleted successfully');
      } catch (err) {
        toast.error('Failed to delete complaint');
      }
    }
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleSubmitComplaint = () => {
    navigate('/restaurants');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'text-green-400';
      case 'Pending':
        return 'text-yellow-400';
      case 'Rejected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRestaurantName = (restaurant) => {
    if (!restaurant) return 'Unknown';
    if (typeof restaurant === 'string') return restaurant;
    return restaurant.name || 'Unknown';
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-[#FA8072]/10 text-4xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {['❗', '❓', '⚠️', '🔍'][i % 4]}
          </motion.div>
        ))}
      </div>

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Backg_Login.png')",
          filter: 'blur(5px)',
        }}
      />

      <main className="relative flex-grow flex items-center justify-center py-12 px-6">
        <BlurContainer className="w-full max-w-4xl p-8 sm:p-10 rounded-2xl bg-white/20 backdrop-blur-xl text-white shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <motion.button
              onClick={handleBackClick}
              className="text-white bg-transparent p-2 rounded-full hover:bg-gray-500 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaArrowLeft className="text-2xl" />
            </motion.button>
            <h1 className="text-3xl font-bold text-center flex-1">
              Your Reservations
            </h1>
            <div className="w-10" />
          </div>

          {/* Floating action button */}
          <motion.button
            onClick={handleSubmitComplaint}
            className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-[#FA8072] hover:bg-[#e0685a] text-white flex items-center justify-center shadow-lg z-20"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            title="Submit a new reservation"
          >
            <FaPlus className="text-xl" />
          </motion.button>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-[#FA8072] border-t-transparent rounded-full"
              ></motion.div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <FaExclamationCircle className="mx-auto text-4xl text-[#FA8072] mb-4" />
              <p className="text-red-500 text-lg mb-4">{error}</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-8">
              <FaExclamationCircle className="mx-auto text-4xl text-[#FA8072] mb-4" />
              <p className="text-white text-lg mb-4">No reservations yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatePresence>
                  {reservations.map((reservation, idx) => (
                    <motion.div
                      key={reservation._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-[#FA8072]/10 to-[#FA8072]/5 backdrop-blur-sm border border-[#FA8072]/30 hover:border-[#FA8072]/50 transition-all duration-300 relative overflow-hidden"
                      whileHover={{
                        y: -3,
                        background:
                          'linear-gradient(to bottom right, rgba(250, 128, 114, 0.15), rgba(250, 128, 114, 0.08))',
                      }}
                    >
                      {/* Status bar */}
                      <div
                        className={`absolute top-0 left-0 h-full w-1 ${getStatusColor(
                          reservation.status
                        ).replace('text', 'bg')}`}
                      />

                      <div className="relative z-10 pl-3 space-y-3">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                          <h2 className="text-lg font-bold text-white truncate max-w-[70%]">
                            Reservation by {reservation.user.firstName}{' '}
                            {reservation.user.lastName}
                          </h2>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                              reservation.status
                            )}`}
                          >
                            {reservation.status || 'Pending'}
                          </span>
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div className="flex items-center space-x-1">
                            <FaUtensils className="text-[#FA8072] text-xs" />
                            <span className="font-medium">Restaurant:</span>
                          </div>
                          <span>{reservation.restaurant.name}</span>

                          <div className="flex items-center space-x-1">
                            <FaTable className="text-[#FA8072] text-xs" />
                            <span className="font-medium">Table:</span>
                          </div>
                          <span>{reservation.table.number}</span>

                          <div className="flex items-center space-x-1">
                            <FaUser className="text-[#FA8072] text-xs" />
                            <span className="font-medium">Guests:</span>
                          </div>
                          <span>{reservation.covers}</span>

                          <div className="flex items-center space-x-1">
                            <FaCalendarAlt className="text-[#FA8072] text-xs" />
                            <span className="font-medium">Date:</span>
                          </div>
                          <span>
                            {format(new Date(reservation.start), 'dd/MM/yyyy')}
                          </span>

                          <div className="flex items-center space-x-1">
                            <FaClock className="text-[#FA8072] text-xs" />
                            <span className="font-medium">Time:</span>
                          </div>
                          <span>
                            {format(new Date(reservation.start), 'HH:mm')}
                          </span>
                        </div>

                        {/* Footer: timestamp + actions */}
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs text-gray-400">
                            {formatDistanceToNow(
                              new Date(reservation.createdAt),
                              { addSuffix: true }
                            )}
                          </span>
                          <div className="flex space-x-2">
                            <motion.button
                              onClick={() => handleViewDetails(reservation)}
                              className="p-1 text-[#FA8072] hover:text-white transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="View details"
                            >
                              <FaInfoCircle />
                            </motion.button>
                            <motion.button
                              onClick={() => handleUpdateClick(reservation._id)}
                              className="p-1 text-blue-400 hover:text-white transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="Edit"
                            >
                              <FaEdit />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDeleteClick(reservation._id)}
                              className="p-1 text-red-400 hover:text-white transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="Delete"
                            >
                              <FaTrash />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </BlurContainer>
      </main>
      <ComplaintModal
        complaint={selectedComplaint}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Reservations;
