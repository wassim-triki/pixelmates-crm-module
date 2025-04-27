import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { getCurrentUser } from '../../../../services/AuthService';
import profilePlaceholder from '../../../../assets/images/profile/profile.png';
import axiosInstance from '../../../../services/AxiosInstance';
import PageTitle from '../../../layouts/PageTitle';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Home, Calendar, Camera } from 'lucide-react';
import styled from 'styled-components';

// Styled Components
const ProfileCard = styled(Card)`
  border: none;
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #ff7f7f, #fa8072);
  padding: 2.5rem;
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -25px;
    left: -5%;
    width: 110%;
    height: 50px;
    background: white;
    transform: rotate(-2deg);
  }
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  margin: 0 auto 2rem;
  width: fit-content;
`;

const ProfileImage = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 4px solid white;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const CameraIcon = styled.label`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: white;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;

  svg {
    color: #fa8072;
    width: 20px;
    height: 20px;
  }
`;

const FormCard = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  position: relative;
  border: 1px solid #ffecef;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: #fa8072;
  }

  input {
    height: 15px;
    font-size: 14px;
  }
`;

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          birthday: response.data.birthday
            ? new Date(response.data.birthday).toISOString().split('T')[0]
            : '',
          image: response.data.image || '',
        });
        setImagePreview(response.data.image || '');
      } catch (err) {
        setError('Error fetching user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to update your profile?'))
      return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('firstName', formData.firstName);
      form.append('lastName', formData.lastName);
      form.append('email', formData.email);
      form.append('phone', formData.phone);
      form.append('address', formData.address);
      form.append('birthday', formData.birthday);
      if (formData.image instanceof File) {
        form.append('image', formData.image);
      }
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No token found in localStorage');
        setLoading(false);
        return;
      }
      const response = await axiosInstance.put('/auth/me/update', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(response.data);
      navigate('/my-profile');
    } catch (err) {
      setError('Error updating profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5 py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-5">
        <Alert variant="danger" className="d-inline-block border-0">
          <h5 className="text-danger mb-3">⚠️ Error</h5>
          <p className="mb-3">{error}</p>
          <Button
            variant="outline-danger"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Alert>
      </div>
    );

  return (
    <div className="page-wrapper">
      <PageTitle
        activeMenu="Update Profile"
        motherMenu={<Link to="/my-profile">My Profile</Link>}
      />
      <Row className="justify-content-center py-4">
        <Col xl={10} lg={12} md={12}>
          <ProfileCard>
            <ProfileHeader>
              <ProfileImageWrapper>
                <ProfileImage>
                  <img src={imagePreview || profilePlaceholder} alt="Profile" />
                </ProfileImage>
                <CameraIcon htmlFor="upload-photo">
                  <Camera />
                </CameraIcon>
                <input
                  type="file"
                  id="upload-photo"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </ProfileImageWrapper>
            </ProfileHeader>
            <Card.Body className="pt-4 pb-4 px-4">
              <Form onSubmit={handleSubmit}>
                <Row className="g-4">
                  <Col md={6}>
                    <FormCard>
                      <Form.Group>
                        <div className="d-flex align-items-center ps-3">
                          <User
                            size={20}
                            className="me-3"
                            style={{ color: '#fa8072' }}
                          />
                          <Form.Label className="fw-bold">
                            FIRST NAME
                          </Form.Label>
                        </div>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="border-0 ps-5"
                        />
                      </Form.Group>
                    </FormCard>
                  </Col>
                  <Col md={6}>
                    <FormCard>
                      <Form.Group>
                        <div className="d-flex align-items-center ps-3">
                          <User
                            size={20}
                            className="me-3"
                            style={{ color: '#fa8072' }}
                          />
                          <Form.Label className="fw-bold">LAST NAME</Form.Label>
                        </div>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="border-0 ps-5"
                        />
                      </Form.Group>
                    </FormCard>
                  </Col>
                  <Col md={6}>
                    <FormCard>
                      <Form.Group>
                        <div className="d-flex align-items-center ps-3">
                          <Mail
                            size={20}
                            className="me-3"
                            style={{ color: '#fa8072' }}
                          />
                          <Form.Label className="fw-bold">EMAIL</Form.Label>
                        </div>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border-0 ps-5"
                        />
                      </Form.Group>
                    </FormCard>
                  </Col>
                  <Col md={6}>
                    <FormCard>
                      <Form.Group>
                        <div className="d-flex align-items-center ps-3">
                          <Phone
                            size={20}
                            className="me-3"
                            style={{ color: '#fa8072' }}
                          />
                          <Form.Label className="fw-bold">PHONE</Form.Label>
                        </div>
                        <Form.Control
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="border-0 ps-5"
                        />
                      </Form.Group>
                    </FormCard>
                  </Col>
                  <Col md={6}>
                    <FormCard>
                      <Form.Group>
                        <div className="d-flex align-items-center ps-3">
                          <Home
                            size={20}
                            className="me-3"
                            style={{ color: '#fa8072' }}
                          />
                          <Form.Label className="fw-bold">ADDRESS</Form.Label>
                        </div>
                        <Form.Control
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="border-0 ps-5"
                        />
                      </Form.Group>
                    </FormCard>
                  </Col>
                  <Col md={6}>
                    <FormCard>
                      <Form.Group>
                        <div className="d-flex align-items-center ps-3">
                          <Calendar
                            size={20}
                            className="me-3"
                            style={{ color: '#fa8072' }}
                          />
                          <Form.Label className="fw-bold">BIRTHDAY</Form.Label>
                        </div>
                        <Form.Control
                          type="date"
                          name="birthday"
                          value={formData.birthday}
                          onChange={handleChange}
                          className="border-0 ps-5"
                        />
                      </Form.Group>
                    </FormCard>
                  </Col>
                </Row>
                <div className="text-center mt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: '#fa8072',
                      color: 'white',
                      borderRadius: '8px',
                      padding: '0.7rem 2rem',
                      fontWeight: 'bold',
                      border: 'none',
                    }}
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </ProfileCard>
        </Col>
      </Row>
    </div>
  );
};

export default UpdateProfile;
