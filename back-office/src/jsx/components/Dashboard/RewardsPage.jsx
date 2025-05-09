import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/authContext';
import { Table, Button, Modal, Form, Spinner, Alert, Pagination } from 'react-bootstrap';

const RewardsPage = () => {
  const { user } = useAuth(); // ✅ current authenticated user
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointsCost: '',
    isActive: true,
    restaurant: user?.restaurantId || '',
  });

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/rewards');
      const data = await res.json();
  
      // ✅ Filter by user's restaurant ID (either string or object _id)
      const restaurantId = user?.restaurant?._id || user?.restaurantId;
      const filteredData = data.filter((reward) =>
        reward.restaurant?._id === restaurantId || reward.restaurant === restaurantId
      );
  
      setRewards(filteredData);
    } catch (err) {
      setError('Failed to fetch rewards');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    console.log('User from useAuth:', user); // Log entire user object
    if (user?.restaurant) {
      console.log('User restaurant object:', user.restaurant); // Debug restaurant details
    } else {
      console.log('Restaurant not found in user context');
    }
    fetchRewards();
  }, [user]); // Ensure data is fetched once the user is available
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleShowModal = (reward = null) => {
    setEditMode(!!reward);
    setSelectedReward(reward);
    
    const userRestaurantId = user?.restaurant?._id || '';  // Use _id here
    console.log('User Restaurant ID (in modal):', userRestaurantId);
  
    if (reward) {
      setFormData({
        name: reward.name || '',
        description: reward.description || '',
        pointsCost: reward.pointsCost || '',
        isActive: reward.isActive ?? true,
        restaurant: reward.restaurant?._id || userRestaurantId,  // Ensure this is set correctly
      });
    } else {
      setFormData({
        name: '',
        description: '',
        pointsCost: '',
        isActive: true,
        restaurant: userRestaurantId,  // Correctly set the restaurantId
      });
    }
    
    setShowModal(true);
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Log formData and user info
    console.log('Form Data:', formData);
    console.log('User Restaurant ID:', user?.restaurant?.id); // Log user info
  
    // Ensure that restaurantId is set correctly
    if (!formData.restaurant && !user?.restaurant?.id) {
      setError('Restaurant is required');
      return;
    }
  
    const method = editMode ? 'PUT' : 'POST';
    const url = editMode
      ? `http://localhost:5000/api/rewards/${selectedReward._id}`
      : `http://localhost:5000/api/rewards`;
  
      const payload = {
        ...formData,
        restaurant: user?.restaurant?._id || '',  // Ensure the restaurantId is correctly set
      };
      
  
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) throw new Error('Failed to save reward');
      await fetchRewards();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reward?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/rewards/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchRewards();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredRewards = rewards.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filteredRewards.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const totalPages = Math.ceil(filteredRewards.length / itemsPerPage);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Rewards Management</h2>
        <Button onClick={() => handleShowModal()}>+ New Reward</Button>
      </div>

      <Form.Control
        type="text"
        placeholder="Search rewards..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />

      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Table bordered hover>
            <thead className="text-center">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Points</th>
                <th>Active</th>
                <th>Restaurant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((reward) => (
                <tr key={reward._id} className="text-center">
                  <td>{reward.name}</td>
                  <td>{reward.description}</td>
                  <td>{reward.pointsCost}</td>
                  <td>
                    <span
                      className={`badge ${reward.isActive ? 'bg-success' : 'bg-danger'}`}
                    >
                      {reward.isActive ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>{reward.restaurant?.name || 'N/A'}</td>
                  <td>
                          <Button
          variant="warning"
          size="sm"
          style={{ backgroundColor: '#ffc107', color: 'black' }}
          onClick={() => handleShowModal(reward)}
          disabled={loading}
        >
          <i className="fas fa-pen" />
        </Button>{' '}
        <Button
          variant="danger"
          size="sm"
          style={{ backgroundColor: '#dc3545', color: 'white' }}
          onClick={() => handleDelete(reward._id)}
          disabled={loading}
        >
          <i className="fas fa-trash" />
        </Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center">
              <Pagination>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => setCurrentPage(i)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          )}
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? 'Edit Reward' : 'Add Reward'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                value={formData.description}
                onChange={handleChange}
                as="textarea"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Points Required</Form.Label>
              <Form.Control
                name="pointsCost"
                type="number"
                value={formData.pointsCost}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Check
                type="checkbox"
                label="Active"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </Form.Group>

            {user?.restaurantId && (
              <div className="mb-2">
                <strong>Restaurant ID:</strong> {user.restaurantId}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editMode ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default RewardsPage;
