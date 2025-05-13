import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/authContext';
import { Table, Button, Modal, Form, Spinner, Alert, Pagination } from 'react-bootstrap';

const RewardsPage = () => {
  const { user } = useAuth();
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

  const [showRedemptionsModal, setShowRedemptionsModal] = useState(false);
  const [redemptions, setRedemptions] = useState([]);
  const [redemptionsLoading, setRedemptionsLoading] = useState(false);

/*
  const fetchRewards = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/rewards');
      const data = await res.json();

      const restaurantId = user?.restaurant?._id || user?.restaurantId;
      const filteredData = data.filter(
        (reward) => reward.restaurant?._id === restaurantId || reward.restaurant === restaurantId
      );

      setRewards(filteredData);
    } catch (err) {
      setError('Failed to fetch rewards');
    } finally {
      setLoading(false);
    }
  };*/

  const fetchRewards = async () => {
  try {
    setLoading(true);
    const res = await fetch('http://localhost:5000/api/rewards');
    if (!res.ok) {
      throw new Error('Failed to fetch rewards');
    }
    const data = await res.json();

    const restaurantId = user?.restaurant?._id || user?.restaurantId;
    const filteredData = data.filter(
      (reward) => reward.restaurant?._id === restaurantId || reward.restaurant === restaurantId
    );

    setRewards(filteredData.length > 0 ? filteredData : []); // Ensure rewards is an empty array if no data
  } catch (err) {
    setError(err.message || 'Failed to fetch rewards');
    setRewards([]); // Set rewards to an empty array on error
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (user) fetchRewards();
  }, [user]);

  const handleShowModal = (reward = null) => {
    setEditMode(!!reward);
    setSelectedReward(reward);

    const restaurantId = user?.restaurant?._id || '';
    if (reward) {
      setFormData({
        name: reward.name || '',
        description: reward.description || '',
        pointsCost: reward.pointsCost || '',
        isActive: reward.isActive ?? true,
        restaurant: reward.restaurant?._id || restaurantId,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        pointsCost: '',
        isActive: true,
        restaurant: restaurantId,
      });
    }

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { name, description, pointsCost, isActive, restaurant } = formData;

    const rewardData = {
      name,
      description,
      pointsCost: parseInt(pointsCost, 10),
      isActive,
      restaurant,
    };

    try {
      if (editMode) {
        // Update existing reward
        const res = await fetch(`http://localhost:5000/api/rewards/${selectedReward._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rewardData),
        });
        if (!res.ok) throw new Error('Failed to update reward');
      } else {
        // Add new reward
        const res = await fetch('http://localhost:5000/api/rewards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rewardData),
        });
        if (!res.ok) throw new Error('Failed to add reward');
      }
      await fetchRewards();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  /*const handleShowRedemptions = async (rewardId) => {
    setRedemptionsLoading(true);
    setShowRedemptionsModal(true);

    try {
      const res = await fetch(`http://localhost:5000/api/rewards/${rewardId}/redemptions`);
      const data = await res.json();
      setRedemptions(data);
    } catch (err) {
      setError('Failed to fetch redemptions');
    } finally {
      setRedemptionsLoading(false);
    }
  };*/

const handleShowRedemptions = async (rewardId) => {
  setRedemptionsLoading(true);
  setShowRedemptionsModal(true);

  try {
    const res = await fetch(`http://localhost:5000/api/rewards/${rewardId}/redemptions`);
    if (!res.ok) {
      throw new Error('Failed to fetch redemptions');
    }
    const data = await res.json();
    setRedemptions(data.length > 0 ? data : []); // Ensure redemptions is an empty array if no data
  } catch (err) {
    setError(err.message || 'Failed to fetch redemptions');
    setRedemptions([]); // Set redemptions to an empty array on error
  } finally {
    setRedemptionsLoading(false);
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
                      variant="info"
                      size="sm"
                      onClick={() => handleShowRedemptions(reward._id)}
                      disabled={loading}
                    >
                      <i className="fas fa-eye" /> 
                    </Button>{' '}
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
                      onClick={() => handleDelete(reward._id)}
                      disabled={loading}
                    >
                      <i className="fas fa-trash" />
                    </Button>{' '}
                    
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

      {/* Modal for Add/Update Reward */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Reward' : 'Add New Reward'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Points Cost</Form.Label>
              <Form.Control
                type="number"
                value={formData.pointsCost}
                onChange={(e) => setFormData({ ...formData, pointsCost: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Active"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {editMode ? 'Update' : 'Add'} Reward
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for Redemptions */}
    <Modal show={showRedemptionsModal} onHide={() => setShowRedemptionsModal(false)} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Redemptions for Reward</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {redemptionsLoading ? (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    ) : redemptions.length === 0 ? (
      <div className="text-center my-5">
        <Alert variant="info">No redemptions found for this reward.</Alert>
      </div>
    ) : (
      <Table bordered hover responsive="sm" striped>
        <thead className="text-center bg-light">
          <tr>
            <th>User</th>
            <th>Points</th>
            <th>Reservation Date</th>
            <th>Redeem Date</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {redemptions.map((redemption) => (
            <tr key={redemption._id}>
              <td>{redemption.user?.email || 'N/A'}</td>
              <td>{redemption.user?.points || '0'}</td>
              <td>{redemption.reservation?.createdAt ? new Date(redemption.reservation.createdAt).toLocaleString() : 'N/A'}</td>
              <td>{redemption.redeemedAt ? new Date(redemption.redeemedAt).toLocaleString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowRedemptionsModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
};

export default RewardsPage;
