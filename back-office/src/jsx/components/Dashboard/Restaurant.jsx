import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown, Modal, Button, Form } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from "../../../services/AuthService.js";
import { formatError } from "../../../services/AuthService.js";
 
 
const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

 
  const itemsPerPage = 5;
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewRestaurantModal, setShowNewRestaurantModal] = useState(false); // Corrected state variable
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [newRestaurant, setNewRestaurant] = useState({ name: '', address: '', cuisineType: '', taxeTPS: '', taxeTVQ: '', color: '', logo: '', promotion: '', payCashMethod: '', images: [] });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        const user = response.data;
        setCurrentUser(user);
        if (user && user.role?.name === 'SuperAdmin') {
          fetchData();
        }
      } catch (err) {
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);
  
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No authentication token found');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:5000/api/restaurants', config);
      setRestaurants(response.data.restaurants);
    } catch (err) {
      setError(formatError({ message: err.message }) || err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteRestaurant = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this restaurant?');
    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No authentication token found');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`http://localhost:5000/api/restaurants/${id}`, config);
      setRestaurants((prevRestaurants) => prevRestaurants.filter((restaurant) => restaurant._id !== id));
      setError(null);
    } catch (err) {
      setError(formatError({ message: err.message }) || err.message);
    }
  };

  const handleShowModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowViewModal(true);
  };

  const handleEditModal = (restaurant) => {
    // Remove the '%' sign from taxeTPS and taxeTVQ if present and the '#' sign from color if present
    const formattedRestaurant = {
      ...restaurant,
      taxeTPS: restaurant.taxeTPS ? restaurant.taxeTPS.replace('%', '') : '',
      taxeTVQ: restaurant.taxeTVQ ? restaurant.taxeTVQ.replace('%', '') : '',
      color: restaurant.color ? restaurant.color.replace('#', '') : ''
    };
    setSelectedRestaurant(formattedRestaurant);
    setShowEditModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedRestaurant(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedRestaurant(null);
  };

  const handleUpdateRestaurant = async () => {
    const isConfirmed = window.confirm('Are you sure you want to edit this restaurant?');
    if (!isConfirmed) return;
  
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No authentication token found');
      const config = { headers: { Authorization: `Bearer ${token}` } };
  
      // Format the fields
      const updatedRestaurant = {
        ...selectedRestaurant,
        taxeTPS: selectedRestaurant.taxeTPS ? `${selectedRestaurant.taxeTPS}%` : '',
        taxeTVQ: selectedRestaurant.taxeTVQ ? `${selectedRestaurant.taxeTVQ}%` : '',
        color: selectedRestaurant.color ? `#${selectedRestaurant.color}` : ''
      };
  
      await axios.put(`http://localhost:5000/api/restaurants/${selectedRestaurant._id}`, updatedRestaurant, config);
      const response = await axios.get('http://localhost:5000/api/restaurants', config);
      setRestaurants(response.data.restaurants);
      handleCloseEditModal();
      setError(null);
    } catch (err) {
      setError(formatError({ message: err.message }) || err.message);
    }
  };

const handleShowNewRestaurantModal = () => {
  setShowNewRestaurantModal(true); // Corrected state variable
};

