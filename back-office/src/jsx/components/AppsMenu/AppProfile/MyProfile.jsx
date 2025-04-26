import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Mail, Phone, Calendar, Home, User, Edit3 } from "lucide-react";
import PageTitle from "../../../layouts/PageTitle";
import { getCurrentUser } from "../../../../services/AuthService";
import profile from "../../../../assets/images/profile/profile.png"; // Default image

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (err) {
        setError("Error fetching user data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="page-wrapper">
      <PageTitle activeMenu="My Profile" motherMenu="Account" />

      <Row className="justify-content-center">
        <Col xl={8} lg={10} md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center py-5">
               {/* Profile Image */}
              <div className="mb-4">
                <img
                  src={user?.image || profile}
                  alt="Profile"
                  className="rounded-circle"
                  width="150"
                  height="150"
                  style={{ objectFit: "cover", border: "4px solid #eee" }}
                />
              </div>

              {/* User Name */}
              <h3 className="mb-1">{user?.firstName} {user?.lastName}</h3>

              {/* Email */}
              <p className="text-muted mb-4 d-flex justify-content-center align-items-center">
                <Mail size={18} className="me-2" />
                {user?.email || 'Not provided'}
              </p>

              {/* User Details */}
              <Row className="justify-content-center text-center">
                {/* Phone */}
                <Col md={6} className="mb-3">
                  <div className="d-flex justify-content-center align-items-center">
                    <Phone size={18} className="me-2" />
                    <div>
                      <h6 className="fw-bold mb-1">Phone</h6>
                      <p className="mb-0">{user?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </Col>

                {/* Address */}
                <Col md={6} className="mb-3">
                  <div className="d-flex justify-content-center align-items-center">
                    <Home size={18} className="me-2" />
                    <div>
                      <h6 className="fw-bold mb-1">Address</h6>
                      <p className="mb-0">{user?.address || 'Not provided'}</p>
                    </div>
                  </div>
                </Col>

                {/* Birthday */}
                <Col md={6} className="mb-3">
                  <div className="d-flex justify-content-center align-items-center">
                    <Calendar size={18} className="me-2" />
                    <div>
                      <h6 className="fw-bold mb-1">Birthday</h6>
                      <p className="mb-0">
                        {user?.birthday ? new Date(user.birthday).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>
                  </div>
                </Col>

                {/* Role */}
                <Col md={6} className="mb-3">
                  <div className="d-flex justify-content-center align-items-center">
                    <User size={18} className="me-2" />
                    <div>
                      <h6 className="fw-bold mb-1">Role</h6>
                      <p className="mb-0">{user?.role?.name || 'Not assigned'}</p>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Edit Profile Button */}
              <div className="mt-4">
                <Link to="/update-profile" className="btn btn-primary">
                  <Edit3 size={18} className="me-2" />
                  Edit Profile
                </Link>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyProfile;
