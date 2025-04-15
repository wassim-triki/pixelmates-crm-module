import React, { useEffect, useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Dropdown, Modal, Button, Form, Alert, Spinner, Pagination } from 'react-bootstrap';
import { getCurrentUser, formatError } from '../../../services/AuthService.js'; // Adjust path
import {
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
} from '../../../services/RestaurantService.js'; // Adjust path

const RestaurantList = () => {
  // State Management (unchanged)
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    address: '',
    cuisineType: '',
    taxeTPS: '',
    taxeTVQ: '',
    color: '',
    logo: '',
    promotion: '',
    payCashMethod: '',
    images: [],
  });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [validationErrors, setValidationErrors] = useState({});

  const itemsPerPage = 5;

  // Authentication Check (unchanged)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        const user = response.data;
        setCurrentUser(user);
        if (user && user.role?.name === 'SuperAdmin') {
          await fetchRestaurants();
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

  // Fetch Restaurants (unchanged)
  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRestaurants();
      setRestaurants(response.data.restaurants || []);
    } catch (err) {
      setError(formatError(err) || 'Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  // Search Restaurants (unchanged)
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!searchTerm.trim()) {
        await fetchRestaurants();
      } else {
        const response = await searchRestaurants(searchTerm);
        setRestaurants(response.data.restaurants || []);
        setCurrentPage(1);
      }
    } catch (err) {
      setError(formatError(err) || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Delete Restaurant (unchanged)
  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;
    setLoading(true);
    setError(null);
    try {
      await deleteRestaurant(id);
      setRestaurants(restaurants.filter((r) => r._id !== id));
    } catch (err) {
      setError(formatError(err) || 'Failed to delete restaurant');
    } finally {
      setLoading(false);
    }
  };

  // Create Restaurant (unchanged)
  const handleCreateRestaurant = async () => {
    const errors = validateForm(newRestaurant);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await createRestaurant(newRestaurant);
      await fetchRestaurants();
      handleCloseCreateModal();
    } catch (err) {
      setError(formatError(err) || 'Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

  // Update Restaurant (unchanged)
  const handleUpdateRestaurant = async () => {
    if (!window.confirm('Are you sure you want to update this restaurant?')) return;

    const errors = validateForm(selectedRestaurant);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await updateRestaurant(selectedRestaurant, selectedRestaurant._id);
      await fetchRestaurants();
      handleCloseEditModal();
    } catch (err) {
      setError(formatError(err) || 'Failed to update restaurant');
    } finally {
      setLoading(false);
    }
  };

  // Form Validation (unchanged)
  const validateForm = (data) => {
    const errors = {};
    const hexColorRegex = /^[0-9A-Fa-f]{6}$/;
    const numberRegex = /^\d+(\.\d+)?$/;
    const urlRegex = /^(https?:\/\/[^\s]+)/;

    if (!data.name) errors.name = 'Name is required';
    if (!data.address) errors.address = 'Address is required';
    if (!data.cuisineType) errors.cuisineType = 'Cuisine Type is required';
    if (!data.taxeTPS) errors.taxeTPS = 'Taxe TPS is required';
    else if (!numberRegex.test(data.taxeTPS)) errors.taxeTPS = 'Must be a valid number';
    if (!data.taxeTVQ) errors.taxeTVQ = 'Taxe TVQ is required';
    else if (!numberRegex.test(data.taxeTVQ)) errors.taxeTVQ = 'Must be a valid number';
    if (!data.color) errors.color = 'Color is required';
    else if (!hexColorRegex.test(data.color)) errors.color = 'Must be a 6-digit hex code (e.g., FF5733)';
    if (!data.logo) errors.logo = 'Logo URL is required';
    else if (!urlRegex.test(data.logo)) errors.logo = 'Must be a valid URL';
    if (!data.promotion) errors.promotion = 'Promotion is required';
    if (!data.payCashMethod) errors.payCashMethod = 'Pay Cash Method is required';

    return errors;
  };

  // Modal Handlers (unchanged)
  const handleShowDetailModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedRestaurant(null);
  };

  const handleShowEditModal = (restaurant) => {
    setSelectedRestaurant({
      ...restaurant,
      taxeTPS: restaurant.taxeTPS?.replace('%', '') || '',
      taxeTVQ: restaurant.taxeTVQ?.replace('%', '') || '',
      color: restaurant.color?.replace('#', '') || '',
    });
    setShowEditModal(true);
    setValidationErrors({});
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedRestaurant(null);
    setValidationErrors({});
  };

  const handleShowCreateModal = () => {
    setShowCreateModal(true);
    setValidationErrors({});
  };

  const handleCloseCreateModal = () => {
    setNewRestaurant({
      name: '',
      address: '',
      cuisineType: '',
      taxeTPS: '',
      taxeTVQ: '',
      color: '',
      logo: '',
      promotion: '',
      payCashMethod: '',
      images: [],
    });
    setShowCreateModal(false);
    setValidationErrors({});
  };

  // Sorting and Pagination (unchanged)
  const sortedRestaurants = useMemo(() => {
    const sorted = [...restaurants].sort((a, b) => {
      const keyA = a[sortConfig.key] || '';
      const keyB = b[sortConfig.key] || '';
      return sortConfig.direction === 'ascending'
        ? keyA.localeCompare(keyB)
        : keyB.localeCompare(keyA);
    });
    return sorted;
  }, [restaurants, sortConfig]);

  const paginatedRestaurants = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedRestaurants.slice(start, start + itemsPerPage);
  }, [sortedRestaurants, currentPage]);

  const totalPages = Math.ceil(restaurants.length / itemsPerPage);

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  // Render Conditions (unchanged)
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
      {/* Error Alert (unchanged) */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Header Section (unchanged) */}
  {/* Header Section */}
