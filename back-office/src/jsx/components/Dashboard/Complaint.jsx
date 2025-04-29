import React, { useEffect, useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Dropdown, Modal, Button, Form, Alert, Spinner, Pagination, Badge } from 'react-bootstrap';
import { getCurrentUser, formatError } from '../../../services/AuthService.js';
import jsPDF from 'jspdf';
import logo from '../../../assets/images/Logo-officiel-MenuFy.png'; // Make sure this path is correct
import {
  getComplaints,
  getComplaintById,
  getComplaintsByRestaurant,
  getComplaintsByUser,
  updateComplaint,
  uploadImages, 
  sendResolvedSMS // Add this new service function
  // Updated to use the new function
} from '../../../services/ComplaintService.js';

const ComplaintList = () => {
  // State Management
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(''); // Added for category filtering
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
  const [imageUrls, setImageUrls] = useState([]); // Store image URLs for upload
  const [originalComplaint, setOriginalComplaint] = useState(null); // Add this line

  const itemsPerPage = 10;

  // Authentication Check
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
    setLoading(true);
    setError(null);
    try {
      const response = await getComplaints();
      const allComplaints = response.data || [];

      const filteredComplaints = allComplaints.filter((c) => {
        const lowerTerm = term.toLowerCase();
        return (
          (c.title && c.title.toLowerCase().includes(lowerTerm)) ||
          (c.description && c.description.toLowerCase().includes(lowerTerm)) ||
          (c.category && c.category.toLowerCase().includes(lowerTerm)) || // Added category search
          (c.user?.name && c.user.name.toLowerCase().includes(lowerTerm)) ||
          (c.restaurant?.name && c.restaurant.name.toLowerCase().includes(lowerTerm))
        );
      });

      setComplaints(filteredComplaints);
      setCurrentPage(0);
    } catch (err) {
      setError(formatError(err) || 'Search failed');
    } finally {
      setLoading(false);
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
      // Update complaint and capture response
      const updatedComplaint = await updateComplaint(
        {
          status: selectedComplaint.status,
          priority: selectedComplaint.priority,
          category: selectedComplaint.category,
          response: selectedComplaint.response || null,
        },
        selectedComplaint._id
      );

      // Check if status changed to Resolved
      if (
        originalComplaint &&
        originalComplaint.status !== 'Resolved' &&
        updatedComplaint.status === 'Resolved'
      ) {
        try {
          await sendResolvedSMS(updatedComplaint._id);
        } catch (smsError) {
          setError(
            `Complaint updated, but failed to send SMS: ${formatError(smsError)}`
          );
        }
      }

      await fetchComplaints();
      handleCloseEditModal();
    } catch (err) {
      setError(formatError(err) || 'Failed to update complaint');
    } finally {
      setLoading(false);
    }
  };


  const generateComplaintPDF = (complaint) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 30;
  
    // Add Logo
    try {
      doc.addImage(logo, 'PNG', 15, 10, 40, 15); // Adjust dimensions as needed
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  
    // Header Line
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(15, 27, pageWidth - 15, 27);
  
    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Complaint Report', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;
  
    // Complaint ID
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Complaint ID: ${complaint._id}`, 15, yPos);
    yPos += 8;
  
    // Report Date
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, pageWidth - 15, yPos, {
      align: 'right',
    });
    yPos += 15;
  
    // Section Styling
    const sectionStyle = {
      font: 'helvetica',
      fontSize: 12,
      sectionSpacing: 8,
      lineHeight: 7,
    };
  
    // Complaint Details Section
    const details = [
      { label: 'User', value: complaint.user?.email || 'N/A' },
      { label: 'Restaurant', value: complaint.restaurant?.name || 'N/A' },
      { label: 'Category', value: complaint.category || 'N/A' },
      { label: 'Status', value: complaint.status || 'N/A' },
      { label: 'Priority', value: complaint.priority || 'N/A' },
      { label: 'Created At', value: new Date(complaint.createdAt).toLocaleString() },
      { label: 'Last Updated', value: new Date(complaint.updatedAt).toLocaleString() },
    ];
  
    // Details Table
    doc.setFontSize(14);
    doc.setFont(sectionStyle.font, 'bold');
    doc.text('Complaint Details', 15, yPos);
    yPos += 10;
  
    details.forEach((item, index) => {
      doc.setFontSize(12);
      doc.setFont(sectionStyle.font, 'bold');
      doc.text(`${item.label}:`, 15, yPos);
      doc.setFont(sectionStyle.font, 'normal');
      doc.text(item.value, 50, yPos);
      yPos += sectionStyle.lineHeight;
      
      // Add spacing after every 3 items
      if ((index + 1) % 3 === 0) yPos += 5;
    });
  
    yPos += 10;
  
    // Description Section
    doc.setFontSize(14);
    doc.setFont(sectionStyle.font, 'bold');
    doc.text('Description', 15, yPos);
    yPos += 8;
  
    doc.setFontSize(12);
    doc.setFont(sectionStyle.font, 'normal');
    const splitDescription = doc.splitTextToSize(complaint.description || 'No description provided', 180);
    doc.text(splitDescription, 15, yPos);
    yPos += splitDescription.length * 6 + 10;
  
    // Response Section
    doc.setFontSize(14);
    doc.setFont(sectionStyle.font, 'bold');
    doc.text('Official Response', 15, yPos);
    yPos += 8;
  
    doc.setFontSize(12);
    doc.setFont(sectionStyle.font, 'normal');
    const splitResponse = doc.splitTextToSize(
      complaint.response || 'No official response yet', 
      180
    );
    doc.text(splitResponse, 15, yPos);
    yPos += splitResponse.length * 6 + 15;
  
    // Footer
    doc.setFontSize(10);
    doc.setFont('courier', 'italic');
    doc.text('Generated by MenuFy - Restaurant Management System', pageWidth / 2, 280, {
      align: 'center',
    });
    doc.text(`www.menufy.com | Contact: support@menufy.com`, pageWidth / 2, 285, {
      align: 'center',
    });
  
    // Save PDF
    doc.save(`Complaint_${complaint._id}_Report.pdf`);
  };

  // Form Validation
  const validateForm = (data) => {
    const errors = {};
    if (!data.status) errors.status = 'Status is required';
    if (!data.priority) errors.priority = 'Priority is required';
    if (!data.category) errors.category = 'Category is required';
    if (data.response && !['Refund', 'Replacement', 'Apology', 'Discount', 'No Action'].includes(data.response)) {
      errors.response = 'Invalid response value';
    }
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
    setImageUrls([]);
    setValidationErrors({});
  };
  // Modify handleShowEditModal to track original complaint
  const handleShowEditModal = (complaint) => {
    setSelectedComplaint(complaint);
    setOriginalComplaint(complaint); // Store original data
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
      const matchesCategory = categoryFilter ? c.category === categoryFilter : true;
      return matchesStatus && matchesPriority && matchesCategory;
    });
  }, [complaints, statusFilter, priorityFilter, categoryFilter]);

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

  // Render Conditions
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
      <div className="d-flex justify-content-between align-items-center mb-4 px-3 flex-wrap gap-2">
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
            {categoryFilter ? `Category: ${categoryFilter}` : 'Filter by Category'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setCategoryFilter('')}>All</Dropdown.Item>
            {['Food Quality', 'Service', 'Cleanliness', 'Billing', 'Other'].map((category) => (
              <Dropdown.Item key={category} onClick={() => setCategoryFilter(category)}>
                {category}
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
            <Dropdown.Item onClick={() => requestSort('category')}>Category</Dropdown.Item> {/* Added */}
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
                    onClick={() => requestSort('category')}
                    style={{ cursor: 'pointer' }}
                    className="text-center"
                  >
                    Category{' '}
                    {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => requestSort('status')}
                    style={{ cursor: 'pointer' }}
                    className="text-center"
                  >
                    Status{' '}
                    {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => requestSort('priority')}
                    style={{ cursor: 'pointer' }}
                    className="text-center"
                  >
                    Priority{' '}
                    {sortConfig.key === 'priority' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => requestSort('createdAt')}
                    style={{ cursor: 'pointer' }}
                    className="text-center"
                  >
                    Created At{' '}
                    {sortConfig.key === 'createdAt' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedComplaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>{complaint.title || 'N/A'}</td>
                    <td>{complaint.user?.email || 'N/A'}</td>
                    <td>{complaint.restaurant?.name || 'N/A'}</td>
                    <td>{complaint.category || 'N/A'}</td>
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
                  <strong>User:</strong> {selectedComplaint.user?.email || 'N/A'}
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
                  <strong>Category:</strong> {selectedComplaint.category || 'N/A'}
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
              <div className="col-md-6 mb-3">
                <p>
                  <strong>Updated At:</strong>{' '}
                  {new Date(selectedComplaint.updatedAt).toLocaleString() || 'N/A'}
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
              
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailModal} disabled={loading}>
            Close
          </Button>
          <Button 
    variant="danger" 
    onClick={() => generateComplaintPDF(selectedComplaint)}
    disabled={!selectedComplaint || loading}
  >
    <i className="fas fa-file-pdf me-2" /> Generate PDF
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
                <Form.Group className="col-md-6 mb-3" controlId="editResponse">
                  <Form.Label>Response</Form.Label>
                  <Form.Select
                    value={selectedComplaint.response || ''}
                    onChange={(e) =>
                      setSelectedComplaint({
                        ...selectedComplaint,
                        response: e.target.value === '' ? null : e.target.value,
                      })
                    }
                    isInvalid={!!validationErrors.response}
                  >
                    <option value="">No Response</option>
                    {['Refund', 'Replacement', 'Apology', 'Discount', 'No Action'].map((response) => (
                      <option key={response} value={response}>
                        {response}
                      </option>
                    ))}
                  </Form.Select>
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