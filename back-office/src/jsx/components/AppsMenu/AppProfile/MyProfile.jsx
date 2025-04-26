import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Mail, Phone, Calendar, Home, User, Edit3 } from "lucide-react";
import styled, { keyframes } from "styled-components";
import PageTitle from "../../../layouts/PageTitle";
import { getCurrentUser } from "../../../../services/AuthService";
import profile from "../../../../assets/images/profile/profile.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shine = keyframes`
  to {
    background-position: 300% center;
  }
`;

// Styled Components
const ProfileCard = styled(Card)`
  border: none;
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    transform: translateY(-8px);
  }
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #ff7f7f, #fa8072);
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: -30px;
    left: -10%;
    width: 120%;
    height: 60px;
    background: white;
    transform: rotate(-3deg);
  }
`;

const ProfileImage = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 10px 30px rgba(250, 128, 114, 0.2);
  transition: all 0.3s ease;
  animation: ${float} 4s ease-in-out infinite;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 40px rgba(250, 128, 114, 0.3);
  }
`;

const InfoCard = styled.div`
  padding: 1.5rem;
  background: white;
  border-radius: 15px;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: linear-gradient(to bottom, #ff7f7f, #fa8072);
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(250, 128, 114, 0.15);
  }
`;

const LoadingSkeleton = styled(Skeleton)`
  background-image: linear-gradient(
    90deg,
    #fff5f7 25%,
    #ffecef 50%,
    #fff5f7 75%
  );
  background-size: 200% 100%;
  animation: ${shine} 1.5s linear infinite;
`;

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

  const ProfileSkeleton = () => (
    <ProfileCard className="border-0">
      <Card.Body className="text-center py-5">
        <LoadingSkeleton circle width={150} height={150} className="mb-4" />
        <LoadingSkeleton width={200} height={30} className="mb-3" />
        <LoadingSkeleton width={250} height={20} className="mb-4" />
        <Row className="g-4">
          {[...Array(4)].map((_, i) => (
            <Col md={6} key={i}>
              <LoadingSkeleton height={100} />
            </Col>
          ))}
        </Row>
        <LoadingSkeleton width={150} height={45} className="mt-4 mx-auto" />
      </Card.Body>
    </ProfileCard>
  );

  if (loading) return <ProfileSkeleton />;

  if (error) return (
    <div className="text-center mt-5">
      <Alert variant="danger" className="d-inline-block border-0" style={{
        background: 'linear-gradient(145deg, #fff5f7, white)',
        boxShadow: '0 10px 30px rgba(250, 128, 114, 0.15)',
        borderRadius: '15px'
      }}>
        <h5 className="text-danger mb-3">⚠️ Loading Error</h5>
        <p className="mb-3">{error}</p>
        <Button 
          variant="outline-danger"
          onClick={() => window.location.reload()}
          style={{
            border: '2px solid #fa8072',
            color: '#fa8072',
            fontWeight: 600
          }}
        >
          Retry
        </Button>
      </Alert>
    </div>
  );

  return (
    <div className="page-wrapper">
      <PageTitle activeMenu="My Profile" motherMenu="Account" />

      <Row className="justify-content-center">
        <Col xl={8} lg={10} md={12}>
          <ProfileCard>
            <ProfileHeader>
              <ProfileImage>
                <img
                  src={user?.image || profile}
                  alt="Profile"
                />
              </ProfileImage>
            </ProfileHeader>

            <Card.Body className="pt-5 pb-4 px-4">
              <div className="text-center mb-4">
                <h2 className="mb-1" style={{ color: '#fa8072' }}>
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-muted mb-0 d-flex justify-content-center align-items-center">
                  <Mail size={18} className="me-2" style={{ color: '#fa8072' }} />
                  {user?.email || 'Not provided'}
                </p>
              </div>

              <Row className="g-4">
                <Col md={6}>
                  <InfoCard>
                    <div className="d-flex align-items-center ps-3">
                      <Phone size={20} className="me-3" style={{ color: '#fa8072' }} />
                      <div>
                        <h6 className="fw-bold mb-1 text-uppercase small">Phone</h6>
                        <p className="mb-0">{user?.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </InfoCard>
                </Col>

                <Col md={6}>
                  <InfoCard>
                    <div className="d-flex align-items-center ps-3">
                      <Home size={20} className="me-3" style={{ color: '#fa8072' }} />
                      <div>
                        <h6 className="fw-bold mb-1 text-uppercase small">Address</h6>
                        <p className="mb-0">{user?.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </InfoCard>
                </Col>

                <Col md={6}>
                  <InfoCard>
                    <div className="d-flex align-items-center ps-3">
                      <Calendar size={20} className="me-3" style={{ color: '#fa8072' }} />
                      <div>
                        <h6 className="fw-bold mb-1 text-uppercase small">Birthday</h6>
                        <p className="mb-0">
                          {user?.birthday ? new Date(user.birthday).toLocaleDateString() : 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </InfoCard>
                </Col>

                <Col md={6}>
                  <InfoCard>
                    <div className="d-flex align-items-center ps-3">
                      <User size={20} className="me-3" style={{ color: '#fa8072' }} />
                      <div>
                        <h6 className="fw-bold mb-1 text-uppercase small">Role</h6>
                        <p className="mb-0">{user?.role?.name || 'Not assigned'}</p>
                      </div>
                    </div>
                  </InfoCard>
                </Col>
              </Row>

              <div className="text-center mt-4">
                <Link 
                  to="/update-profile" 
                  className="btn btn-lg"
                  style={{
                    background: 'linear-gradient(135deg, #ff7f7f, #fa8072)',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '0.8rem 2.5rem',
                    fontWeight: 600,
                    boxShadow: '0 5px 15px rgba(250, 128, 114, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Edit3 size={18} className="me-2" />
                  Edit Profile
                </Link>
              </div>
            </Card.Body>
          </ProfileCard>
        </Col>
      </Row>
    </div>
  );
};

export default MyProfile;