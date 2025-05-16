import React, { useEffect, useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Dropdown, Modal, Button, Form, Alert, Spinner, Pagination } from 'react-bootstrap';
import { getCurrentUser, formatError } from '../../../services/AuthService.js';
import {
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  getTablesByRestaurant,
  createTable,
  updateTable,
  deleteTable,
 
} from '../../../services/RestaurantService.js';

const RestaurantList = () => {
  // State Management
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTablesModal, setShowTablesModal] = useState(false);
  const [showTableDetailModal, setShowTableDetailModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState({
    nbtable: '',
    chairnb: '',
    shape: 'rectangle',
    location: 'center',
    view: 'none',
    features: []
  });
  const [editingTable, setEditingTable] = useState(null);
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
  const [tableValidationErrors, setTableValidationErrors] = useState({});




 

  const itemsPerPage = 10;

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

  const handleSearch = async (term) => {
    try {
      const response = await getRestaurants();
      const allRestaurants = response.data.restaurants || [];
      const filteredRestaurants = allRestaurants.filter((r) => {
        const lowerTerm = term.toLowerCase();
        return (
          (r.name && r.name.toLowerCase().includes(lowerTerm)) ||
          (r.address && r.address.toLowerCase().includes(lowerTerm)) ||
          (r.cuisineType && r.cuisineType.toLowerCase().includes(lowerTerm)) ||
          (r.color && r.color.toLowerCase().includes(lowerTerm)) ||
          (r.payCashMethod && r.payCashMethod.toLowerCase().includes(lowerTerm)) ||
          (r.taxeTPS && String(r.taxeTPS).toLowerCase().includes(lowerTerm)) ||
          (r.taxeTVQ && String(r.taxeTVQ).toLowerCase().includes(lowerTerm)) ||
          (r.promotion && r.promotion.toLowerCase().includes(lowerTerm))
        );
      });
      setRestaurants(filteredRestaurants);
      setCurrentPage(0);
    } catch (err) {
      setError(formatError(err) || 'Search failed');
    }
  };

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

  const handleCreateRestaurant = async () => {
    const errors = validateForm(newRestaurant);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const restaurantData = {
        ...newRestaurant,
        taxeTPS: newRestaurant.taxeTPS ? parseFloat(newRestaurant.taxeTPS) : undefined,
        taxeTVQ: newRestaurant.taxeTVQ ? parseFloat(newRestaurant.taxeTVQ) : undefined,
        color: newRestaurant.color || undefined,
      };
      await createRestaurant(restaurantData);
      await fetchRestaurants();
      handleCloseCreateModal();
    } catch (err) {
      setError(formatError(err) || 'Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

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
      const restaurantData = {
        name: selectedRestaurant.name?.trim() || null,
        address: selectedRestaurant.address?.trim() || null,
        cuisineType: selectedRestaurant.cuisineType || 'Other',
        taxeTPS: selectedRestaurant.taxeTPS ? `${selectedRestaurant.taxeTPS}%` : null,
        taxeTVQ: selectedRestaurant.taxeTVQ ? `${selectedRestaurant.taxeTVQ}%` : null,
        color: selectedRestaurant.color ? `#${selectedRestaurant.color.replace('#', '')}` : null,
        logo: selectedRestaurant.logo || null,
        promotion: selectedRestaurant.promotion || null,
        payCashMethod: selectedRestaurant.payCashMethod || 'not-accepted',
        images: selectedRestaurant.images || [],
      };
      await updateRestaurant(restaurantData, selectedRestaurant._id);
      await fetchRestaurants();
      handleCloseEditModal();
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      setError(formatError(err) || 'Failed to update restaurant');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (data) => {
    const errors = {};
    const hexColorRegex = /^[0-9A-Fa-f]{6}$/;
    const numberRegex = /^\d*\.?\d*$/;
    const urlRegex = /^(https?:\/\/[^\s]+)/;
    if (!data.name) errors.name = 'Name is required';
    if (!data.address) errors.address = 'Address is required';
    if (!data.cuisineType) errors.cuisineType = 'Cuisine Type is required';
    if (!data.taxeTPS && data.taxeTPS !== '0') errors.taxeTPS = 'Taxe TPS is required';
    else if (data.taxeTPS && (!numberRegex.test(data.taxeTPS) || isNaN(parseFloat(data.taxeTPS))))
      errors.taxeTPS = 'Must be a valid number';
    if (!data.taxeTVQ && data.taxeTVQ !== '0') errors.taxeTVQ = 'Taxe TVQ is required';
    else if (data.taxeTVQ && (!numberRegex.test(data.taxeTVQ) || isNaN(parseFloat(data.taxeTVQ))))
      errors.taxeTVQ = 'Must be a valid number';
    if (data.color && !hexColorRegex.test(data.color))
      errors.color = 'Must be a 6-digit hex code (e.g., FF5733)';
    if (data.logo && !urlRegex.test(data.logo)) errors.logo = 'Must be a valid URL';
    return errors;
  };

  const validateTableForm = (data) => {
    const errors = {};
    if (!data.nbtable) errors.nbtable = 'Table number is required';
    else if (isNaN(parseInt(data.nbtable)) || parseInt(data.nbtable) < 1)
      errors.nbtable = 'Must be a positive number';

    if (!data.chairnb) errors.chairnb = 'Number of chairs is required';
    else if (isNaN(parseInt(data.chairnb)) || parseInt(data.chairnb) < 1 || parseInt(data.chairnb) > 20)
      errors.chairnb = 'Must be a number between 1 and 20';

    if (!data.shape) errors.shape = 'Shape is required';
    if (!data.location) errors.location = 'Location is required';
    if (!data.view) errors.view = 'View is required';
    if (data.features && !Array.isArray(data.features)) {
      errors.features = 'Features must be an array';
    }
    return errors;
  };

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
      taxeTPS: restaurant.taxeTPS != null ? String(restaurant.taxeTPS).replace('%', '') : '',
      taxeTVQ: restaurant.taxeTVQ != null ? String(restaurant.taxeTVQ).replace('%', '') : '',
      color: restaurant.color?.startsWith('#') ? restaurant.color.replace('#', '') : restaurant.color || '',
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

  const handleShowTablesModal = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    setLoading(true);
    setError(null);
    try {
      const response = await getTablesByRestaurant(restaurant._id);
      console.log('Tables fetched from backend:', response.data); // Log des données reçues
      const tablesWithFeatures = response.data.map(table => ({
        ...table,
        features: Array.isArray(table.features) ? table.features : [],
        location: table.location || 'center',
        view: table.view || 'none',
        shape: table.shape || 'rectangle'
      }));
      setTables(tablesWithFeatures);
      setShowTablesModal(true);
    } catch (err) {
      console.error('Error fetching tables:', err); // Log d'erreur
      setError(formatError(err) || 'Failed to fetch tables');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTable = async () => {
    const errors = validateTableForm(newTable);
    if (Object.keys(errors).length > 0) {
      setTableValidationErrors(errors);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log('Creating table with data:', newTable); // Log des données envoyées
      await createTable(selectedRestaurant._id, {
        ...newTable,
        nbtable: parseInt(newTable.nbtable),
        chairnb: parseInt(newTable.chairnb),
      });
      const response = await getTablesByRestaurant(selectedRestaurant._id);
      setTables(response.data || []);
      setNewTable({
        nbtable: '',
        chairnb: '',
        shape: 'rectangle',
        location: 'center',
        view: 'none',
        features: []
      });
      setTableValidationErrors({});
    } catch (err) {
      console.error('Create table error:', err.response?.data || err.message); // Log d'erreur détaillé
      setError(formatError(err) || 'Failed to create table');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTable = async () => {
    const errors = validateTableForm(editingTable);
    if (Object.keys(errors).length > 0) {
      setTableValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Updating table with data:', editingTable);

      await updateTable(selectedRestaurant._id, editingTable._id, {
        nbtable: parseInt(editingTable.nbtable),
        chairnb: parseInt(editingTable.chairnb),
        shape: editingTable.shape,
        location: editingTable.location,
        view: editingTable.view,
        features: editingTable.features || [], // tableau de strings
      });

      const response = await getTablesByRestaurant(selectedRestaurant._id);
      setTables(response.data || []);
      setEditingTable(null);
      setTableValidationErrors({});
    } catch (err) {
      console.error('Update table error:', err.response?.data || err.message);
      setError(formatError(err) || 'Failed to update table');
    } finally {
      setLoading(false);
    }
  };


  const handleCloseTablesModal = () => {
    setShowTablesModal(false);
    setSelectedRestaurant(null);
    setTables([]);
    setNewTable({
      nbtable: '',
      chairnb: '',
      shape: 'rectangle',
      location: 'center',
      view: 'none',
      features: []
    });
    setEditingTable(null);
    setTableValidationErrors({});
  };

  const handleDeleteTable = async (tableId) => {
    if (!window.confirm('Are you sure you want to delete this table?')) return;
    setLoading(true);
    setError(null);
    try {
      await deleteTable(selectedRestaurant._id, tableId);
      const response = await getTablesByRestaurant(selectedRestaurant._id);
      setTables(response.data || []);
    } catch (err) {
      setError(formatError(err) || 'Failed to delete table');
    } finally {
      setLoading(false);
    }
  };

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
    const start = currentPage * itemsPerPage;
    return sortedRestaurants.slice(start, start + itemsPerPage);
  }, [sortedRestaurants, currentPage]);

  const totalPages = Math.ceil(restaurants.length / itemsPerPage);

  const TableDetailModal = ({ table, onHide }) => (
    <Modal show={!!table} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Table Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-6 mb-3">
            <strong>Number:</strong> {table?.nbtable}
          </div>
          <div className="col-6 mb-3">
            <strong>Chairs:</strong> {table?.chairnb}
          </div>
          <div className="col-6 mb-3">
            <strong>Shape:</strong> {table?.shape}
          </div>
          <div className="col-6 mb-3">
            <strong>Location:</strong> {table?.location}
          </div>
          <div className="col-6 mb-3">
            <strong>View:</strong> {table?.view}
          </div>
          <div className="col-12 mb-3">
            <strong>Features:</strong> {table?.features?.join(', ') || 'None'}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderTables = () => (
    <div className="table-responsive">
      <table className="table table-hover table-bordered">
        <thead className="table-main">
          <tr>
            <th className="text-center">Table Number</th>
            <th className="text-center">Chairs</th>
            <th className="text-center">Shape</th>
            <th className="text-center">Location</th>
            <th className="text-center">View</th>
            <th className="text-center">Features</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table._id}>
              {editingTable?._id === table._id ? (
                <>
                  <td>
                    <Form.Control
                      type="number"
                      value={editingTable.nbtable}
                      onChange={(e) => setEditingTable({ ...editingTable, nbtable: e.target.value })}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={editingTable.chairnb}
                      onChange={(e) => setEditingTable({ ...editingTable, chairnb: e.target.value })}
                    />
                  </td>
                  <td>
                    <Form.Select
                      value={editingTable.shape}
                      onChange={(e) => setEditingTable({ ...editingTable, shape: e.target.value })}
                    >
                      <option value="rectangle">Rectangle</option>
                      <option value="square">Square</option>
                      <option value="circle">Circle</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Select
                      value={editingTable.location}
                      onChange={(e) => setEditingTable({ ...editingTable, location: e.target.value })}
                    >
                      <option value="center">Center</option>
                      <option value="corner">Corner</option>
                      <option value="window">Window</option>
                      <option value="entrance">Entrance</option>
                      <option value="bar">Bar</option>
                      <option value="terrace">Terrace</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Select
                      value={editingTable.view}
                      onChange={(e) => setEditingTable({ ...editingTable, view: e.target.value })}
                    >
                      <option value="none">None</option>
                      <option value="window">Window</option>
                      <option value="garden">Garden</option>
                      <option value="street">Street</option>
                      <option value="bar">Bar</option>
                      <option value="pool">Pool</option>
                      <option value="terrace">Terrace</option>
                    </Form.Select>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      {['USB charger', 'TV screen', 'smoking area', 'private'].map((feature) => (
                                         <Form.Check
                                         key={feature}
                                         type="checkbox"
                                         label={feature}
                                         checked={editingTable.features.includes(feature)}
                                         onChange={(e) => {
                                           const features = [...editingTable.features];
                                           if (e.target.checked) features.push(feature);
                                           else features.splice(features.indexOf(feature), 1);
                                           setEditingTable({ ...editingTable, features });
                                         }}
                                       />
                                     ))}
                                   </div>
                                 </td>
                  <td className="text-center">
                  <Button variant="success" size="sm" className="me-2" onClick={handleUpdateTable}>
                      <i className="fas fa-check" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setEditingTable(null)}>
                      <i className="fas fa-times" />
                    </Button>
                  </td>
                </>
              ) : (
                <>
                  <td>{table.nbtable}</td>
                  <td>{table.chairnb}</td>
                  <td>{table.shape}</td>
                  <td>{table.location}</td>
                  <td>{table.view}</td>
                  <td>{table.features?.join(', ') || 'None'}</td>
                  <td className="text-center">
                    <Button
                      variant="info"
                      size="sm"
                      style={{ backgroundColor: '#0d6efd', color: 'white' }}
                      className="me-2"
                      onClick={() => {
                        setSelectedTable(table);
                        setShowTableDetailModal(true);
                      }}
                    >
                      <i className="fas fa-eye" />
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      style={{ backgroundColor: '#ffc107', color: 'black' }}
                      className="me-2"
                      onClick={() => setEditingTable(table)}
                    >
                      <i className="fas fa-edit" />
                    </Button>


                    <Button
                      variant="danger"
                      size="sm"
                      style={{ backgroundColor: '#dc3545', color: 'white' }}
                      onClick={() => handleDeleteTable(table._id)}
                    >
                      <i className="fas fa-trash" />
                    </Button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

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
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4 px-3 flex-nowrap gap-2">
        <Button
          variant="success"
          onClick={handleShowCreateModal}
          style={{ height: '52px' }}
          className="flex-shrink-0"
        >
          Add Restaurant
        </Button>

        <div className="flex-grow-1 mx-3" style={{ maxWidth: '300px', minWidth: '200px' }}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search Restaurant..."
              value={searchTerm}
              style={{ height: '52px' }}
              onChange={async (e) => {
                const term = e.target.value;
                setSearchTerm(term);
                if (!term.trim()) {
                  await fetchRestaurants();
                } else {
                  await handleSearch(term);
                }
              }}
            />
          </div>
        </div>

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
            }}
          >
            {sortConfig.key ? `Sort By: ${sortConfig.key.charAt(0).toUpperCase() + sortConfig.key.slice(1)}` : "Sort By:"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => requestSort('name')}>Name</Dropdown.Item>
            <Dropdown.Item onClick={() => requestSort('address')}>Address</Dropdown.Item>
            <Dropdown.Item onClick={() => requestSort('cuisineType')}>Cuisine Type</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <h1 className="text-center fw-bold pt-4 mb-4">Restaurants List</h1>

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
                  <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }} className="text-center">
                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => requestSort('address')} style={{ cursor: 'pointer' }} className="text-center">
                    Address {sortConfig.key === 'address' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => requestSort('cuisineType')} style={{ cursor: 'pointer' }} className="text-center">
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
                      <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <Button
                          variant="info"
                          size="sm"
                          style={{ backgroundColor: '#0d6efd', color: 'white' }}
                          onClick={() => handleShowDetailModal(restaurant)}
                          disabled={loading}
                        >
                          <i className="fas fa-eye" />
                        </Button>


                    

                        <Button
                          variant="warning"
                          size="sm"
                          style={{ backgroundColor: '#ffc107', color: 'black' }}
                          onClick={() => handleShowEditModal(restaurant)}
                          disabled={loading}
                        >
                          <i className="fas fa-pen" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          style={{ backgroundColor: '#dc3545', color: 'white' }}
                          onClick={() => handleDeleteRestaurant(restaurant._id)}
                          disabled={loading}
                        >
                          <i className="fas fa-trash" />
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleShowTablesModal(restaurant)}
                          disabled={loading}
                        >
                          <i className="fas fa-chair" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-sm-flex text-center justify-content-between align-items-center mt-4">
            <div className="dataTables_info mb-2 mb-sm-0">
              Showing {currentPage * itemsPerPage + 1} to{' '}
              {Math.min((currentPage + 1) * itemsPerPage, restaurants.length)} of{' '}
              {restaurants.length} entries
            </div>

            <div className="dataTables_paginate paging_simple_numbers">
              <button
                className="btn btn-outline-primary btn-sm me-2"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                disabled={currentPage === totalPages - 1}
              >
                Next
              </button>
            </div>
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
                <p>
                  <strong>Name:</strong> {selectedRestaurant.name || 'N/A'}
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p>
                  <strong>Address:</strong> {selectedRestaurant.address || 'N/A'}
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p>
                  <strong>Cuisine Type:</strong> {selectedRestaurant.cuisineType || 'N/A'}
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p>
                  <strong>Taxe TPS:</strong>{' '}
                  {selectedRestaurant.taxeTPS != null ? selectedRestaurant.taxeTPS : 'N/A'}
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p>
                  <strong>Taxe TVQ:</strong>{' '}
                  {selectedRestaurant.taxeTVQ != null ? selectedRestaurant.taxeTVQ : 'N/A'}
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p>
                  <strong>Color:</strong>{' '}
                  {selectedRestaurant.color ? (
                    <span>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '15px',
                          height: '15px',
                          backgroundColor: selectedRestaurant.color,
                          marginRight: '5px',
                          verticalAlign: 'middle',
                        }}
                      />
                      {selectedRestaurant.color}
                    </span>
                  ) : (
                    'N/A'
                  )}
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p>
                  <strong>Promotion:</strong> {selectedRestaurant.promotion || 'N/A'}
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p>
                  <strong>Pay Cash Method:</strong> {selectedRestaurant.payCashMethod || 'N/A'}
                </p>
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
                    onChange={(e) =>
                      setSelectedRestaurant({ ...selectedRestaurant, name: e.target.value })
                    }
                    isInvalid={!!validationErrors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4 mb-3" controlId="editAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedRestaurant.address || ''}
                    onChange={(e) =>
                      setSelectedRestaurant({ ...selectedRestaurant, address: e.target.value })
                    }
                    isInvalid={!!validationErrors.address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.address}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4 mb-3" controlId="editCuisineType">
                  <Form.Label>Cuisine Type</Form.Label>
                  <Form.Select
                    value={selectedRestaurant.cuisineType || ''}
                    onChange={(e) =>
                      setSelectedRestaurant({ ...selectedRestaurant, cuisineType: e.target.value })
                    }
                    isInvalid={!!validationErrors.cuisineType}
                  >
                    <option value="">Select Cuisine Type</option>
                    {['Italian', 'Mexican', 'Asian', 'French', 'American', 'Fusion', 'Other'].map(
                      (type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      )
                    )}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.cuisineType}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4 mb-3" controlId="editTaxeTPS">
                  <Form.Label>Taxe TPS (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={selectedRestaurant.taxeTPS || ''}
                    onChange={(e) =>
                      setSelectedRestaurant({ ...selectedRestaurant, taxeTPS: e.target.value })
                    }
                    isInvalid={!!validationErrors.taxeTPS}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.taxeTPS}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4 mb-3" controlId="editTaxeTVQ">
                  <Form.Label>Taxe TVQ (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={selectedRestaurant.taxeTVQ || ''}
                    onChange={(e) =>
                      setSelectedRestaurant({ ...selectedRestaurant, taxeTVQ: e.target.value })
                    }
                    isInvalid={!!validationErrors.taxeTVQ}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.taxeTVQ}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4 mb-3" controlId="editColor">
                  <Form.Label>Color (Hex)</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedRestaurant.color || ''}
                    onChange={(e) =>
                      setSelectedRestaurant({ ...selectedRestaurant, color: e.target.value })
                    }
                    maxLength={6}
                    placeholder="e.g., FF5733"
                    isInvalid={!!validationErrors.color}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.color}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4 mb-3" controlId="editLogo">
                  <Form.Label>Logo URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={selectedRestaurant.logo || ''}
                    onChange={(e) =>
                      setSelectedRestaurant({ ...selectedRestaurant, logo: e.target.value })
                    }
                    isInvalid={!!validationErrors.logo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.logo}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4 mb-3" controlId="editPromotion">
                  <Form.Label>Promotion</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedRestaurant.promotion || ''}
                    onChange={(e) =>
                      setSelectedRestaurant({ ...selectedRestaurant, promotion: e.target.value })
                    }
                    isInvalid={!!validationErrors.promotion}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.promotion}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4 mb-3" controlId="editPayCashMethod">
                  <Form.Label>Pay Cash Method</Form.Label>
                  <Form.Select
                    value={selectedRestaurant.payCashMethod || ''}
                    onChange={(e) =>
                      setSelectedRestaurant({ ...selectedRestaurant, payCashMethod: e.target.value })
                    }
                    isInvalid={!!validationErrors.payCashMethod}
                  >
                    <option value="">Select Pay Cash Method</option>
                    {['accepted', 'not-accepted', 'on-request'].map((method) => (
                      <option key={method} value={method}>
                        {method.replace('-', ' ')}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.payCashMethod}
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
                <Form.Control.Feedback type="invalid">
                  {validationErrors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4 mb-3" controlId="createAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={newRestaurant.address}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
                  isInvalid={!!validationErrors.address}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.address}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4 mb-3" controlId="createCuisineType">
                <Form.Label>Cuisine Type</Form.Label>
                <Form.Select
                  value={newRestaurant.cuisineType}
                  onChange={(e) =>
                    setNewRestaurant({ ...newRestaurant, cuisineType: e.target.value })
                  }
                  isInvalid={!!validationErrors.cuisineType}
                >
                  <option value="">Select Cuisine Type</option>
                  {['Italian', 'Mexican', 'Asian', 'French', 'American', 'Fusion', 'Other'].map(
                    (type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    )
                  )}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.cuisineType}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4 mb-3" controlId="createTaxeTPS">
                <Form.Label>Taxe TPS (%)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={newRestaurant.taxeTPS}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, taxeTPS: e.target.value })}
                  isInvalid={!!validationErrors.taxeTPS}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.taxeTPS}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4 mb-3" controlId="createTaxeTVQ">
                <Form.Label>Taxe TVQ (%)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={newRestaurant.taxeTVQ}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, taxeTVQ: e.target.value })}
                  isInvalid={!!validationErrors.taxeTVQ}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.taxeTVQ}
                </Form.Control.Feedback>
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
                <Form.Control.Feedback type="invalid">
                  {validationErrors.color}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4 mb-3" controlId="createLogo">
                <Form.Label>Logo URL</Form.Label>
                <Form.Control
                  type="url"
                  value={newRestaurant.logo}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, logo: e.target.value })}
                  isInvalid={!!validationErrors.logo}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.logo}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4 mb-3" controlId="createPromotion">
                <Form.Label>Promotion</Form.Label>
                <Form.Control
                  type="text"
                  value={newRestaurant.promotion}
                  onChange={(e) =>
                    setNewRestaurant({ ...newRestaurant, promotion: e.target.value })
                  }
                  isInvalid={!!validationErrors.promotion}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.promotion}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4 mb-3" controlId="createPayCashMethod">
                <Form.Label>Pay Cash Method</Form.Label>
                <Form.Select
                  value={newRestaurant.payCashMethod}
                  onChange={(e) =>
                    setNewRestaurant({ ...newRestaurant, payCashMethod: e.target.value })
                  }
                  isInvalid={!!validationErrors.payCashMethod}
                >
                  <option value="">Select Pay Cash Method</option>
                  {['accepted', 'not-accepted', 'on-request'].map((method) => (
                    <option key={method} value={method}>
                      {method.replace('-', ' ')}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.payCashMethod}
                </Form.Control.Feedback>
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

      <Modal show={showTablesModal} onHide={handleCloseTablesModal} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center fw-bold">
            Manage Tables for {selectedRestaurant?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="mb-4">
            <div className="row g-3">
              <div className="col-md-3">
                <Form.Label>Table Number</Form.Label>
                <Form.Control
                  type="number"
                  value={newTable.nbtable}
                  onChange={(e) => setNewTable({ ...newTable, nbtable: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <Form.Label>Chairs</Form.Label>
                <Form.Control
                  type="number"
                  value={newTable.chairnb}
                  onChange={(e) => setNewTable({ ...newTable, chairnb: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <Form.Label>Shape</Form.Label>
                <Form.Select
                  value={newTable.shape}
                  onChange={(e) => setNewTable({ ...newTable, shape: e.target.value })}
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="square">Square</option>
                  <option value="circle">Circle</option>
                </Form.Select>
              </div>
              <div className="col-md-3">
                <Form.Label>Location</Form.Label>
                <Form.Select
                  value={newTable.location}
                  onChange={(e) => setNewTable({ ...newTable, location: e.target.value })}
                >
                  <option value="center">Center</option>
                  <option value="corner">Corner</option>
                  <option value="window">Window</option>
                  <option value="entrance">Entrance</option>
                  <option value="bar">Bar</option>
                  <option value="terrace">Terrace</option>
                </Form.Select>
              </div>
              <div className="col-md-4">
                <Form.Label>View</Form.Label>
                <Form.Select
                  value={newTable.view}
                  onChange={(e) => setNewTable({ ...newTable, view: e.target.value })}
                >
                  <option value="none">None</option>
                  <option value="window">Window</option>
                  <option value="garden">Garden</option>
                  <option value="street">Street</option>
                  <option value="bar">Bar</option>
                  <option value="pool">Pool</option>
                  <option value="terrace">Terrace</option>
                </Form.Select>
              </div>
              <div className="col-md-8">
                <Form.Label>Features</Form.Label>
                <div className="d-flex flex-wrap gap-3">
                  {['USB charger', 'TV screen', 'smoking area', 'private'].map((feature) => (
                    <Form.Check
                      key={feature}
                      type="checkbox"
                      label={feature}
                      checked={newTable.features.includes(feature)}
                      onChange={(e) => {
                        const features = [...newTable.features];
                        if (e.target.checked) features.push(feature);
                        else features.splice(features.indexOf(feature), 1);
                        setNewTable({ ...newTable, features });
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="col-12 justify-content-center d-flex">
                <Button  variant="success"  onClick={handleCreateTable}>
                  Add Table
                </Button>
              </div>
            </div>
          </Form>

          {tables.length === 0 ? (
            <Alert variant="info">No tables found for this restaurant.</Alert>
          ) : (
            renderTables()
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTablesModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <TableDetailModal
        table={selectedTable}
        onHide={() => {
          setShowTableDetailModal(false);
          setSelectedTable(null);
        }}
      />
    </div>
  );
};

export default RestaurantList;