const handleCloseNewRestaurantModal = () => {
    setNewRestaurant({ name: '', address: '', cuisineType: '', taxeTPS: '', taxeTVQ: '', color: '', logo: '', promotion: '', payCashMethod: '', images: [] });
    setShowNewRestaurantModal(false); // Corrected state variable
  };

  const handleCreateRestaurant = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No authentication token found');
      const config = { headers: { Authorization: `Bearer ${token}` } };
  
      // Format the fields
      const formattedNewRestaurant = {
        ...newRestaurant,
        taxeTPS: newRestaurant.taxeTPS ? `${newRestaurant.taxeTPS}%` : '',
        taxeTVQ: newRestaurant.taxeTVQ ? `${newRestaurant.taxeTVQ}%` : '',
        color: newRestaurant.color ? `#${newRestaurant.color}` : ''
      };
  
      console.log('Creating restaurant with data:', formattedNewRestaurant); // Log the request data
  
      await axios.post('http://localhost:5000/api/restaurants', formattedNewRestaurant, config);
      const response = await axios.get('http://localhost:5000/api/restaurants', config);
      setRestaurants(response.data.restaurants);
      handleCloseNewRestaurantModal();
      setError(null);
    } catch (err) {
      console.error('Error creating restaurant:', err); // Log the error
      setError(formatError({ message: err.message }) || err.message);
    }
  };

   /*try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No authentication token found');
        const config = { headers: { Authorization: `Bearer ${token}` } };
  
        await axios.post('http://localhost:5000/api/restaurants', newRestaurant, config);
        const restaurantsResponse = await axios.get('http://localhost:5000/api/restaurants', config);
        setUsers(restaurantsResponse.data);
        handleCloseNewRestaurantModal();
        setError(null);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Error creating user';
        console.error('Error creating user:', err);
        setError(formatError({ message: errorMessage }) || errorMessage);
      }
    };*/

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      fetchData();
      return;
    }

    const filteredRestaurants = restaurants.filter(restaurant =>
      (restaurant.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (restaurant.address?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (restaurant.cuisineType?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    setRestaurants(filteredRestaurants);
    setCurrentPage(0);
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    const keyA = sortConfig.key.includes('.') ? sortConfig.key.split('.').reduce((o, i) => o?.[i], a) : a[sortConfig.key];
    const keyB = sortConfig.key.includes('.') ? sortConfig.key.split('.').reduce((o, i) => o?.[i], b) : b[sortConfig.key];
    if (keyA < keyB) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (keyA > keyB) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const paginatedRestaurants = sortedRestaurants.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(restaurants.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };


  const handleShowRestaurantModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowRestaurantModal(true);
  };

  const [showRestaurantModal, setShowRestaurantModal] = useState(false);

  const handleCloseRestaurantModal = () => {
    setShowRestaurantModal(false);
    setSelectedRestaurant(null);
  };


  if (authLoading) return <p>Loading authentication...</p>;
  if (!currentUser || currentUser.role?.name !== 'SuperAdmin') {
    return <Navigate to="/unauthorized" replace />;
  }
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="d-sm-flex mb-lg-4 mb-2">
        <Button variant="success" onClick={handleShowNewRestaurantModal} className="me-auto">
          <i className="fas fa-plus"></i> Add New Restaurant
        </Button>

        <div className="d-flex align-items-center" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="position-relative">
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.trim() === "") {
                  fetchData();
                } else {
                  handleSearch();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <i className="fas fa-search position-absolute" style={{ top: '50%', left: '10px', transform: 'translateY(-50%)' }}></i>
          </div>
        </div>

        <Dropdown className="dropdown mb-2 ms-auto me-3">
          <Dropdown.Toggle className="btn btn-primary btn-rounded light" aria-expanded="false">
            <i className="las la-bolt scale5 me-3" />
            All Restaurants
            <i className="las la-angle-down ms-3" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu dropdown-menu-center">
            <Dropdown.Item className="dropdown-item" onClick={() => requestSort('cuisineType')}>Cuisine Type</Dropdown.Item>
            <Dropdown.Item className="dropdown-item" onClick={() => requestSort('address')}>Address</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <h1 className="text-center" style={{ fontWeight: "bold" }}>Restaurants List</h1><br></br>
      <div className="table-responsive rounded card-table">
        <div className="dataTables_wrapper no-footer">
          <table className="table table-bordered table-striped dataTable no-footer" role="grid">
            <thead>
              <tr>
                <th className="sorting text-center" style={{ width: 133 }} onClick={() => requestSort('name')}>
                  Name
                </th>
                <th className="sorting text-center" style={{ width: 193 }} onClick={() => requestSort('address')}>
                  Address
                </th>
                <th className="sorting text-center" style={{ width: 67 }} onClick={() => requestSort('cuisineType')}>
                  Cuisine Type
                </th>
                <th className="text-center" style={{ width: 108 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRestaurants.map((restaurant) => (
                <tr key={restaurant._id} className="alert alert-dismissible border-0 even" role="row">
                  <td>{restaurant.name}</td>
                  <td>{restaurant.address}</td>
                  <td>{restaurant.cuisineType}</td>
                  <td>
                    <div className="d-flex align-items-center justify-content-end">
                      <button className="btn btn-sm me-2" style={{ backgroundColor: "#0d6efd", color: "white" }} onClick={() => handleShowRestaurantModalzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz(restaurant)}>
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="btn btn-sm me-2" style={{ backgroundColor: "#ffc107", color: "black" }} onClick={() => handleEditModal(restaurant)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-sm me-2" style={{ backgroundColor: "#dc3545", color: "white" }} onClick={() => deleteRestaurant(restaurant._id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
            <div className="dataTables_info" role="status" aria-live="polite">
              Showing {currentPage * itemsPerPage + 1} to{' '}
              {Math.min((currentPage + 1) * itemsPerPage, restaurants.length)} of {restaurants.length} entries
            </div>
            <div className="dataTables_paginate paging_simple_numbers">
              <button
                className="paginate_button previous"
                onClick={() => currentPage > 0 && handlePageClick(currentPage - 1)}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              <span>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`paginate_button ${currentPage === i ? 'current' : ''}`}
                    onClick={() => handlePageClick(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </span>
              <button
                className="paginate_button next"
                onClick={() => currentPage + 1 < totalPages && handlePageClick(currentPage + 1)}
                disabled={currentPage + 1 === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>


      <Modal show={showRestaurantModal} onHide={handleCloseRestaurantModal} centered>
  <Modal.Header closeButton>
    <Modal.Title style={{ textAlign: "center", width: "100%", fontWeight: "bold" }}>
      Restaurant Details
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedRestaurant && (
      <div className="text-center">
        <img 
          src={selectedRestaurant.logo || 'default-logo.png'} 
          width={100}
          height={100}
          alt="Logo"
          className="rounded-circle mb-3"
          style={{ objectFit: 'cover' }}
        />
        <p><strong>Name:</strong> {selectedRestaurant.name || 'N/A'}</p>
        <p><strong>Address:</strong> {selectedRestaurant.address || 'N/A'}</p>
        <p><strong>Cuisine Type:</strong> {selectedRestaurant.cuisineType || 'N/A'}</p>
        <p><strong>Taxe TPS:</strong> {selectedRestaurant.taxeTPS ? `${selectedRestaurant.taxeTPS}%` : 'N/A'}</p>
        <p><strong>Taxe TVQ:</strong> {selectedRestaurant.taxeTVQ ? `${selectedRestaurant.taxeTVQ}%` : 'N/A'}</p>
        <p><strong>Color:</strong> {selectedRestaurant.color ? `#${selectedRestaurant.color}` : 'N/A'}</p>
        <p><strong>Promotion:</strong> {selectedRestaurant.promotion || 'N/A'}</p>
        <p><strong>Pay Cash Method:</strong> {selectedRestaurant.payCashMethod || 'N/A'}</p>
      </div>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseRestaurantModal}>
      Close
    </Button>
  </Modal.Footer>
</Modal>



      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center", width: "100%", fontWeight: "bold" }}>Edit Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRestaurant && (
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedRestaurant.name || ''}
                  onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedRestaurant.address || ''}
                  onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, address: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formCuisineType">
                <Form.Label>Cuisine Type</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedRestaurant.cuisineType || ''}
                  onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, cuisineType: e.target.value })}
                >
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Asian">Asian</option>
                  <option value="French">French</option>
                  <option value="American">American</option>
                  <option value="Fusion">Fusion</option>
                  <option value="Other">Other</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formTaxeTPS">
                <Form.Label>Taxe TPS</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedRestaurant.taxeTPS ? `${selectedRestaurant.taxeTPS}%` : ''}
                  onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, taxeTPS: e.target.value.replace('%', '') })}
                />
              </Form.Group>
              <Form.Group controlId="formTaxeTVQ">
                <Form.Label>Taxe TVQ</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedRestaurant.taxeTVQ ? `${selectedRestaurant.taxeTVQ}%` : ''}
                  onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, taxeTVQ: e.target.value.replace('%', '') })}
                />
              </Form.Group>
              <Form.Group controlId="formColor">
                <Form.Label>Color</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedRestaurant.color ? `#${selectedRestaurant.color}` : ''}
                  maxLength={7}
                  onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, color: e.target.value.replace('#', '') })}
                />
              </Form.Group>
              <Form.Group controlId="formLogo">
                <Form.Label>Logo</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedRestaurant.logo || ''}
                  onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, logo: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formPromotion">
                <Form.Label>Promotion</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedRestaurant.promotion || ''}
                  onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, promotion: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formPayCashMethod">
                <Form.Label>Pay Cash Method</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedRestaurant.payCashMethod || ''}
                  onChange={(e) => setSelectedRestaurant({ ...selectedRestaurant, payCashMethod: e.target.value })}
                >
                  <option value="accepted">Accepted</option>
                  <option value="not-accepted">Not Accepted</option>
                  <option value="on-request">On Request</option>
                </Form.Control>
              </Form.Group>
              
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateRestaurant}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showNewRestaurantModal} onHide={handleCloseNewRestaurantModal}>
  <Modal.Header closeButton>
    <Modal.Title style={{ textAlign: "center", width: "100%", fontWeight: "bold" }}>Add New Restaurant</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="formNewRestaurantName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={newRestaurant.name}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
        />
      </Form.Group>
      <Form.Group controlId="formNewRestaurantAddress">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          value={newRestaurant.address}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
        />
      </Form.Group>
      <Form.Group controlId="formNewRestaurantCuisineType">
        <Form.Label>Cuisine Type</Form.Label>
        <Form.Control as="select" value={newRestaurant.cuisineType} onChange={(e) => setNewRestaurant({ ...newRestaurant, cuisineType: e.target.value })}>
          <option value="Italian">Italian</option>
          <option value="Mexican">Mexican</option>
          <option value="Asian">Asian</option>
          <option value="French">French</option>
          <option value="American">American</option>
          <option value="Fusion">Fusion</option>
          <option value="Other">Other</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="formNewRestaurantTaxeTPS">
        <Form.Label>Taxe TPS</Form.Label>
        <Form.Control
          type="text"
          value={newRestaurant.taxeTPS ? `${newRestaurant.taxeTPS}%` : ''}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, taxeTPS: e.target.value.replace('%', '') })}
        />
      </Form.Group>
      <Form.Group controlId="formNewRestaurantTaxeTVQ">
        <Form.Label>Taxe TVQ</Form.Label>
        <Form.Control
          type="text"
          value={newRestaurant.taxeTVQ ? `${newRestaurant.taxeTVQ}%` : ''}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, taxeTVQ: e.target.value.replace('%', '') })}
        />
      </Form.Group>
      <Form.Group controlId="formNewRestaurantColor">
        <Form.Label>Color</Form.Label>
        <Form.Control
          type="text"
          value={newRestaurant.color ? `#${newRestaurant.color}` : ''}
          maxLength={7}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, color: e.target.value.replace('#', '') })}
        />
      </Form.Group>
      <Form.Group controlId="formNewRestaurantLogo">
        <Form.Label>Logo</Form.Label>
        <Form.Control
          type="text"
          value={newRestaurant.logo}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, logo: e.target.value })}
        />
      </Form.Group>
      <Form.Group controlId="formNewRestaurantPromotion">
        <Form.Label>Promotion</Form.Label>
        <Form.Control
          type="text"
          value={newRestaurant.promotion}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, promotion: e.target.value })}
        />
      </Form.Group>
      <Form.Group controlId="formNewRestaurantPayCashMethod">
        <Form.Label>Pay Cash Method</Form.Label>
        <Form.Control as="select" value={newRestaurant.payCashMethod} onChange={(e) => setNewRestaurant({ ...newRestaurant, payCashMethod: e.target.value })}>
          <option value="accepted">Accepted</option>
          <option value="not-accepted">Not Accepted</option>
          <option value="on-request">On Request</option>
        </Form.Control>
      </Form.Group>
     
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseNewRestaurantModal}>
      Close
    </Button>
    <Button variant="primary" onClick={handleCreateRestaurant}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>
    </>
  );
        };

        export default RestaurantList;
        
               