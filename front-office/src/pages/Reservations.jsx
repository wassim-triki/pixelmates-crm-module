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
  FaTable,
  FaUser,
  FaCalendarAlt,
  FaClock,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatDistanceToNow, format, parse } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../config/axios';

const ReservationModal = ({ reservation, isOpen, onClose }) => {
  if (!isOpen || !reservation) return null;

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
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FA8072]/10 rounded-full filter blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#FA8072]/10 rounded-full filter blur-3xl" />

        <div className="relative z-10 text-white space-y-4">
          <h2 className="text-2xl font-bold">
            Reservation by {reservation.user.firstName}{' '}
            {reservation.user.lastName}
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-1">
              <FaUtensils className="text-[#FA8072] text-xs" />
              <span className="font-medium">Restaurant:</span>
            </div>
            <span>{reservation.restaurant.name}</span>

            <div className="flex items-center space-x-1">
              <FaTable className="text-[#FA8072] text-xs" />
              <span className="font-medium">Table #:</span>
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
            <span>{format(new Date(reservation.start), 'dd/MM/yyyy')}</span>

            <div className="flex items-center space-x-1">
              <FaClock className="text-[#FA8072] text-xs" />
              <span className="font-medium">Time:</span>
            </div>
            <span>{format(new Date(reservation.start), 'HH:mm')}</span>
          </div>

          <p className="text-xs text-gray-300">
            Created{' '}
            {formatDistanceToNow(new Date(reservation.createdAt), {
              addSuffix: true,
            })}
          </p>

          <div className="mt-6 flex justify-end space-x-2">
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

const EditReservationModal = ({
  reservation,
  isOpen,
  onClose,
  onSubmit,
  restaurant,
}) => {
  if (!isOpen || !reservation) return null;

  const [formData, setFormData] = useState({
    guests: reservation.covers,
    date: format(new Date(reservation.start), 'yyyy-MM-dd'),
    time: format(new Date(reservation.start), 'HH:mm'),
    restaurantId: reservation.restaurant._id,
    tableId: reservation.table._id,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error on change
  };

  const validateTime = (date, time) => {
    if (!restaurant || !restaurant.workFrom || !restaurant.workTo) return true;

    const [openH, openM] = restaurant.workFrom.split(':').map(Number);
    const [closeH, closeM] = restaurant.workTo.split(':').map(Number);
    const start = parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
    const end = new Date(start.getTime() + 120 * 60_000); // Assuming 120 minutes reservation duration
    const openTime = new Date(start);
    const closeTime = new Date(start);
    openTime.setHours(openH, openM, 0, 0);
    closeTime.setHours(closeH, closeM, 0, 0);

    if (start < openTime || end > closeTime) {
      return `Reservations must be between ${restaurant.workFrom} and ${restaurant.workTo}`;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timeValidation = validateTime(formData.date, formData.time);
    if (timeValidation !== true) {
      setError(timeValidation);
      return;
    }

    try {
      await onSubmit(reservation._id, {
        guests: parseInt(formData.guests),
        date: formData.date,
        time: formData.time,
        tableId: formData.tableId,
        restaurantId: formData.restaurantId,
      });
      onClose();
      toast.success('Reservation updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update reservation');
    }
  };

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
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FA8072]/10 rounded-full filter blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#FA8072]/10 rounded-full filter blur-3xl" />

        <div className="relative z-10 text-white space-y-4">
          <h2 className="text-2xl font-bold">Edit Reservation</h2>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Guests</label>
                <input
                  type="number"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  min="1"
                  className="w-full p-2 rounded bg-white/10 border border-[#FA8072]/30 text-white focus:outline-none focus:border-[#FA8072]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-white/10 border border-[#FA8072]/30 text-white focus:outline-none focus:border-[#FA8072]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-white/10 border border-[#FA8072]/30 text-white focus:outline-none focus:border-[#FA8072]"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <motion.button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-full transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="bg-[#FA8072] hover:bg-[#e0685a] text-white py-2 px-6 rounded-full transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Reservations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [restaurants, setRestaurants] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance('/reservations');
      setReservations(response.data.data);
    } catch (err) {
      setError('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurant = async (restaurantId) => {
    try {
      const response = await axiosInstance(`/restaurants/${restaurantId}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching restaurant:', err);
      return null;
    }
  };

  const updateReservation = async (reservationId, data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch(
        `/reservations/${reservationId}`,
        data
      );
      setReservations((prev) =>
        prev.map((res) => (res._id === reservationId ? response.data : res))
      );
    } catch (err) {
      throw new Error(
        err.response?.data?.message || 'Failed to update reservation'
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteReservation = async (reservationId) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/reservations/${reservationId}`);
      setReservations((prev) =>
        prev.filter((reservation) => reservation._id !== reservationId)
      );
    } catch (err) {
      setError('Failed to delete reservation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadReservations = async () => {
      if (!user || !isMounted) return;

      try {
        await fetchReservations();
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching reservations:', err);
          toast.error(
            err.response?.data?.message ||
              'Too many requests. Please try again later.'
          );
        }
      }
    };

    loadReservations();

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    const loadRestaurants = async () => {
      const uniqueRestaurantIds = [
        ...new Set(reservations.map((r) => r.restaurant._id)),
      ];
      const restaurantData = {};
      for (const id of uniqueRestaurantIds) {
        if (!restaurants[id]) {
          const data = await fetchRestaurant(id);
          if (data) {
            restaurantData[id] = data;
          }
        }
      }
      setRestaurants((prev) => ({ ...prev, ...restaurantData }));
    };

    if (reservations.length > 0) {
      loadRestaurants();
    }
  }, [reservations]);

  const handleBackClick = () => navigate('/');

  const handleEditClick = (reservation) => {
    setSelectedReservation(reservation);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (reservationId) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        await deleteReservation(reservationId);
        toast.success('Reservation deleted successfully');
      } catch (err) {
        toast.error('Failed to delete reservation');
      }
    }
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setIsViewModalOpen(true);
  };

  const handleSubmitComplaint = () => {
    navigate('/restaurants');
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedReservation(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedReservation(null);
  };

  const handleEditSubmit = async (reservationId, data) => {
    await updateReservation(reservationId, data);
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

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative pt-20">
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
                    <div
                      className={`absolute top-0 left-0 h-full w-1 ${getStatusColor(
                        reservation.status
                      ).replace('text', 'bg')}`}
                    />

                    <div className="relative z-10 pl-3 space-y-3">
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
                            onClick={() => handleEditClick(reservation)}
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
          )}
        </BlurContainer>
      </main>
      <ReservationModal
        reservation={selectedReservation}
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
      />
      <EditReservationModal
        reservation={selectedReservation}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleEditSubmit}
        restaurant={
          selectedReservation
            ? restaurants[selectedReservation.restaurant._id]
            : null
        }
      />
    </div>
  );
};

export default Reservations;
