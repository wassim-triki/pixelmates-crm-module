import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown, Modal, Button, Form } from 'react-bootstrap'; // Import Modal, Button, and Form

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // Add state for roles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // You can adjust this to show more or fewer items per page

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: '' });

  const [sortConfig, setSortConfig] = useState({ key: 'email', direction: 'ascending' });

  useEffect(() => {
    // Fetch users from the backend API
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (err) {
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    // Fetch roles from the backend API
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/roles');
        setRoles(response.data);
      } catch (err) {
        setError('Error fetching roles');
      }
    };

    fetchUsers();
    fetchRoles();
  }, []);

  const deleteUser = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this user?');
    if (!isConfirmed) {
      return;
    }
  
    try {
      console.log(`Deleting user with id: ${id}`);
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      console.log(`User with id: ${id} deleted successfully`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id)); // Use user._id if the id field is _id in the database
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Error deleting user');
    }
  };

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleUpdateUser = async () => {
    const isConfirmed = window.confirm('Are you sure you want to edit this user?');
    if (!isConfirmed) {
      return;
    }
  
    try {
      await axios.put(`http://localhost:5000/api/users/${selectedUser._id}`, selectedUser);
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
      handleCloseModal();
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Error updating user');
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
      const response = await axios.post('http://localhost:5000/api/users', newUser);
      const usersResponse = await axios.get('http://localhost:5000/api/users');
      setUsers(usersResponse.data);
      handleCloseNewUserModal();
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Error creating user');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="d-sm-flex mb-lg-4 mb-2">
        <Button variant="success" onClick={handleShowNewUserModal} className="me-auto">
          <i className="fas fa-plus"></i> Add New User
        </Button>

        <Dropdown className="dropdown mb-2 ms-auto me-3">
          <Dropdown.Toggle className="btn btn-primary btn-rounded light" aria-expanded="false">
            <i className="las la-bolt scale5 me-3" />
            All Users
            <i className="las la-angle-down ms-3" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu dropdown-menu-center">
            <Dropdown.Item className="dropdown-item">Active Users</Dropdown.Item>
            <Dropdown.Item className="dropdown-item">Inactive Users</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        
        
      </div>

      <h1 className="text-center" style={{ fontWeight: "bold" }}>Users List</h1><br></br>
      <div className="table-responsive rounded card-table">
        <div className="dataTables_wrapper no-footer">
          <table className="table table-bordered table-striped dataTable no-footer" role="grid">
            <thead>
              <tr>
                <th className="sorting text-center" style={{ width: 133 }} onClick={() => requestSort('email')}>
                  Email
                </th>
                <th className="sorting text-center" style={{ width: 193 }} onClick={() => requestSort('role.name')}>
                  Role
                </th>
                <th className="sorting text-center" style={{ width: 67 }} onClick={() => requestSort('status')}>
                  Status
                </th>
                <th className class="text-center" style={{ width: 108 }} > Actions</th>
              </tr>
            </thead>
            <tbody>
  {paginatedUsers.map((user) => (
    <tr key={user._id} className="alert alert-dismissible border-0 even" role="row">
      <td>{user.email}</td>
      <td>{user.role.name}</td> {/* Affichage du rôle */}

      <td>
        <span className={user.status === "Active" ? "text-success" : "text-danger"}>
          {user.status}
        </span>
      </td>

      <td>
        <div className="d-flex align-items-center justify-content-end">
          {/* Bouton View (Bleu) */}
          <button className="btn btn-sm me-2" style={{ backgroundColor: "#0d6efd", color: "white" }} onClick={() => handleShowModal(user)}>
            <i className="fas fa-eye"></i>
          </button>

          {/* Bouton Edit (Jaune / Orange) */}
          <button className="btn btn-sm me-2" style={{ backgroundColor: "#ffc107", color: "black" }} onClick={() => handleShowModal(user)}>
            <i className="fas fa-edit"></i>
          </button>

          {/* Bouton Delete (Rouge) */}
          <button className="btn btn-sm me-2" style={{ backgroundColor: "#dc3545", color: "white" }} onClick={() => deleteUser(user._id)}>
            <i className="fas fa-trash"></i>
          </button>

          {/* Dropdown pour changer le statut */}
          <Dropdown className="dropdown">
            <Dropdown.Toggle
              variant=""
              className="btn btn-sm border-0"
              to="#"
              as="div"
              aria-expanded="false"
            >
              <i className="fas fa-ellipsis-v"></i> {/* Icône pour le menu déroulant */}
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                <Dropdown.Item className="dropdown-item" onClick={() => handleChangeStatus(user, "Active")}>
                  <i className="las la-check text-success me-3 scale5" />
                  Set Active
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-item" onClick={() => handleChangeStatus(user, "Inactive")}>
                  <i className="las la-times text-warning me-3 scale5" />
                  Set Inactive
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-item" onClick={() => handleChangeStatus(user, "Banned")}>
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.firstName}
                  onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.lastName}
                  onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.phone}
                  onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.address}
                  onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formBirthday">
                <Form.Label>Birthday</Form.Label>
                <Form.Control
                  type="date"
                  value={selectedUser.birthday ? selectedUser.birthday.split('T')[0] : ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, birthday: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formRole">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedUser.role._id} // Use role ID for selection
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                >
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedUser.status}
                  onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Inactive">Banned</option>
                </Form.Control>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showNewUserModal} onHide={handleCloseNewUserModal}>
      <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
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
    </>
  );
};

export default UserList;