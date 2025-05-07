import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../../context/authContext';
import { Alert, Button, Spinner, Table, Pagination, Form, Modal } from 'react-bootstrap';

const LoyaltyUsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'user.firstName', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false); // For toggle between View and Update modes
  const itemsPerPage = 10;

  useEffect(() => {
    if (user?.restaurant?._id) {
      setRestaurantId(user.restaurant._id); // Set restaurant ID dynamically
    }
  }, [user]);

  useEffect(() => {
    if (restaurantId) {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:5000/api/loyalty/restaurant/${restaurantId}`);
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [restaurantId]);

  const getUserLevel = (points) => {
    if (points >= 1000) return 'Platinum';
    if (points >= 500) return 'Gold';
    if (points >= 200) return 'Silver';
    return 'Bronze';
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Platinum':
        return 'bg-primary text-white';
      case 'Gold':
        return 'bg-warning text-dark';
      case 'Silver':
        return 'bg-secondary text-white';
      case 'Bronze':
        return 'bg-success text-white';
      default:
        return '';
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const name = user.user?.firstName?.toLowerCase() || '';
      const email = user.user?.email?.toLowerCase() || '';
      const searchLower = searchQuery.toLowerCase();
      const level = getUserLevel(user.points).toLowerCase();

      return (
        (name.includes(searchLower) ||
          email.includes(searchLower) ||
          level.includes(searchLower)) &&
        (filter ? getUserLevel(user.points).toLowerCase() === filter.toLowerCase() : true)
      );
    });
  }, [users, searchQuery, filter]);

  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers].sort((a, b) => {
      const keyA = a[sortConfig.key] || '';
      const keyB = b[sortConfig.key] || '';
      return sortConfig.direction === 'ascending'
        ? keyA.localeCompare(keyB)
        : keyB.localeCompare(keyA);
    });
    return sorted;
  }, [filteredUsers, sortConfig]);

  const paginatedUsers = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return sortedUsers.slice(start, start + itemsPerPage);
  }, [sortedUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const direction =
        prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending';
      return { key, direction };
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset pagination when search query changes
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(0); // Reset pagination when filter changes
  };

  const handleShowModal = (user, isUpdate = false) => {
    setSelectedUser(user);
    setIsUpdateMode(isUpdate); // Set the mode (View or Update)
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = async () => {
    // Update user logic goes here, e.g. API call to update the user details.
    const updatedUser = { ...selectedUser, points: selectedUser.points }; // Example of modifying user points
    try {
      await fetch(`http://localhost:5000/api/loyalty/users/${selectedUser._id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedUser),
        headers: { 'Content-Type': 'application/json' },
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === selectedUser._id ? updatedUser : user))
      );
      handleCloseModal();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 px-3 flex-wrap gap-2">
        <h1 className="fw-bold">Loyalty Users</h1>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-3">
          <Form.Control type="text" placeholder="Search by name, email, or level" value={searchQuery} onChange={handleSearchChange} />
          <Form.Control as="select" value={filter} onChange={handleFilterChange}>
            <option value="">All Levels</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </Form.Control>
        </div>
      </div>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading loyalty users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <Alert variant="info">No loyalty users found.</Alert>
      ) : (
        <div className="table-responsive">
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th className="text-center" onClick={() => handleSort('user.firstName')}>Name</th>
                <th className="text-center" onClick={() => handleSort('user.email')}>Email</th>
                <th className="text-center" onClick={() => handleSort('points')}>Points</th>
                <th className="text-center" onClick={() => handleSort('restaurant.name')}>Level</th>
                <th className="text-center" onClick={() => handleSort('totalReservations')}>totalReservations</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user._id}>
                  <td className="text-center">{user.user?.firstName}</td>
                  <td className="text-center">{user.user?.email}</td>
                  <td className="text-center">{user.points}</td>
                  <td className="text-center">
                    <span className={`badge ${getLevelColor(getUserLevel(user.points))}`}>
                      {getUserLevel(user.points)}
                    </span>
                  </td>

                  <td className="text-center">{user.totalReservations}</td>

                  <td className="text-center">
                    <Button variant="info" size="sm" style={{ backgroundColor: '#0d6efd', color: 'white' }} onClick={() => handleShowModal(user, false)} disabled={loading}>
                      <i className="fas fa-eye" />
                    </Button>
                    {/* <Button variant="warning" size="sm" style={{ marginLeft: '5px' }} onClick={() => handleShowModal(user, true)} disabled={loading}>
                      <i className="fas fa-edit" />
                    </Button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item key={index} active={index === currentPage} onClick={() => handlePageChange(index)}>
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdateMode ? 'Update User' : 'User Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="d-flex flex-wrap gap-3">
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <p>{selectedUser?.user?.firstName || 'N/A'}</p>
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <p>{selectedUser?.user?.email || 'N/A'}</p>
              </Form.Group>
              <Form.Group>
                <Form.Label>Points</Form.Label>
                <p>{selectedUser?.points || 'N/A'}</p>
              </Form.Group>
              <Form.Group>
                <Form.Label>Level</Form.Label>
                <p>{getUserLevel(selectedUser?.points) || 'N/A'}</p>
              </Form.Group>
              <Form.Group>
                <Form.Label>Total Reservations</Form.Label>
                <p>{selectedUser?.totalReservations || 'N/A'}</p>
              </Form.Group>
              <Form.Group>
                <Form.Label>Last Reservation Date</Form.Label>
                <p>{selectedUser?.lastReservationDate || 'N/A'}</p>
              </Form.Group>
            </div>
            {isUpdateMode && (
              <Form.Group className="mt-3">
                <Form.Label>Update Points</Form.Label>
                <Form.Control type="number" value={selectedUser?.points || ''} onChange={(e) => setSelectedUser({ ...selectedUser, points: e.target.value })} />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          {isUpdateMode && <Button variant="primary" onClick={handleUpdateUser}>Save Changes</Button>}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoyaltyUsersPage;
