import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../../context/authContext';

const RedemptionsPage = () => {
    const { user } = useAuth();
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userEmail: '',
    rewardId: '',
    reservationId: '',
  });
  const [rewards, setRewards] = useState([]);
  const [selectedRewardId, setSelectedRewardId] = useState('');

  const fetchRedemptions = async () => {
    try {
      setLoading(true);
      const userEmail = user.email;
  
      const res = await fetch(
        `http://localhost:5000/api/redemptions?userEmail=${userEmail}`
      );
  
      const data = await res.json();
  
      if (!Array.isArray(data)) {
        throw new Error("Invalid data returned from API");
      }
  
      setRedemptions(data);
    } catch (err) {
      console.error("Error fetching redemptions:", err);
      setError('Failed to fetch redemptions');
    } finally {
      setLoading(false);
    }
  };
  
  


  const fetchRewards = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/rewards');  // Adjust the API endpoint as needed
      const data = await res.json();
      setRewards(data);
    } catch (err) {
      console.error('Error fetching rewards:', err);
      setError('Failed to fetch rewards');
    }
  };

  useEffect(() => {
    fetchRedemptions();
    fetchRewards();  // Fetch rewards when the page loads
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userEmail, rewardId, reservationId } = formData;

    if (!userEmail || !rewardId) {
      setError('User email and Reward are required');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/redemptions/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, rewardId, reservationId }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('Error redeeming:', data);
        throw new Error(data.message || 'Failed to redeem reward');
      }

      console.log('Redemption created:', data);
      await fetchRedemptions();
      setShowModal(false);
    } catch (err) {
      console.error('Redemption error:', err);
      setError(err.message);
    }
  };
/*
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/redemptions/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Delete error:", data);
        throw new Error(data.message || 'Failed to delete redemption');
      }

      console.log("Redemption deleted:", data);
      await fetchRedemptions();
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete redemption');
    }
  };*/

const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this redemption?')) return;

  try {
    const res = await fetch(`http://localhost:5000/api/redemptions/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Failed to delete redemption');
    }

    console.log('Redemption deleted successfully');
    setRedemptions((prev) => prev.filter((redemption) => redemption._id !== id)); // Update state
  } catch (err) {
    console.error('Delete failed:', err);
    setError(err.message || 'Failed to delete redemption');
  }
};

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [vipFilter, setVipFilter] = useState('');
  const [rewardFilter, setRewardFilter] = useState('');
  
  const filteredRedemptions = redemptions
  .filter((r) => 
    (!search || r.reward?.name?.toLowerCase().includes(search.toLowerCase())) &&
    (!vipFilter || r.user?.vipLevel === vipFilter) &&
    (!rewardFilter || r.reward?._id === rewardFilter)
  );

const indexOfLast = currentPage * itemsPerPage;
const indexOfFirst = indexOfLast - itemsPerPage;
const currentRedemptions = filteredRedemptions.slice(indexOfFirst, indexOfLast);

const totalPages = Math.ceil(filteredRedemptions.length / itemsPerPage);


  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Redemption Management</h2>
        <Button onClick={() => setShowModal(true)}>+ New Redemption</Button>
      </div>

      <Form className="d-flex gap-2 mb-3">
  <Form.Control
    type="text"
    placeholder="Search rewards..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    }}
  />

  <Form.Select
    value={vipFilter}
    onChange={(e) => {
      setVipFilter(e.target.value);
      setCurrentPage(1);
    }}
  >
    <option value="">All VIP Levels</option>
    {[...new Set(redemptions.map(r => r.user?.vipLevel))].map(level => (
      <option key={level} value={level}>{level}</option>
    ))}
  </Form.Select>

  <Form.Select
    value={rewardFilter}
    onChange={(e) => {
      setRewardFilter(e.target.value);
      setCurrentPage(1);
    }}
  >
    <option value="">All Rewards</option>
    {rewards.map((r) => (
      <option key={r._id} value={r._id}>
        {r.name}
      </option>
    ))}
  </Form.Select>
</Form>


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
                <th>User</th>
                <th>Reward</th>
                <th>VIP Level</th>
                <th>Reservation</th>
                <th>Points</th>
                <th>Redeemed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {currentRedemptions.map((redemption) => (

                <tr key={redemption._id} className="text-center">
                  <td>{redemption.user?.email}</td>

                  <td>{redemption.reward?.name}</td>
                  <td>{redemption.user?.vipLevel}</td>
                  <td>{redemption.reservation ? redemption.reservation.createdAt : 'N/A'}</td>
                  <td>{redemption.user?.points}</td>
                  <td>{new Date(redemption.redeemedAt).toLocaleString()}</td>
                  <td>
                  <Button
            variant="warning"
            size="sm"
            style={{ backgroundColor: '#ffc107', color: 'black' }}
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            <i className="fas fa-pen" />
          </Button>{' '}
         <Button
          variant="danger"
          size="sm"
          onClick={() => handleDelete(redemption._id)}
          disabled={loading}
        >
          <i className="fas fa-trash" />
        </Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center mt-3">
  <Button
    variant="outline-primary"
    size="sm"
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
  >
    Previous
  </Button>
  <span className="mx-3 align-self-center">
    Page {currentPage} of {totalPages}
  </span>
  <Button
    variant="outline-primary"
    size="sm"
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
  >
    Next
  </Button>
</div>

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>Redeem Reward</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-2">
                  <Form.Label>User Email</Form.Label>
                  <Form.Control
                    name="userEmail"
                    type="email"
                    value={formData.userEmail}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Reward</Form.Label>
                  <Form.Control
                    as="select"
                    name="rewardId"
                    value={formData.rewardId}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        rewardId: e.target.value,
                      });
                    }}
                    required
                  >
                    <option value="">Select a reward</option>
                    {rewards.map((reward) => (
                      <option key={reward._id} value={reward._id}>
                        {reward.name} - {reward.pointsCost} points
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Reservation ID</Form.Label>
                  <Form.Control
                    name="reservationId"
                    type="text"
                    value={formData.reservationId}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Redeem Reward
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
};

export default RedemptionsPage;
