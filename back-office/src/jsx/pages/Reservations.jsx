// src/pages/Reservations.jsx
import React, { useState, useEffect } from 'react';
import { Spinner, Dropdown, Form, Alert } from 'react-bootstrap';
import PageTitle from '../layouts/PageTitle';
import axiosInstance from '../../config/axios';
import { useAuth } from '../../context/authContext';
import CustomModal from '../layouts/CustomModal';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [tablesList, setTablesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // — Modal state —
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({
    id: '',
    date: '',
    time: '',
    covers: 1,
    status: 'pending',
    tableId: '',
    userId: '',
  });
  const [modalError, setModalError] = useState('');
  const [showView, setShowView] = useState(false);
  const [viewData, setViewData] = useState(null);

  // Determine super-admin
  useEffect(() => {
    if (user) {
      setIsSuperAdmin(user.role.name === 'SuperAdmin');
    }
  }, [user]);

  // Load reservations
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get('/reservations');
        setReservations(response.data.data || response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load tables for dropdown
  useEffect(() => {
    if (!user) return;
    const restaurantId = user.restaurant?._id;
    const url = isSuperAdmin
      ? '/tables'
      : `/restaurants/${restaurantId}/tables`;
    axiosInstance
      .get(url)
      .then((res) => setTablesList(res.data.data || res.data))
      .catch((err) => console.error('Failed to load tables', err));
  }, [user, isSuperAdmin]);

  // Map status to badge
  const renderStatus = (status) => {
    const map = {
      pending: { label: 'Pending', badge: 'warning', icon: 'fa-stream' },
      confirmed: { label: 'Confirmed', badge: 'success', icon: 'fa-check' },
      cancelled: { label: 'Cancelled', badge: 'secondary', icon: 'fa-ban' },
    };
    const s = map[status] || map.pending;
    return (
      <span className={`badge badge-${s.badge}`}>
        {s.label} <i className={`ms-1 fa ${s.icon}`} />
      </span>
    );
  };

  // Handlers
  const handleViewClick = (r) => {
    setViewData(r);
    setShowView(true);
  };

  const handleEditClick = (r) => {
    const d = new Date(r.start);
    setEditData({
      id: r._id,
      date: d.toISOString().slice(0, 10),
      time: d.toISOString().substring(11, 16),
      covers: r.covers,
      status: r.status,
      tableId: r.table._id || r.table,
      userId: r.user._id,
    });
    setModalError('');
    setShowEdit(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        guests: editData.covers,
        date: editData.date,
        time: editData.time,
        tableId: editData.tableId,
        status: editData.status,
      };
      if (isSuperAdmin && editData.userId) payload.userId = editData.userId;

      const response = await axiosInstance.patch(
        `/reservations/${editData.id}`,
        payload
      );
      const updated = response.data;
      setReservations((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
      setShowEdit(false);
    } catch (err) {
      console.error(err);
      setModalError(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Really delete this reservation?')) return;
    try {
      await axiosInstance.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  if (error)
    return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <>
      <PageTitle activeMenu="Reservations" motherMenu="Admin" />

      <div className="table-responsive">
        <table className="table table-sm mb-0 text-black">
          <thead>
            <tr>
              <th />
              <th>Client</th>
              <th>Email</th>
              {isSuperAdmin && <th>Restaurant</th>}
              <th>Table</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th className="text-right">Guests</th>
              <th className="text-right">Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => {
              const start = new Date(r.start);
              const end = new Date(r.end);
              return (
                <tr key={r._id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    {r.user.firstName} {r.user.lastName}
                  </td>
                  <td>
                    <a href={`mailto:${r.user.email}`}>{r.user.email}</a>
                  </td>
                  {isSuperAdmin && <td>{r.restaurant.name}</td>}
                  <td>{r.table.number}</td>
                  <td>{start.toLocaleDateString()}</td>
                  <td>
                    {start.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td>
                    {end.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="text-right">{r.covers}</td>
                  <td className="text-right">{renderStatus(r.status)}</td>
                  <td className="text-right">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant=""
                        className="btn btn-primary i-false tp-btn-light sharp"
                        id={`dropdown-${r._id}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="5" cy="12" r="2" fill="#000" />
                          <circle cx="12" cy="12" r="2" fill="#000" />
                          <circle cx="19" cy="12" r="2" fill="#000" />
                        </svg>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-right border py-0 z-3">
                        <div className="py-2">
                          <button
                            className="dropdown-item"
                            onClick={() => handleViewClick(r)}
                          >
                            View
                          </button>
                          <button
                            className="dropdown-item"
                            onClick={() => handleEditClick(r)}
                          >
                            Edit
                          </button>
                          <div className="dropdown-divider" />
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => handleDelete(r._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* — Edit Modal — */}
      <CustomModal
        title="Edit Reservation"
        show={showEdit}
        onHide={() => setShowEdit(false)}
        onSave={handleSave}
        saveLabel="Save changes"
      >
        {modalError && <Alert variant="danger">{modalError}</Alert>}
        <Form>
          <Form.Group className="mb-2" controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={editData.date}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="formTime">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="time"
              name="time"
              value={editData.time}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="formCovers">
            <Form.Label>Guests</Form.Label>
            <Form.Control
              type="number"
              name="covers"
              min="1"
              value={editData.covers}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="formTable">
            <Form.Label>Table</Form.Label>
            <Form.Select
              name="tableId"
              value={editData.tableId}
              onChange={handleChange}
            >
              {tablesList.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.number}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {isSuperAdmin && (
            <Form.Group className="mb-2" controlId="formUser">
              <Form.Label>Override User ID</Form.Label>
              <Form.Control
                type="text"
                name="userId"
                value={editData.userId}
                onChange={handleChange}
              />
            </Form.Group>
          )}
          <Form.Group className="mb-2" controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={editData.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </CustomModal>

      {/* — View Modal — */}
      <CustomModal
        title="Reservation Details"
        show={showView}
        onHide={() => setShowView(false)}
      >
        {viewData && (
          <>
            <p>
              <strong>Client:</strong> {viewData.user.firstName}{' '}
              {viewData.user.lastName}
            </p>
            {isSuperAdmin && (
              <p>
                <strong>Restaurant:</strong> {viewData.restaurant.name}
              </p>
            )}
            <p>
              <strong>Table:</strong> {viewData.table.number}
            </p>
            <p>
              <strong>Date:</strong>{' '}
              {new Date(viewData.start).toLocaleDateString()}
            </p>
            <p>
              <strong>Start Time:</strong>{' '}
              {new Date(viewData.start).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p>
              <strong>End Time:</strong>{' '}
              {new Date(viewData.end).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p>
              <strong>Guests:</strong> {viewData.covers}
            </p>
            <p>
              <strong>Status:</strong> {renderStatus(viewData.status)}
            </p>
          </>
        )}
      </CustomModal>
    </>
  );
};

export default Reservations;
