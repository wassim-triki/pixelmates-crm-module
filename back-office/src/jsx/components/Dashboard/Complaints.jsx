import React, { useEffect, useState, useMemo } from 'react';
import {
  Dropdown,
  Modal,
  Button,
  Form,
  Alert,
  Spinner,
  Badge,
} from 'react-bootstrap';
import { formatError } from '../../../services/AuthService.js';
import { useAuth } from '../../../context/authContext';
import jsPDF from 'jspdf';
import AnalyticsModal from './AnalyticsModal';
import {
  getComplaints,
  getComplaintsByRestaurant,
  updateComplaint,
  sendResolvedSMS,
} from '../../../services/ComplaintService.js';

const ComplaintList = () => {
  const { user } = useAuth();

  // State Management
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'descending',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [originalComplaint, setOriginalComplaint] = useState(null);

  const itemsPerPage = 10;

  // Fetch Complaints based on user role
  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;

      if (user?.role?.name === 'Admin' && user?.restaurant?._id) {
        console.log(
          'Admin user fetching complaints for restaurant:',
          user.restaurant._id
        );
        response = await getComplaintsByRestaurant(user.restaurant._id);
      } else {
        console.log('SuperAdmin fetching all complaints');
        response = await getComplaints();
      }

      console.log(
        'Complaints fetched:',
        response.data?.length || 0,
        'complaints'
      );
      setComplaints(response.data || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError(formatError(err) || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchComplaints();
    }
  }, [user]);

  // Search Complaints
  const handleSearch = async (term) => {
    setLoading(true);
    setError(null);
    try {
      let response;

      if (user?.role?.name === 'Admin' && user?.restaurant?._id) {
        console.log(
          'Admin searching complaints for restaurant:',
          user.restaurant._id
        );
        response = await getComplaintsByRestaurant(user.restaurant._id);
      } else {
        console.log('SuperAdmin searching all complaints');
        response = await getComplaints();
      }

      const allComplaints = response.data || [];
      console.log('Total complaints before filtering:', allComplaints.length);

      const filteredComplaints = allComplaints.filter((c) => {
        const lowerTerm = term.toLowerCase();
        return (
          (c.title && c.title.toLowerCase().includes(lowerTerm)) ||
          (c.description && c.description.toLowerCase().includes(lowerTerm)) ||
          (c.category && c.category.toLowerCase().includes(lowerTerm)) ||
          (c.user?.name && c.user.name.toLowerCase().includes(lowerTerm)) ||
          (c.user?.email && c.user.email.toLowerCase().includes(lowerTerm)) ||
          (c.restaurant?.name &&
            c.restaurant.name.toLowerCase().includes(lowerTerm))
        );
      });

      console.log('Filtered complaints:', filteredComplaints.length);
      setComplaints(filteredComplaints);
      setCurrentPage(0);
    } catch (err) {
      console.error('Search error:', err);
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
      // Ensure valid values for status, priority, and category
      const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Closed'];
      const validPriorities = ['Low', 'Medium', 'High'];
      const validCategories = [
        'Food Quality',
        'Service',
        'Cleanliness',
        'Billing',
        'Other',
      ];
      const validResponses = [
        'Refund',
        'Replacement',
        'Apology',
        'Discount',
        'No Action',
        null,
      ];

      if (!validStatuses.includes(selectedComplaint.status)) {
        throw new Error('Invalid status value');
      }
      if (!validPriorities.includes(selectedComplaint.priority)) {
        throw new Error('Invalid priority value');
      }
      if (!validCategories.includes(selectedComplaint.category)) {
        throw new Error('Invalid category value');
      }
      if (
        selectedComplaint.response &&
        !validResponses.includes(selectedComplaint.response)
      ) {
        throw new Error('Invalid response value');
      }

      // Get status note if status is changing
      let statusNote = '';
      if (
        originalComplaint &&
        originalComplaint.status !== selectedComplaint.status
      ) {
        statusNote = `Status changed from ${originalComplaint.status} to ${selectedComplaint.status}`;
      }

      // Update complaint
      await updateComplaint(
        {
          status: selectedComplaint.status,
          priority: selectedComplaint.priority,
          category: selectedComplaint.category,
          response: selectedComplaint.response || undefined, // Allow null
        },
        selectedComplaint._id,
        user?._id,
        statusNote
      );

      // Check if status changed to Resolved
      if (
        originalComplaint &&
        originalComplaint.status !== 'Resolved' &&
        selectedComplaint.status === 'Resolved'
      ) {
        try {
          await sendResolvedSMS(selectedComplaint._id);
        } catch (smsError) {
          console.error('Failed to send SMS:', smsError);
          setError(
            `Complaint updated, but failed to send SMS: ${formatError(
              smsError
            )}`
          );
        }
      }

      await fetchComplaints();
      handleCloseEditModal();
    } catch (err) {
      console.error('Update error:', err);
      setError(formatError(err) || 'Failed to update complaint');
    } finally {
      setLoading(false);
    }
  };

  const generateComplaintPDF = (complaint) => {
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 30;

    // Define colors
    const primaryColor = [250, 128, 114]; // #006DEF - Blue
    const secondaryColor = [250, 128, 114]; // #FA8072 - Salmon
    const textColor = [51, 51, 51]; // #333333 - Dark Gray

    // Set default text color
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    // Add header with blue background
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 30, 'F');

    // Add document title
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255); // White
    doc.setFontSize(22);
    doc.text('COMPLAINT REPORT', pageWidth - 15, 20, { align: 'right' });

    // Reset text color
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    // Add complaint ID and date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Report generated on: ${new Date().toLocaleDateString()}`,
      15,
      40
    );
    doc.setFont('helvetica', 'bold');
    doc.text(`Complaint ID: ${complaint._id}`, pageWidth - 15, 40, {
      align: 'right',
    });

    // Add status badge
    doc.setFillColor(
      complaint.status === 'Resolved'
        ? 40
        : complaint.status === 'In Progress'
        ? 255
        : complaint.status === 'Pending'
        ? 220
        : 108,
      complaint.status === 'Resolved'
        ? 167
        : complaint.status === 'In Progress'
        ? 193
        : complaint.status === 'Pending'
        ? 53
        : 117,
      complaint.status === 'Resolved'
        ? 69
        : complaint.status === 'In Progress'
        ? 7
        : complaint.status === 'Pending'
        ? 69
        : 125
    );
    doc.rect(15, 45, 40, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(complaint.status || 'N/A', 35, 51, { align: 'center' });
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    // Add priority badge
    doc.setFillColor(
      complaint.priority === 'High'
        ? 220
        : complaint.priority === 'Medium'
        ? 255
        : complaint.priority === 'Low'
        ? 40
        : 108,
      complaint.priority === 'High'
        ? 53
        : complaint.priority === 'Medium'
        ? 193
        : complaint.priority === 'Low'
        ? 167
        : 117,
      complaint.priority === 'High'
        ? 69
        : complaint.priority === 'Medium'
        ? 7
        : complaint.priority === 'Low'
        ? 69
        : 125
    );
    doc.rect(60, 45, 40, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(complaint.priority || 'N/A', 80, 51, { align: 'center' });
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    // Add summary section
    doc.setFillColor(240, 240, 240); // Light gray
    doc.rect(15, 60, pageWidth - 30, 25, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(complaint.title || 'N/A', pageWidth / 2, 70, {
      align: 'center',
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(
      `Restaurant: ${complaint.restaurant?.name || 'N/A'} | Category: ${
        complaint.category || 'N/A'
      }`,
      pageWidth / 2,
      80,
      { align: 'center' }
    );

    // Add complaint details section
    yPos = 95;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Complaint Details', 15, yPos);
    yPos += 10;

    // Create details table manually
    const details = [
      { label: 'Customer', value: complaint.user?.email || 'N/A' },
      {
        label: 'Customer Name',
        value: `${complaint.user?.firstName || ''} ${
          complaint.user?.lastName || ''
        }`,
      },
      { label: 'Phone', value: complaint.user?.phone || 'N/A' },
      {
        label: 'Created Date',
        value: new Date(complaint.createdAt).toLocaleString(),
      },
      {
        label: 'Last Updated',
        value: new Date(complaint.updatedAt).toLocaleString(),
      },
      { label: 'Category', value: complaint.category || 'N/A' },
    ];

    // Draw details
    details.forEach((item, index) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(item.label + ':', 15, yPos);

      doc.setFont('helvetica', 'normal');
      doc.text(item.value, 60, yPos);

      yPos += 8;

      // Add spacing after every 3 items
      if ((index + 1) % 3 === 0) yPos += 5;
    });

    yPos += 10;

    // Add description section
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(15, yPos - 5, pageWidth - 30, 0.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('Description', 15, yPos + 5);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    yPos += 15;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    const descriptionText = complaint.description || 'No description provided';
    const splitDescription = doc.splitTextToSize(descriptionText, pageWidth - 30);

    doc.text(splitDescription, 15, yPos);

    yPos += splitDescription.length * 7 + 15;

    // Check if we need a new page
    if (yPos > pageHeight - 50) {
      doc.addPage();
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text('Complaint Report - Continued', pageWidth / 2, 10, {
        align: 'center',
      });
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      yPos = 30;
    }

    // Add response section
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(15, yPos - 5, pageWidth - 30, 0.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('Official Response', 15, yPos + 5);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    yPos += 15;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    const responseText = complaint.response || 'No official response yet';
    const splitResponse = doc.splitTextToSize(responseText, pageWidth - 30);

    doc.text(splitResponse, 15, yPos);

    yPos += splitResponse.length * 7 + 15;

    // Add comments section if available
    if (complaint.comments && complaint.comments.length > 0) {
      // Check if we need a new page
      if (yPos > pageHeight - 50) {
        doc.addPage();
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, pageWidth, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text('Complaint Report - Continued', pageWidth / 2, 10, {
          align: 'center',
        });
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        yPos = 30;
      }

      doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.rect(15, yPos - 5, pageWidth - 30, 0.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('Comments', 15, yPos + 5);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      yPos += 15;

      // Add comments manually
      complaint.comments.forEach((comment, index) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(
          `${new Date(comment.createdAt).toLocaleDateString()} - ${
            comment.user?.name || 'Unknown'
          }:`,
          15,
          yPos
        );

        yPos += 7;

        doc.setFont('helvetica', 'normal');
        const commentText = doc.splitTextToSize(comment.text, pageWidth - 40);
        doc.text(commentText, 20, yPos);

        yPos += commentText.length * 7 + 10;

        // Check if we need a new page for next comment
        if (index < complaint.comments.length - 1 && yPos > pageHeight - 30) {
          doc.addPage();
          doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.rect(0, 0, pageWidth, 15, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.text('Complaint Report - Continued', pageWidth / 2, 10, {
            align: 'center',
          });
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          yPos = 30;
        }
      });
    }

    // Add footer to all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Footer line
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(15, pageHeight - 30, pageWidth - 15, pageHeight - 30);

      // Footer text
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(
        'Generated by MenuFy - Restaurant Management System',
        pageWidth / 2,
        pageHeight - 22,
        { align: 'center' }
      );
      doc.text(
        `www.menufy.com | Contact: support@menufy.com | Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 17,
        { align: 'center' }
      );
    }

    // Save PDF
    doc.save(`Complaint_${complaint._id}_Report.pdf`);
  };

  // Form Validation
  const validateForm = (data) => {
    const errors = {};
    if (!data.status) errors.status = 'Status is required';
    if (!data.priority) errors.priority = 'Priority is required';
    if (!data.category) errors.category = 'Category is required';
    if (
      data.response &&
      !['Refund', 'Replacement', 'Apology', 'Discount', 'No Action'].includes(
        data.response
      )
    ) {
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
    setValidationErrors({});
  };

  const handleShowEditModal = (complaint) => {
    setSelectedComplaint(complaint);
    setOriginalComplaint(complaint);
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
      const matchesPriority = priorityFilter
        ? c.priority === priorityFilter
        : true;
      const matchesCategory = categoryFilter
        ? c.category === categoryFilter
        : true;
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
      direction:
        prev.key === key && prev.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    }));
  };

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
        <div
          className="flex-grow-1 mx-3"
          style={{ maxWidth: '300px', minWidth: '200px' }}
        >
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
            <Dropdown.Item onClick={() => setStatusFilter('')}>
              All
            </Dropdown.Item>
            {['Pending', 'In Progress', 'Resolved', 'Closed'].map((status) => (
              <Dropdown.Item
                key={status}
                onClick={() => setStatusFilter(status)}
              >
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
            {priorityFilter
              ? `Priority: ${priorityFilter}`
              : 'Filter by Priority'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setPriorityFilter('')}>
              All
            </Dropdown.Item>
            {['Low', 'Medium', 'High'].map((priority) => (
              <Dropdown.Item
                key={priority}
                onClick={() => setPriorityFilter(priority)}
              >
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
            {categoryFilter
              ? `Category: ${categoryFilter}`
              : 'Filter by Category'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setCategoryFilter('')}>
              All
            </Dropdown.Item>
            {['Food Quality', 'Service', 'Cleanliness', 'Billing', 'Other'].map(
              (category) => (
                <Dropdown.Item
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </Dropdown.Item>
              )
            )}
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
              ? `Sort By: ${
                  sortConfig.key.charAt(0).toUpperCase() +
                  sortConfig.key.slice(1)
                }`
              : 'Sort By'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => requestSort('title')}>
              Title
            </Dropdown.Item>
            <Dropdown.Item onClick={() => requestSort('status')}>
              Status
            </Dropdown.Item>
            <Dropdown.Item onClick={() => requestSort('priority')}>
              Priority
            </Dropdown.Item>
            <Dropdown.Item onClick={() => requestSort('category')}>
              Category
            </Dropdown.Item>
            <Dropdown.Item onClick={() => requestSort('createdAt')}>
              Created Date
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="d-flex justify-content-between align-items-center pt-4 mb-4">
        <h1 className="fw-bold">Complaints List</h1>
        <Button
          variant="info"
          className="d-flex align-items-center gap-2"
          onClick={() => setShowAnalyticsModal(true)}
        >
          <i className="fas fa-chart-bar"></i>
          <span>View Analytics</span>
        </Button>
      </div>

      {/* Analytics Modal */}
      <AnalyticsModal
        show={showAnalyticsModal}
        onHide={() => setShowAnalyticsModal(false)}
        restaurantId={
          user?.role?.name === 'Admin' && user?.restaurant?._id
            ? user.restaurant._id
            : ''
        }
      />

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
                    {sortConfig.key === 'title' &&
                      (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="text-center">User</th>
                  <th className="text-center">Restaurant</th>
                  <th
                    onClick={() => requestSort('category')}
                    style={{ cursor: 'pointer' }}
                    className="text-center"
                  >
                    Category{' '}
                    {sortConfig.key === 'category' &&
                      (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
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
                    <td>
                      {new Date(complaint.createdAt).toLocaleDateString() ||
                        'N/A'}
                    </td>
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
              {Math.min(
                (currentPage + 1) * itemsPerPage,
                filteredComplaints.length
              )}{' '}
              of {filteredComplaints.length} entries
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
                    currentPage === i
                      ? 'btn-primary text-white'
                      : 'btn-outline-primary'
                  }`}
                  onClick={() => setCurrentPage(i)}
                  disabled={loading}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                disabled={currentPage === totalPages - 1}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={handleCloseDetailModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center fw-bold">
            Complaint Details
          </Modal.Title>
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
                  <strong>User:</strong>{' '}
                  {selectedComplaint.user?.email || 'N/A'}
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p>
                  <strong>Restaurant:</strong>{' '}
                  {selectedComplaint.restaurant?.name || 'N/A'} (
                  {selectedComplaint.restaurant?.address || 'N/A'})
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p>
                  <strong>Category:</strong>{' '}
                  {selectedComplaint.category || 'N/A'}
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
                  {new Date(selectedComplaint.createdAt).toLocaleString() ||
                    'N/A'}
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p>
                  <strong>Updated At:</strong>{' '}
                  {new Date(selectedComplaint.updatedAt).toLocaleString() ||
                    'N/A'}
                </p>
              </div>
              <div className="col-md-12 mb-3">
                <p>
                  <strong>Description:</strong>{' '}
                  {selectedComplaint.description || 'N/A'}
                </p>
              </div>
              <div className="col-md-12 mb-3">
                <p>
                  <strong>Response:</strong>{' '}
                  {selectedComplaint.response || 'No response yet'}
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
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                        }}
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
          <Button
            variant="secondary"
            onClick={handleCloseDetailModal}
            disabled={loading}
          >
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
      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center fw-bold">
            Edit Complaint
          </Modal.Title>
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
                      setSelectedComplaint({
                        ...selectedComplaint,
                        status: e.target.value,
                      })
                    }
                    isInvalid={!!validationErrors.status}
                  >
                    <option value="">Select Status</option>
                    {['Pending', 'In Progress', 'Resolved', 'Closed'].map(
                      (status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      )
                    )}
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
                      setSelectedComplaint({
                        ...selectedComplaint,
                        priority: e.target.value,
                      })
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
                <Form.Group className="col-md-6 mb-3" controlId="editCategory">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={selectedComplaint.category || ''}
                    onChange={(e) =>
                      setSelectedComplaint({
                        ...selectedComplaint,
                        category: e.target.value,
                      })
                    }
                    isInvalid={!!validationErrors.category}
                  >
                    <option value="">Select Category</option>
                    {[
                      'Food Quality',
                      'Service',
                      'Cleanliness',
                      'Billing',
                      'Other',
                    ].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.category}
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
                    {[
                      'Refund',
                      'Replacement',
                      'Apology',
                      'Discount',
                      'No Action',
                    ].map((response) => (
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
          <Button
            variant="secondary"
            onClick={handleCloseEditModal}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateComplaint}
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ComplaintList;