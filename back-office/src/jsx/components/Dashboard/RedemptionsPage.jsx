import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';

const RedemptionsPage = () => {
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

  const fetchRedemptions = async () => {
    try {
      setLoading(true);
      const userEmail = 'user@example.com'; // Get the logged-in user's email dynamically
      const res = await fetch(`http://localhost:5000/api/redemptions?userEmail=${userEmail}`);
      const data = await res.json();

      console.log("Fetched redemptions:", data);
      setRedemptions(data);
    } catch (err) {
      console.error("Error fetching redemptions:", err);
      setError('Failed to fetch redemptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedemptions();
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
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Redemption Management</h2>
        <Button onClick={() => setShowModal(true)}>+ New Redemption</Button>
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
                <th>User</th>
                <th>Reward</th>
                <th>Reservation</th>
                <th>Points</th>
                <th>Redeemed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {redemptions.map((redemption) => (
                <tr key={redemption._id} className="text-center">
                  <td>{redemption.user?.firstName} {redemption.user?.lastName}</td>
                  <td>{redemption.reward?.name}</td>
                  <td>{redemption.reservation ? redemption.reservation.name : 'N/A'}</td>
                  <td>{redemption.user?.points}</td>
                  <td>{new Date(redemption.redeemedAt).toLocaleString()}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => setShowModal(true)}
                    >
                      Edit
                    </Button>{' '}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(redemption._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

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
                  <Form.Label>Reward ID</Form.Label>
                  <Form.Control
                    name="rewardId"
                    type="text"
                    value={formData.rewardId}
                    onChange={handleChange}
                    required
                  />
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
