import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert, Pagination } from 'react-bootstrap';

const RedemptionsPage = () => {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    rewardId: '',
    reservationId: '',
  });
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const fetchRedemptions = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/redemptions');
      const data = await res.json();
      setRedemptions(data);
    } catch (err) {
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
    const { userId, rewardId, reservationId } = formData;

    if (!userId || !rewardId) {
      setError('User and Reward are required');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/redemptions/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, rewardId, reservationId }),
      });

      if (!res.ok) throw new Error('Failed to redeem reward');
      await fetchRedemptions();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this redemption?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/redemptions/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete redemption');
      await fetchRedemptions();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredRedemptions = redemptions.filter((r) =>
    r.reward.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filteredRedemptions.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const totalPages = Math.ceil(filteredRedemptions.length / itemsPerPage);

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
                <th>Redeemed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((redemption) => (
                <tr key={redemption._id} className="text-center">
                  <td>{redemption.user.firstName} {redemption.user.lastName}</td>
                  <td>{redemption.reward.name}</td>
                  <td>{redemption.reservation ? redemption.reservation.name : 'N/A'}</td>
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
            <Modal.Title>Redeem Reward</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                name="userId"
                type="text"
                value={formData.userId}
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
    </div>
  );
};

export default RedemptionsPage;
