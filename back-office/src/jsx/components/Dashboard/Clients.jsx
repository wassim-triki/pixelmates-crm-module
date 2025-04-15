import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown, Modal, Button, Form } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from "../../../services/AuthService.js"; // Only getCurrentUser is imported
import { formatError } from "../../../services/AuthService.js"; // Added import for formatError

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const itemsPerPage = 5;
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'email', direction: 'ascending' });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser(); // Returns Axios promise
        const user = response.data; // Extract user data
        console.log('Current User:', user); // Debug output
        setCurrentUser(user);
        if (user && user.role?.name === 'SuperAdmin') {
          fetchData();
        }
      } catch (err) {
        console.error('Authentication check failed:', err.message);
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
      const [usersResponse, rolesResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/users', config),
        axios.get('http://localhost:5000/api/roles', config)
      ]);
      setUsers(usersResponse.data);
      setRoles(rolesResponse.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error fetching data';
      setError(formatError({ message: errorMessage }) || errorMessage);
    } finally {
      setLoading(false);
    }
  };  

  const deleteUser = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this user?');
    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No authentication token found');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`http://localhost:5000/api/users/${id}`, config);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error deleting user';
      console.error('Error deleting user:', err);
      setError(formatError({ message: errorMessage }) || errorMessage);
    }
  };

  const handleChangeStatus = async (user, newStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No authentication token found');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const updatedUser = { ...user, status: newStatus };

      await axios.put(`http://localhost:5000/api/users/${user._id}`, updatedUser, config);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u))
      );
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error updating user status';
      console.error('Error updating user status:', err);
      setError(formatError({ message: errorMessage }) || errorMessage);
    }
  };

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedUser(null); // Reset selectedUser
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null); // Reset selectedUser
  };

  const handleUpdateUser = async () => {
    const isConfirmed = window.confirm('Are you sure you want to edit this user?');
    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No authentication token found');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`http://localhost:5000/api/users/${selectedUser._id}`, selectedUser, config);
      const response = await axios.get('http://localhost:5000/api/users', config);
      setUsers(response.data);
      handleCloseEditModal(); // Updated to use handleCloseEditModal
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error updating user';
      console.error('Error updating user:', err);
      setError(formatError({ message: errorMessage }) || errorMessage);
    }
  };

  const handleShowNewUserModal = () => {
    setShowNewUserModal(true);
  };

  const handleCloseNewUserModal = () => {
    setNewUser({ email: '', password: '', role: '' });
    setShowNewUserModal(false);
  };

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No authentication token found');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post('http://localhost:5000/api/users', newUser, config);
      const usersResponse = await axios.get('http://localhost:5000/api/users', config);
      setUsers(usersResponse.data);
      handleCloseNewUserModal();
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error creating user';
      console.error('Error creating user:', err);
      setError(formatError({ message: errorMessage }) || errorMessage);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      fetchData();
      return;
    }
    
    const filteredUsers = users.filter(user =>
      (user.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.address?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.status?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
    
    setUsers(filteredUsers);
    setCurrentPage(0);
  };

  const sortedUsers = [...users].sort((a, b) => {
    const keyA = sortConfig.key.includes('.') ? sortConfig.key.split('.').reduce((o, i) => o?.[i], a) : a[sortConfig.key];
    const keyB = sortConfig.key.includes('.') ? sortConfig.key.split('.').reduce((o, i) => o?.[i], b) : b[sortConfig.key];
    if (keyA < keyB) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (keyA > keyB) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const paginatedUsers = sortedUsers.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
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
        <Button variant="success" onClick={handleShowNewUserModal} className="me-auto">
          <i className="fas fa-plus"></i> Add New User
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
            All Users
            <i className="las la-angle-down ms-3" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu dropdown-menu-center">
            <Dropdown.Item className="dropdown-item" onClick={() => requestSort('status')}>Active Users</Dropdown.Item>
            <Dropdown.Item className="dropdown-item" onClick={() => requestSort('status')}>Inactive Users</Dropdown.Item>
            <Dropdown.Item className="dropdown-item" onClick={() => requestSort('status')}>Banned Users</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <h1 className="text-center fw-bold">Users List</h1>
<br />
<div className="table-responsive rounded card-table">
  <div className="dataTables_wrapper no-footer">
    <table className="table table-bordered table-striped dataTable no-footer" role="grid">
      <thead>
        <tr>
          <th
            className="sorting text-center"
            style={{ width: 133 }}
            onClick={() => requestSort('email')}
          >
            Email
          </th>
          <th
            className="sorting text-center"
            style={{ width: 193 }}
            onClick={() => requestSort('role.name')}
          >
            Role
          </th>
          <th
            className="sorting text-center"
            style={{ width: 67 }}
            onClick={() => requestSort('status')}
          >
            Status
          </th>
          <th className="text-center" style={{ width: 108 }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedUsers.map((user) => (
          <tr key={user._id} className="alert alert-dismissible border-0 even" role="row">
            <td>{user.email}</td>
            <td>{user.role?.name || 'N/A'}</td>
            <td>
              <span
                className={
                  user.status === 'Active'
                    ? 'text-success'
                    : user.status === 'Inactive'
                    ? 'text-warning'
                    : 'text-danger'
                }
              >
                {user.status}
              </span>
            </td>
            <td>
              <div className="d-flex align-items-center justify-content-end">
                <button
                  className="btn btn-sm me-2"
                  style={{ backgroundColor: '#0d6efd', color: 'white' }}
                  onClick={() => handleShowModal(user)}
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button
                  className="btn btn-sm me-2"
                  style={{ backgroundColor: '#ffc107', color: 'black' }}
                  onClick={() => handleEditModal(user)}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-sm me-2"
                  style={{ backgroundColor: '#dc3545', color: 'white' }}
                  onClick={() => deleteUser(user._id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
                <Dropdown className="dropdown">
                  <Dropdown.Toggle
                    variant=""
                    className="btn btn-sm border-0"
                    as="div"
                    aria-expanded="false"
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                    <Dropdown.Item
                      className="dropdown-item"
                      onClick={() => handleChangeStatus(user, 'Active')}
                    >
                      <i className="las la-check text-success me-3 scale5" />
                      Set Active
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="dropdown-item"
                      onClick={() => handleChangeStatus(user, 'Inactive')}
                    >
                      <i className="las la-times text-warning me-3 scale5" />
                      Set Inactive
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="dropdown-item"
                      onClick={() => handleChangeStatus(user, 'Banned')}
                    >
                      <i className="las la-ban text-danger me-3 scale5" />
                      Set Banned
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
      <div className="dataTables_info" role="status" aria-live="polite">
        Showing {currentPage * itemsPerPage + 1} to{' '}
        {Math.min((currentPage + 1) * itemsPerPage, users.length)} of {users.length} entries
      </div>
      <div className="dataTables_paginate paging_simple_numbers">
        <button
          className="paginate_button previous btn btn-outline-primary btn-sm me-2"
          onClick={() => currentPage > 0 && handlePageClick(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`paginate_button btn btn-sm ${
                currentPage === i ? 'btn-primary text-white' : 'btn-outline-primary'
              } me-1`}
              onClick={() => handlePageClick(i)}
            >
              {i + 1}
            </button>
          ))}
        </span>
        <button
          className="paginate_button next btn btn-outline-primary btn-sm"
          onClick={() => currentPage + 1 < totalPages && handlePageClick(currentPage + 1)}
          disabled={currentPage + 1 === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  </div>
</div>

      <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg" centered>
  <Modal.Header closeButton>
    <Modal.Title className="text-center w-100 fw-bold">Edit User</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedUser && (
      <Form>
        <div className="row">
          <div className="col-md-6 mb-3">
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedUser.firstName || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedUser.lastName || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={selectedUser.phone || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={selectedUser.address || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group controlId="formBirthday">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type="date"
                value={selectedUser.birthday ? selectedUser.birthday.split('T')[0] : ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, birthday: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={selectedUser.password || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setSelectedUser({ ...selectedUser, image: e.target.files[0] })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={selectedUser.role?._id || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: { _id: e.target.value } })}
              >
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={selectedUser.status || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Banned">Banned</option>
              </Form.Control>
            </Form.Group>
          </div>
        </div>
      </Form>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseEditModal}>
      Close
    </Button>
    <Button variant="primary" onClick={handleUpdateUser}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>

      <Modal show={showNewUserModal} onHide={handleCloseNewUserModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center", width: "100%", fontWeight: "bold" }}>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewUserEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formNewUserPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formNewUserRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNewUserModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            Create User
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewModal} onHide={handleCloseViewModal} centered>
  <Modal.Header closeButton>
    <Modal.Title className="text-center w-100 fw-bold">User Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedUser && (
      <div className="text-center">
        <div className="mb-4">
          <img
            src={selectedUser.image || 'default-profile.png'}
            alt="Profile"
            className="rounded-circle img-fluid"
            style={{
              width: '150px',
              height: '150px',
              objectFit: 'cover',
              border: '2px solid #ddd',
            }}
          />
        </div>
        <div className="row text-start">
          <div className="col-6 mb-2">
            <p><strong>First Name:</strong> {selectedUser.firstName || 'N/A'}</p>
          </div>
          <div className="col-6 mb-2">
            <p><strong>Last Name:</strong> {selectedUser.lastName || 'N/A'}</p>
          </div>
          <div className="col-6 mb-2">
            <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
          </div>
          <div className="col-6 mb-2">
            <p><strong>Address:</strong> {selectedUser.address || 'N/A'}</p>
          </div>
          <div className="col-6 mb-2">
            <p><strong>Birthday:</strong> {selectedUser.birthday ? new Date(selectedUser.birthday).toISOString().split('T')[0] : 'N/A'}</p>
          </div>
          <div className="col-6 mb-2">
            <p><strong>Email:</strong> {selectedUser.email}</p>
          </div>
          <div className="col-6 mb-2">
            <p><strong>Role:</strong> {selectedUser.role?.name || 'N/A'}</p>
          </div>
          <div className="col-6 mb-2">
            <p><strong>Status:</strong> {selectedUser.status}</p>
          </div>
        </div>
      </div>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseViewModal}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
    </>
  );
};

export default UserList;