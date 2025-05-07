import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/authContext';
import { Alert, Button, Dropdown, Spinner } from 'react-bootstrap';

const LoyaltyUsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="container-fluid py-4">
      {/* Error Alert */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-3 flex-wrap gap-2">
        {/* Header Section */}
        <div>
          <h1 className="fw-bold">Loyalty Users</h1>
        </div>
        <Button variant="info" className="d-flex align-items-center gap-2">
          <i className="fas fa-plus"></i>
          <span>Add User</span>
        </Button>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading loyalty users...</p>
        </div>
      ) : users.length === 0 ? (
        <Alert variant="info">No loyalty users found.</Alert>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-main">
              <tr>
                <th className="text-center">Name</th>
                <th className="text-center">Email</th>
                <th className="text-center">Points</th>
                <th className="text-center">Restaurant</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.user?.firstName}</td>
                  <td>{user.user?.email}</td>
                  <td>{user.points}</td>
                  <td>{user.restaurant?.name}</td>
                  <td className="text-center">
                    <Button variant="outline-primary" size="sm">
                      View
                    </Button>
                    <Button variant="outline-danger" size="sm" className="ms-2">
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoyaltyUsersPage;
