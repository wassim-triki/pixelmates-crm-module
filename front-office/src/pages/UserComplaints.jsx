import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useComplaint } from '../context/ComplaintContext';
import BlurContainer from '../components/blurContainer';
import Button from '../components/button';
import { FaArrowLeft, FaExclamationCircle, FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';

const ComplaintModal = ({ complaint, isOpen, onClose }) => {
  if (!isOpen || !complaint) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full mx-4 border border-[#FA8072]">
        <h2 className="text-2xl font-bold text-white mb-4">{complaint.title}</h2>
        <div className="space-y-4 text-white">
          <p><span className="font-medium">Restaurant:</span> {complaint.restaurant?.name || 'Unknown'}</p>
          <p><span className="font-medium">Priority:</span> {complaint.priority}</p>
          <p><span className="font-medium">Status:</span> {complaint.status || 'Pending'}</p>
          <p><span className="font-medium">Description:</span> {complaint.description}</p>
          <p><span className="font-medium">Created:</span> {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}</p>
          {complaint.images?.length > 0 && (
            <div>
              <p className="font-medium">Images:</p>
              <div className="flex gap-2 overflow-x-auto mt-2">
                {complaint.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Complaint ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-md border border-[#FA8072]"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            className="!bg-[#FA8072] hover:!bg-[#e0685a] text-white py-2 px-6 rounded-full transition-all duration-300"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
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
    <div className="flex flex-col min-h-screen bg-transparent relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Backg_Login.png')",
          filter: 'blur(5px)',
        }}
      />
      <main className="relative flex-grow flex items-center justify-center py-24 px-6">
        <BlurContainer className="w-full max-w-4xl p-8 sm:p-10 rounded-2xl bg-white/20 backdrop-blur-xl text-white shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackClick}
              className="text-white bg-transparent p-2 rounded-full hover:bg-gray-500 transition-all duration-300"
            >
              <FaArrowLeft className="text-2xl" />
            </button>
            <h1 className="text-3xl font-bold text-center flex-1">Your Complaints</h1>
            <div className="w-10" />
          </div>

          {loading ? (
            <p className="text-center text-white">Loading complaints...</p>
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
                {complaints.map((complaint) => (
                  <div
                    key={complaint._id}
                    className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-[#FA8072] hover:border-[#e0685a] hover:scale-105 transition-all duration-300 shadow-md"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-semibold text-white truncate">{complaint.title}</h2>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(
                          complaint.priority
                        )} text-white`}
                      >
                        {complaint.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 mb-2">
                      <span className="font-medium">Restaurant:</span>{' '}
                      {getRestaurantName(complaint.restaurant)}
                    </p>
                    <p className="text-sm text-gray-200 mb-2 line-clamp-3">{complaint.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status || 'Pending'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleViewDetails(complaint)}
                        className="text-white hover:text-[#FA8072] transition-colors duration-200"
                        title="View Details"
                      >
                        <FaInfoCircle className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleUpdateClick(complaint._id)}
                        className="text-white hover:text-[#FA8072] transition-colors duration-200"
                        title="Edit Complaint"
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(complaint._id)}
                        className="text-white hover:text-[#FA8072] transition-colors duration-200"
                        title="Delete Complaint"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
                    {complaint.images?.length > 0 && (
                      <div className="mt-2 flex gap-2 overflow-x-auto">
                        {complaint.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Complaint ${index + 1}`}
                            className="h-16 w-16 object-cover rounded-md border border-[#FA8072]"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
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