<div className="d-flex justify-content-between align-items-center mb-4 px-3">
  <Button 
    variant="success" 
    onClick={handleShowCreateModal} 
    disabled={loading}
    className="d-flex align-items-center"
  >
    <i className="fas fa-plus me-2" /> Add Restaurant
  </Button>
</div>

{/* Search and Sort Section */}
<div className="row mb-4 px-3 g-3">
  <div className="col-md-6 col-12">
    <div className="input-group shadow-sm ">
      <span className="input-group-text bg-light border-0">
        <i className="fas fa-search " />
      </span>
      <input
        type="text"
        className="form-control border-0 bg-light"
        placeholder="Search by name, address, or cuisine..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        disabled={loading}
      />
      <Button 
        variant="primary" 
        onClick={handleSearch} 
        disabled={loading}
        className="px-4"
      >
        Search
      </Button>
    </div>
  </div>
  <div className="col-md-6 col-12 d-flex justify-content-md-end justify-content-start align-items-center mt-md-0 mt-3">
    <Dropdown>
      <Dropdown.Toggle 
        variant="outline-primary" 
        disabled={loading}
        className="shadow-sm"
      >
        Sort By: {sortConfig.key.charAt(0).toUpperCase() + sortConfig.key.slice(1)} ({sortConfig.direction})
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => requestSort('name')}>Name</Dropdown.Item>
        <Dropdown.Item onClick={() => requestSort('address')}>Address</Dropdown.Item>
        <Dropdown.Item onClick={() => requestSort('cuisineType')}>
          Cuisine Type
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>
</div>
<h1 className="text-center fw-bold">Restaurants List</h1>
<br></br>

      {/* Restaurant Table (unchanged) */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading restaurants...</p>
        </div>
      ) : restaurants.length === 0 ? (
        <Alert variant="info">No restaurants found.</Alert>
      ) : (
        <>
         <div className="table-responsive">
  <table className="table table-hover table-bordered">
    <thead className="table-main">
      <tr>
        <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}className="text-center">
          Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
        </th>
        <th onClick={() => requestSort('address')} style={{ cursor: 'pointer' }}className="text-center">
          Address {sortConfig.key === 'address' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
        </th>
        <th onClick={() => requestSort('cuisineType')} style={{ cursor: 'pointer' }}className="text-center">
          Cuisine Type {sortConfig.key === 'cuisineType' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
        </th>
        <th className="text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {paginatedRestaurants.map((restaurant) => (
        <tr key={restaurant._id}>
          <td>{restaurant.name || 'N/A'}</td>
          <td>{restaurant.address || 'N/A'}</td>
          <td>{restaurant.cuisineType || 'N/A'}</td>
          <td className="text-center">
            <Button
              variant="outline-primary"
              size="sm"
              className="me-2"
              style={{ backgroundColor: '#0d6efd', color: 'white' }}
              onClick={() => handleShowDetailModal(restaurant)}
              disabled={loading}
            >
              <i className="fas fa-eye" />
            </Button>
            <Button
              variant="outline-warning"
              size="sm"
              className="me-2"
              style={{ backgroundColor: '#ffc107', color: 'black' }}

              onClick={() => handleShowEditModal(restaurant)}
              disabled={loading}
            >
              <i className="fas fa-edit" />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              style={{ backgroundColor: '#dc3545', color: 'white' }}
              onClick={() => handleDeleteRestaurant(restaurant._id)}
              disabled={loading}
            >
              <i className="fas fa-trash" />
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
          {/* Pagination (unchanged) */}
          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-3">
              <Pagination.Prev
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
              />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                  disabled={loading}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
              />
            </Pagination>
          )}
          <div className="text-muted mt-2">
            Showing {paginatedRestaurants.length} of {restaurants.length} restaurants
          </div>
        </>
      )}

      {/* Detail Modal (Horizontal Layout - 2 Columns) */}
      <Modal show={showDetailModal} onHide={handleCloseDetailModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center fw-bold">Restaurant Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRestaurant && (
            <div className="text-center mb-3">
              <img
                src={selectedRestaurant.logo || 'https://via.placeholder.com/100'}
                alt="Restaurant Logo"
                className="rounded-circle mb-3"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </div>
          )}
          {selectedRestaurant && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <p><strong>Name:</strong> {selectedRestaurant.name || 'N/A'}</p>
              </div>
              <div className="col-md-6 mb-3">
                <p><strong>Address:</strong> {selectedRestaurant.address || 'N/A'}</p>
              </div>
              <div className="col-md-6 mb-3">
                <p><strong>Cuisine Type:</strong> {selectedRestaurant.cuisineType || 'N/A'}</p>
              </div>
              <div className="col-md-6 mb-3">
                <p><strong>Taxe TPS:</strong> {selectedRestaurant.taxeTPS || 'N/A'}</p>
              </div>
              <div className="col-md-6 mb-3">
                <p><strong>Taxe TVQ:</strong> {selectedRestaurant.taxeTVQ || 'N/A'}</p>
              </div>
              <div className="col-md-6 mb-3">
                <p><strong>Color:</strong> {selectedRestaurant.color ? (
                  <span>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '15px',
                        height: '15px',
                        backgroundColor: `#${selectedRestaurant.color}`,
                        marginRight: '5px',
                        verticalAlign: 'middle',
                      }}
                    />
                    #{selectedRestaurant.color}
                  </span>
                ) : 'N/A'}</p>
              </div>
              <div className="col-md-6 mb-3">
                <p><strong>Promotion:</strong> {selectedRestaurant.promotion || 'N/A'}</p>
              </div>
              <div className="col-md-6 mb-3">
                <p><strong>Pay Cash Method:</strong> {selectedRestaurant.payCashMethod || 'N/A'}</p>
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

      {/* Edit Modal (Horizontal Layout - 3 Columns) */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center fw-bold">Edit Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRestaurant && (
            <Form>
              <div className="row">
                <Form.Group className="col-md-4 mb-3" controlId="editName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedRestaurant.name || ''}
                    onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, name: e.target.value })}
                    isInvalid={!!validationErrors.name}
                  />
                  <Form.Control.Feedback type="invalid">{validationErrors.name}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4 mb-3" controlId="editAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedRestaurant.address || ''}
                    onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, address: e.target.value })}
                    isInvalid={!!validationErrors.address}
                  />
                  <Form.Control.Feedback type="invalid">{validationErrors.address}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4 mb-3" controlId="editCuisineType">
                  <Form.Label>Cuisine Type</Form.Label>
                  <Form.Select
                    value={selectedRestaurant.cuisineType || ''}
                    onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, cuisineType: e.target.value })}
                    isInvalid={!!validationErrors.cuisineType}
                  >
                    <option value="">Select Cuisine Type</option>
                    {['Italian', 'Mexican', 'Asian', 'French', 'American', 'Fusion', 'Other'].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{validationErrors.cuisineType}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4 mb-3" controlId="editTaxeTPS">
                  <Form.Label>Taxe TPS (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.001"
                    value={selectedRestaurant.taxeTPS || ''}
                    onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, taxeTPS: e.target.value })}
                    isInvalid={!!validationErrors.taxeTPS}
                  />
                  <Form.Control.Feedback type="invalid">{validationErrors.taxeTPS}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4 mb-3" controlId="editTaxeTVQ">
                  <Form.Label>Taxe TVQ (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.001"
                    value={selectedRestaurant.taxeTVQ || ''}
                    onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, taxeTVQ: e.target.value })}
                    isInvalid={!!validationErrors.taxeTVQ}
                  />
                  <Form.Control.Feedback type="invalid">{validationErrors.taxeTVQ}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4 mb-3" controlId="editColor">
                  <Form.Label>Color (Hex)</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedRestaurant.color || ''}
                    onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, color: e.target.value })}
                    maxLength={6}
                    placeholder="e.g., FF5733"
                    isInvalid={!!validationErrors.color}
                  />
                  <Form.Control.Feedback type="invalid">{validationErrors.color}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4 mb-3" controlId="editLogo">
                  <Form.Label>Logo URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={selectedRestaurant.logo || ''}
                    onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, logo: e.target.value })}
                    isInvalid={!!validationErrors.logo}
                  />
                  <Form.Control.Feedback type="invalid">{validationErrors.logo}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4 mb-3" controlId="editPromotion">
                  <Form.Label>Promotion</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedRestaurant.promotion || ''}
                    onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, promotion: e.target.value })}
                    isInvalid={!!validationErrors.promotion}
                  />
                  <Form.Control.Feedback type="invalid">{validationErrors.promotion}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4 mb-3" controlId="editPayCashMethod">
                  <Form.Label>Pay Cash Method</Form.Label>
                  <Form.Select
                    value={selectedRestaurant.payCashMethod || ''}
                    onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, payCashMethod: e.target.value })}
                    isInvalid={!!validationErrors.payCashMethod}
                  >
                    <option value="">Select Pay Cash Method</option>
                    {['accepted', 'not-accepted', 'on-request'].map((method) => (
                      <option key={method} value={method}>{method.replace('-', ' ')}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{validationErrors.payCashMethod}</Form.Control.Feedback>
                </Form.Group>
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateRestaurant} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create Modal (Horizontal Layout - 3 Columns) */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center fw-bold">Add New Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <Form.Group className="col-md-4 mb-3" controlId="createName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newRestaurant.name}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                  isInvalid={!!validationErrors.name}
                />
                <Form.Control.Feedback type="invalid">{validationErrors.name}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4 mb-3" controlId="createAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={newRestaurant.address}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
                  isInvalid={!!validationErrors.address}
                />
                <Form.Control.Feedback type="invalid">{validationErrors.address}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4 mb-3" controlId="createCuisineType">
                <Form.Label>Cuisine Type</Form.Label>
                <Form.Select
                  value={newRestaurant.cuisineType}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, cuisineType: e.target.value })}
                  isInvalid={!!validationErrors.cuisineType}
                >
                  <option value="">Select Cuisine Type</option>
                  {['Italian', 'Mexican', 'Asian', 'French', 'American', 'Fusion', 'Other'].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{validationErrors.cuisineType}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4 mb-3" controlId="createTaxeTPS">
                <Form.Label>Taxe TPS (%)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.001"
                  value={newRestaurant.taxeTPS}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, taxeTPS: e.target.value })}
                  isInvalid={!!validationErrors.taxeTPS}
                />
                <Form.Control.Feedback type="invalid">{validationErrors.taxeTPS}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4 mb-3" controlId="createTaxeTVQ">
                <Form.Label>Taxe TVQ (%)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.001"
                  value={newRestaurant.taxeTVQ}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, taxeTVQ: e.target.value })}
                  isInvalid={!!validationErrors.taxeTVQ}
                />
                <Form.Control.Feedback type="invalid">{validationErrors.taxeTVQ}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4 mb-3" controlId="createColor">
                <Form.Label>Color (Hex)</Form.Label>
                <Form.Control
                  type="text"
                  value={newRestaurant.color}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, color: e.target.value })}
                  maxLength={6}
                  placeholder="e.g., FF5733"
                  isInvalid={!!validationErrors.color}
                />
                <Form.Control.Feedback type="invalid">{validationErrors.color}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4 mb-3" controlId="createLogo">
                <Form.Label>Logo URL</Form.Label>
                <Form.Control
                  type="url"
                  value={newRestaurant.logo}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, logo: e.target.value })}
                  isInvalid={!!validationErrors.logo}
                />
                <Form.Control.Feedback type="invalid">{validationErrors.logo}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4 mb-3" controlId="createPromotion">
                <Form.Label>Promotion</Form.Label>
                <Form.Control
                  type="text"
                  value={newRestaurant.promotion}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, promotion: e.target.value })}
                  isInvalid={!!validationErrors.promotion}
                />
                <Form.Control.Feedback type="invalid">{validationErrors.promotion}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4 mb-3" controlId="createPayCashMethod">
                <Form.Label>Pay Cash Method</Form.Label>
                <Form.Select
                  value={newRestaurant.payCashMethod}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, payCashMethod: e.target.value })}
                  isInvalid={!!validationErrors.payCashMethod}
                >
                  <option value="">Select Pay Cash Method</option>
                  {['accepted', 'not-accepted', 'on-request'].map((method) => (
                    <option key={method} value={method}>{method.replace('-', ' ')}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{validationErrors.payCashMethod}</Form.Control.Feedback>
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateRestaurant} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Create Restaurant'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RestaurantList;