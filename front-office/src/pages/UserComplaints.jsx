import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useComplaint } from '../context/complaintContext';
import BlurContainer from '../components/blurContainer';
import Button from '../components/button';
import { FaArrowLeft, FaExclamationCircle, FaEdit, FaTrash, FaInfoCircle, FaPlus ,FaUtensils,FaTag} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

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
          <h2 className="text-2xl font-bold text-white mb-4">{complaint.title}</h2>
          <div className="space-y-4 text-white">
            <p><span className="font-medium">Restaurant:</span> {complaint.restaurant?.name || 'Unknown'}</p>
            <p><span className="font-medium">Category:</span> {complaint.category || 'Other'}</p>
            <p><span className="font-medium">Status:</span> {complaint.status || 'Pending'}</p>
            <p><span className="font-medium">Description:</span> {complaint.description}</p>
            <p><span className="font-medium">Response:</span> {complaint.response || 'No response yet'}</p>
            <p><span className="font-medium">Created:</span> {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}</p>
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

const UserComplaints = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { complaints = [], loading, error, fetchUserComplaints, deleteComplaint } = useComplaint();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
  
    const loadComplaints = async () => {
      if (!user || !isMounted) return;
  
      try {
        await fetchUserComplaints();
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching user complaints:', err);
          toast.error(err.response?.data || 'Too many requests. Please try again later.');
        }
      }
    };
  
    loadComplaints();
  
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleBackClick = () => navigate('/');

  const handleUpdateClick = (complaintId) => {
    navigate(`/complaint?editId=${complaintId}`);
  };

  const handleDeleteClick = async (complaintId) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await deleteComplaint(complaintId);
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
    navigate('/complaint');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'text-green-400';
      case 'Pending': return 'text-yellow-400';
      case 'Rejected': return 'text-red-400';
      default: return 'text-gray-400';
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
              ease: "linear",
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
            <h1 className="text-3xl font-bold text-center flex-1">Your Complaints</h1>
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
            title="Submit new complaint"
          >
            <FaPlus className="text-xl" />
          </motion.button>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-[#FA8072] border-t-transparent rounded-full"
              ></motion.div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <FaExclamationCircle className="mx-auto text-4xl text-[#FA8072] mb-4" />
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <Button
                onClick={() => navigate('/complaint')}
                className="!bg-[#FA8072] hover:!bg-[#e0685a] text-white py-2 px-6 rounded-full transition-all duration-300"
              >
                Submit a Complaint
              </Button>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-8">
              <FaExclamationCircle className="mx-auto text-4xl text-[#FA8072] mb-4" />
              <p className="text-white text-lg mb-4">No complaints yet. Got something to share?</p>
              <Button
                onClick={() => navigate('/complaint')}
                className="!bg-[#FA8072] hover:!bg-[#e0685a] text-white py-2 px-6 rounded-full transition-all duration-300"
              >
                Submit a Complaint
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <Button
                  onClick={handleSubmitComplaint}
                  className="!bg-[#FA8072] hover:!bg-[#e0685a] text-white py-2 px-6 rounded-full transition-all duration-300"
                >
                  Submit a Complaint
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatePresence>
  {complaints.map((complaint, index) => (
  <motion.div
    key={complaint._id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    className="p-4 rounded-xl bg-gradient-to-br from-[#FA8072]/10 to-[#FA8072]/5 backdrop-blur-sm border border-[#FA8072]/30 hover:border-[#FA8072]/50 transition-all duration-300 relative overflow-hidden"
    whileHover={{ 
      y: -3,
      background: "linear-gradient(to bottom right, rgba(250, 128, 114, 0.15), rgba(250, 128, 114, 0.08))"
    }}
  >
    {/* Status indicator */}
    <div className={`absolute top-0 left-0 h-full w-1 ${getStatusColor(complaint.status).replace('text', 'bg')}`}></div>

    <div className="relative z-10 pl-3 space-y-3">
      {/* Header with title and status */}
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold text-white truncate max-w-[70%]">{complaint.title}</h2>
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(complaint.status)}`}>
          {complaint.status || 'Pending'}
        </span>
      </div>

      {/* Key information grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center space-x-1">
          <FaUtensils className="text-[#FA8072] text-xs" />
          <span className="font-medium">Restaurant:</span>
        </div>
        <span>{getRestaurantName(complaint.restaurant)}</span>

        <div className="flex items-center space-x-1">
          <FaTag className="text-[#FA8072] text-xs" />
          <span className="font-medium">Category:</span>
        </div>
        <span>{complaint.category || 'Other'}</span>
      </div>

      {/* Description with expand on hover */}
      <motion.div 
        className="relative"
        whileHover={{ height: 'auto' }}
      >
        <div className="text-sm text-gray-200 line-clamp-2 group-hover:line-clamp-none">
          {complaint.description}
        </div>
        <div className="absolute bottom-0 right-0 bg-gradient-to-l from-[#FA8072]/50 to-transparent w-1/2 h-full pointer-events-none group-hover:hidden"></div>
      </motion.div>

      {/* Timeline and actions */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-xs text-gray-400">
          {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
        </span>
        
        <div className="flex space-x-2">
          <motion.button
            onClick={() => handleViewDetails(complaint)}
            className="p-1 text-[#FA8072] hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="View details"
          >
            <FaInfoCircle />
          </motion.button>
          
          <motion.button
            onClick={() => handleUpdateClick(complaint._id)}
            className="p-1 text-blue-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Edit"
          >
            <FaEdit />
          </motion.button>
          
          <motion.button
            onClick={() => handleDeleteClick(complaint._id)}
            className="p-1 text-red-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Delete"
          >
            <FaTrash />
          </motion.button>
        </div>
      </div>

      {/* Images preview */}
      {complaint.images?.length > 0 && (
        <motion.div 
          className="mt-2 flex space-x-2 overflow-x-auto pb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {complaint.images.slice(0, 3).map((image, index) => (
            <motion.div
              key={index}
              className="relative h-12 w-12 rounded-md overflow-hidden border border-[#FA8072]/30"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {index === 2 && complaint.images.length > 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-xs">+{complaint.images.length - 3}</span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
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

export default UserComplaints;