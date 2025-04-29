import React, { useEffect, useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Dropdown, Modal, Button, Form, Alert, Spinner, Pagination, Badge } from 'react-bootstrap';
import { getCurrentUser, formatError } from '../../../services/AuthService.js';
import {
  getComplaints,
  getComplaintById,
  getComplaintsByRestaurant,
  getComplaintsByUser,
  updateComplaint,
  uploadImage,
} from '../../../services/ComplaintService.js';

const ComplaintList = () => {
  // State Management
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const [validationErrors, setValidationErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await getCurrentUser();
          const user = response.data;
          setCurrentUser(user);
          if (user && user.role?.name === 'SuperAdmin') {
            await fetchComplaints();
          }
        } catch (err) {
          setCurrentUser(null);
          setError(formatError(err) || 'Authentication failed');
        } finally {
          setAuthLoading(false);
        }
      };
      checkAuth();
    }, []);
  // Fetch Complaints
  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getComplaints();
      setComplaints(response.data || []);
    } catch (err) {
      setError(formatError(err) || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  // Search Complaints
  const handleSearch = async (term) => {
    try {
      const response = await getComplaints();
      const allComplaints = response.data || [];

      const filteredComplaints = allComplaints.filter((c) => {
        const lowerTerm = term.toLowerCase();
        return (
          (c.title && c.title.toLowerCase().includes(lowerTerm)) ||
          (c.description && c.description.toLowerCase().includes(lowerTerm)) ||
          (c.user?.name && c.user.name.toLowerCase().includes(lowerTerm)) ||
          (c.restaurant?.name && c.restaurant.name.toLowerCase().includes(lowerTerm))
        );
      });

      setComplaints(filteredComplaints);
      setCurrentPage(0);
    } catch (err) {
      setError(formatError(err) || 'Search failed');
    }
  };

  // Update Complaint
  const handleUpdateComplaint = async () => {
    const errors = validateForm(selectedComplaint);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await updateComplaint(
        {
          status: selectedComplaint.status,
          priority: selectedComplaint.priority,
          response: selectedComplaint.response,
        },
        selectedComplaint._id
      );
      await fetchComplaints();
      handleCloseEditModal();
    } catch (err) {
      setError(formatError(err) || 'Failed to update complaint');
    } finally {
      setLoading(false);
    }
  };

  // Upload Image
  const handleImageUpload = async () => {
    if (!imageFile) {
      setValidationErrors({ image: 'Please select an image' });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      await uploadImage(selectedComplaint._id, formData);
      await fetchComplaints(); // Refresh complaints to get updated images
      setImageFile(null);
      setValidationErrors({});
    } catch (err) {
      setError(formatError(err) || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  // Form Validation
  const validateForm = (data) => {
    const errors = {};
    if (!data.status) errors.status = 'Status is required';
    if (!data.priority) errors.priority = 'Priority is required';
    return errors;
  };

  // Modal Handlers
  const handleShowDetailModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedComplaint(null);
    setImageFile(null);
    setValidationErrors({});
  };

  const handleShowEditModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowEditModal(true);
    setValidationErrors({});
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedComplaint(null);
    setValidationErrors({});
  };

  // Sorting and Filtering
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesStatus = statusFilter ? c.status === statusFilter : true;
      const matchesPriority = priorityFilter ? c.priority === priorityFilter : true;
      return matchesStatus && matchesPriority;
    });
  }, [complaints, statusFilter, priorityFilter]);

  const sortedComplaints = useMemo(() => {
    const sorted = [...filteredComplaints].sort((a, b) => {
      const keyA = a[sortConfig.key] || '';
      const keyB = b[sortConfig.key] || '';
      if (sortConfig.key === 'createdAt') {
        return sortConfig.direction === 'ascending'
          ? new Date(keyA) - new Date(keyB)
          : new Date(keyB) - new Date(keyA);
      }
      return sortConfig.direction === 'ascending'
        ? String(keyA).localeCompare(String(keyB))
        : String(keyB).localeCompare(String(keyA));
    });
    return sorted;
  }, [filteredComplaints, sortConfig]);

  const paginatedComplaints = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return sortedComplaints.slice(start, start + itemsPerPage);
  }, [sortedComplaints, currentPage]);

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  // Render Conditions (Copied from RestaurantList.jsx)
  if (authLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading authentication...</p>
      </div>
    );
  }

  if (!currentUser || currentUser.role?.name !== 'SuperAdmin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="container-fluid py-4">
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-3 flex-nowrap gap-2">
        {/* Search Bar */}
        <div className="flex-grow-1 mx-3" style={{ maxWidth: '300px', minWidth: '200px' }}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search Complaints..."
              value={searchTerm}
              style={{ height: '52px' }}
              onChange={async (e) => {
                const term = e.target.value;
                setSearchTerm(term);
                if (!term.trim()) {
                  await fetchComplaints();
                } else {
                  await handleSearch(term);
                }
              }}
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <Dropdown className="flex-shrink-0 me-2">
          <Dropdown.Toggle
            variant="outline-primary"
            disabled={loading}
            className="shadow-sm"
            style={{
              fontSize: '0.9rem',
              padding: '6px 12px',
              height: '52px',
              maxWidth: '200px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {statusFilter ? `Status: ${statusFilter}` : 'Filter by Status'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setStatusFilter('')}>All</Dropdown.Item>
            {['Pending', 'In Progress', 'Resolved', 'Closed'].map((status) => (
              <Dropdown.Item key={status} onClick={() => setStatusFilter(status)}>
                {status}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="flex-shrink-0 me-2">
          <Dropdown.Toggle
            variant="outline-primary"
            disabled={loading}
            className="shadow-sm"
            style={{
              fontSize: '0.9rem',
              padding: '6px 12px',
              height: '52px',
              maxWidth: '200px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {priorityFilter ? `Priority: ${priorityFilter}` : 'Filter by Priority'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setPriorityFilter('')}>All</Dropdown.Item>
            {['Low', 'Medium', 'High'].map((priority) => (
              <Dropdown.Item key={priority} onClick={() => setPriorityFilter(priority)}>
                {priority}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        {/* Sort Dropdown */}
        <Dropdown className="flex-shrink-0">
          <Dropdown.Toggle
            variant="outline-primary"
            disabled={loading}
            className="shadow-sm"
            style={{
              fontSize: '0.9rem',
              padding: '6px 12px',
              height: '52px',
              maxWidth: '200px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {sortConfig.key
              ? `Sort By: ${sortConfig.key.charAt(0).toUpperCase() + sortConfig.key.slice(1)}`
              : 'Sort By'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => requestSort('title')}>Title</Dropdown.Item>
            <Dropdown.Item onClick={() => requestSort('status')}>Status</Dropdown.Item>
            <Dropdown.Item onClick={() => requestSort('priority')}>Priority</Dropdown.Item>
            <Dropdown.Item onClick={() => requestSort('createdAt')}>Created Date</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <h1 className="text-center fw-bold pt-4 mb-4">Complaints List</h1>

      {/* Complaint Table */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <Alert variant="info">No complaints found.</Alert>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-main">
                <tr>
                  <th
                    onClick={() => requestSort('title')}
                    style={{ cursor: 'pointer' }}
                    className="text-center"
                  >
                    Title{' '}
                    {sortConfig.key === 'title' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="text-center">User</th>
                  <th className="text-center">Restaurant</th>
                  <th
                    onClick={() => requestSort('status')}
                    style={{ cursor: 'pointer' }}
                    className="text-center"
                  >
                    Status{' '}
                    {sortConfig.key === 'status' &&
                      (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => requestSort('priority')}
                    style={{ cursor: 'pointer' }}
                    className="text-center"
                  >
                    Priority{' '}
                    {sortConfig.key === 'priority' &&
                      (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => requestSort('createdAt')}
                    style={{ cursor: 'pointer' }}
                    className="text-center"
                  >
                    Created At{' '}
                    {sortConfig.key === 'createdAt' &&
                      (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedComplaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>{complaint.title || 'N/A'}</td>
                    <td>{complaint.user?.name || 'N/A'}</td>
                    <td>{complaint.restaurant?.name || 'N/A'}</td>
                    <td className="text-center">
                      <Badge
                        bg={
                          complaint.status === 'Resolved'
                            ? 'success'
                            : complaint.status === 'Closed'
                            ? 'secondary'
                            : complaint.status === 'In Progress'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {complaint.status || 'N/A'}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Badge
                        bg={
                          complaint.priority === 'High'
                            ? 'danger'
                            : complaint.priority === 'Medium'
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {complaint.priority || 'N/A'}
                      </Badge>
                    </td>
                    <td>{new Date(complaint.createdAt).toLocaleDateString() || 'N/A'}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <Button
                          variant="primary"
                          size="sm"
                          style={{ backgroundColor: '#0d6efd', color: 'white' }}
                          onClick={() => handleShowDetailModal(complaint)}
                          disabled={loading}
                        >
                          <i className="fas fa-eye" />
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          style={{ backgroundColor: '#ffc107', color: 'black' }}
                          onClick={() => handleShowEditModal(complaint)}
                          disabled={loading}
                        >
                          <i className="fas fa-pen" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-sm-flex text-center justify-content-between align-items-center mt-4">
            <div className="dataTables_info mb-2 mb-sm-0">
              Showing {currentPage * itemsPerPage + 1} to{' '}
              {Math.min((currentPage + 1) * itemsPerPage, filteredComplaints.length)} of{' '}
              {filteredComplaints.length} entries
            </div>
            <div className="dataTables_paginate paging_simple_numbers">
              <button
                className="btn btn-outline-primary btn-sm me-2"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm me-1 ${
                    currentPage === i ? 'btn-primary text-white' : 'btn-outline-primary'
                  }`}
                  onClick={() => setCurrentPage(i)}
                  disabled={loading}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={currentPage === totalPages - 1}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={handleCloseDetailModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center fw-bold">Complaint Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <p>
                  <strong>Title:</strong> {selectedComplaint.title || 'N/A'}
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p>
                  <strong>User:</strong> {selectedComplaint.user?.name || 'N/A'} (
                  {selectedComplaint.user?.email || 'N/A'})
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p>
                  <strong>Restaurant:</strong> {selectedComplaint.restaurant?.name || 'N/A'} (
                  {selectedComplaint.restaurant?.address || 'N/A'})
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p>
                  <strong>Status:</strong>{' '}
                  <Badge
                    bg={
                      selectedComplaint.status === 'Resolved'
                        ? 'success'
                        : selectedComplaint.status === 'Closed'
                        ? 'secondary'
                        : selectedComplaint.status === 'In Progress'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {selectedComplaint.status || 'N/A'}
                  </Badge>
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p>
                  <strong>Priority:</strong>{' '}
                  <Badge
                    bg={
                      selectedComplaint.priority === 'High'
                        ? 'danger'
                        : selectedComplaint.priority === 'Medium'
                        ? 'warning'
                        : 'success'
                    }
                  >
                    {selectedComplaint.priority || 'N/A'}
                  </Badge>
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p>
                  <strong>Created At:</strong>{' '}
                  {new Date(selectedComplaint.createdAt).toLocaleString() || 'N/A'}
                </p>
              </div>
              <div className="col-md-12 mb-3">
                <p>
                  <strong>Description:</strong> {selectedComplaint.description || 'N/A'}
                </p>
              </div>
              <div className="col-md-12 mb-3">
                <p>
                  <strong>Response:</strong> {selectedComplaint.response || 'No response yet'}
                </p>
              </div>
              <div className="col-md-12 mb-3">
                <p>
                  <strong>Images:</strong>
                </p>
                {selectedComplaint.images?.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {selectedComplaint.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Complaint Image ${index + 1}`}
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        className="rounded"
                      />
                    ))}
                  </div>
                ) : (
                  'No images'
                )}
              </div>
              <div className="col-md-12 mb-3">
                <Form.Group controlId="imageUpload">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    isInvalid={!!validationErrors.image}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.image}
                  </Form.Control.Feedback>
                </Form.Group>
                {imageFile && (
                  <Button
                    variant="primary"
                    className="mt-2"
                    onClick={handleImageUpload}
                    disabled={loading}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Upload Image'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailModal} disabled={loading}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center fw-bold">Edit Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <Form>
              <div className="row">
                <Form.Group className="col-md-6 mb-3" controlId="editStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={selectedComplaint.status || ''}
                    onChange={(e) =>
                      setSelectedComplaint({ ...selectedComplaint, status: e.target.value })
                    }
                    isInvalid={!!validationErrors.status}
                  >
                    <option value="">Select Status</option>
                    {['Pending', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.status}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="editPriority">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={selectedComplaint.priority || ''}
                    onChange={(e) =>
                      setSelectedComplaint({ ...selectedComplaint, priority: e.target.value })
                    }
                    isInvalid={!!validationErrors.priority}
                  >
                    <option value="">Select Priority</option>
                    {['Low', 'Medium', 'High'].map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.priority}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-12 mb-3" controlId="editResponse">
                  <Form.Label>Response</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={selectedComplaint.response || ''}
                    onChange={(e) =>
                      setSelectedComplaint({ ...selectedComplaint, response: e.target.value })
                    }
                    isInvalid={!!validationErrors.response}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.response}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateComplaint} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ComplaintList;