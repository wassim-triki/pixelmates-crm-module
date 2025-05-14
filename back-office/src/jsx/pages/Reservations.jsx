// src/jsx/pages/Admin/Reservations.jsx
import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageTitle from '../layouts/PageTitle';

const Reservations = () => {
  const [reservations] = useState([
    {
      id: '201',
      customer: 'Alice Smith',
      email: 'alice@example.com',
      restaurant: 'Chez Nous',
      table: 'T1',
      date: '2025-05-16',
      time: '14:00',
      guests: 3,
      status: 'pending',
    },
    {
      id: '202',
      customer: 'Bob Johnson',
      email: 'bob@example.com',
      restaurant: 'La Table d’Or',
      table: 'T4',
      date: '2025-05-17',
      time: '19:30',
      guests: 2,
      status: 'confirmed',
    },
    {
      id: '203',
      customer: 'Carol Lee',
      email: 'carol@example.com',
      restaurant: 'Ocean View',
      table: 'T2',
      date: '2025-05-18',
      time: '12:00',
      guests: 5,
      status: 'cancelled',
    },
  ]);

  const renderStatus = (status) => {
    const map = {
      pending: { label: 'Pending', badge: 'warning', icon: 'fa-stream' },
      confirmed: { label: 'Confirmed', badge: 'success', icon: 'fa-check' },
      cancelled: { label: 'Cancelled', badge: 'secondary', icon: 'fa-ban' },
    };
    const s = map[status] || map.pending;
    return (
      <span className={`badge badge-${s.badge}`}>
        {s.label} <span className={`ms-1 fa ${s.icon}`} />
      </span>
    );
  };

  return (
    <div className="h-80">
      <PageTitle activeMenu="Reservations" motherMenu="Admin" />
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body" style={{ padding: '1.25rem' }}>
              <div className="table-responsive">
                <table className="table table-sm mb-0 table-responsive-lg text-black">
                  <thead>
                    <tr>
                      <th />
                      <th>Reservation</th>
                      <th>Restaurant</th>
                      <th>Table</th>
                      <th>Date & Time</th>
                      <th className="text-right">Guests</th>
                      <th className="text-right">Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r.id} className="btn-reveal-trigger">
                        <td className="py-2">
                          <div className="form-check custom-checkbox">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`chk-${r.id}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`chk-${r.id}`}
                            />
                          </div>
                        </td>
                        <td className="py-2">
                          <strong>#{r.id}</strong> by{' '}
                          <strong>{r.customer}</strong>
                          <br />
                          <a href={`mailto:${r.email}`}>{r.email}</a>
                        </td>
                        <td className="py-2">{r.restaurant}</td>
                        <td className="py-2">{r.table}</td>
                        <td className="py-2">
                          {r.date} at {r.time}
                        </td>
                        <td className="py-2 text-right">{r.guests}</td>
                        <td className="py-2 text-right">
                          {renderStatus(r.status)}
                        </td>
                        <td className="py-2 text-right">
                          <Dropdown className="dropdown text-sans-serif">
                            <Dropdown.Toggle
                              variant=""
                              className="btn btn-primary i-false tp-btn-light sharp"
                              id={`dropdown-${r.id}`}
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
                            <Dropdown.Menu
                              className="dropdown-menu-right border py-0"
                              aria-labelledby={`dropdown-${r.id}`}
                            >
                              <div className="py-2">
                                <Link className="dropdown-item" to="#">
                                  View
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  Confirm
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  Cancel
                                </Link>
                                <div className="dropdown-divider" />
                                <Link
                                  className="dropdown-item text-danger"
                                  to="#"
                                >
                                  Delete
                                </Link>
                              </div>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
