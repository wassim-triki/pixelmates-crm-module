import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { getCurrentUser } from "../../../../services/AuthService";
import profilePlaceholder from "../../../../assets/images/profile/profile.png"; 
import axiosInstance from "../../../../services/AxiosInstance";
import PageTitle from "../../../layouts/PageTitle";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { User, Mail, Phone, Home, Calendar } from "lucide-react"; // Icons for form fields

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
    image: "", // Add image field
  });
  const [imagePreview, setImagePreview] = useState(""); // For image preview
  const navigate = useNavigate();

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phone: response.data.phone || '',
          address: response.data.address || '',
          birthday: response.data.birthday ? new Date(response.data.birthday).toISOString().split('T')[0] : '',
          image: response.data.image || '', // Set image
        });
        setImagePreview(response.data.image || ''); // Set image preview if exists
      } catch (err) {
        setError("Error fetching user data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prompt user for confirmation before updating
    const isConfirmed = window.confirm("Are you sure you want to update your profile?");
    if (!isConfirmed) return; // Do nothing if user clicks "Cancel"

    setLoading(true);
    try {
      const response = await axiosInstance.put(`/users/${user.id}`, formData);
      setUser(response.data);
      navigate("/my-profile"); // Redirect to profile page after successful update
    } catch (err) {
      setError("Error updating user data: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="page-wrapper">
      <PageTitle activeMenu="Update Profile" motherMenu={<Link to="/my-profile">My Profile</Link>} />
      
      <Row className="justify-content-center">
        <Col xl={8} lg={10} md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>

              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <img
                    src={imagePreview || profilePlaceholder}
                    alt="Profile"
                    className="rounded-circle"
                    width="150"
                    height="150"
                    style={{ objectFit: "cover", border: "4px solid #eee" }}
                  />
                  <Form.Label
                    htmlFor="image"
                    className="position-absolute bottom-0 end-0 bg-white rounded-circle p-2 cursor-pointer"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa fa-camera" style={{ fontSize: "18px", color: "#000" }}></i>
                  </Form.Label>
                </div>

                <Form.Control
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="d-none"
                />
              </div>

              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  {/* First Name */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label><User size={18} /> First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  {/* Last Name */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label><User size={18} /> Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  {/* Email */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label><Mail size={18} /> Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </Form.Group>
                  </Col>

                  {/* Phone */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label><Phone size={18} /> Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  {/* Address */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label><Home size={18} /> Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  {/* Birthday */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label><Calendar size={18} /> Birthday</Form.Label>
                      <Form.Control
                        type="date"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Submit Button */}
                <div className="text-center mt-4">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Update Profile"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UpdateProfile;