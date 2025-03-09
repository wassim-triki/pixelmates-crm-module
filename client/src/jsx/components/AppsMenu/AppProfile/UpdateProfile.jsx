import React, { Fragment, useReducer, useEffect, useState } from "react";
import { Button, Dropdown, Tab, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import profile from "../../../../assets/images/profile/profile.png";
import PageTitle from "../../../layouts/PageTitle";
import axios from 'axios';
import { getCurrentUser } from "../../../../services/AuthService.js";

const initialState = false;
const reducer = (state, action) => {
    switch (action.type) {
        case 'sendMessage':
            return { ...state, sendMessage: !state.sendMessage }
        case 'postModal':
            return { ...state, post: !state.post }
        case 'linkModal':
            return { ...state, link: !state.link }
        case 'cameraModal':
            return { ...state, camera: !state.camera }
        case 'replyModal':
            return { ...state, reply: !state.reply }
        default:
            return state
    }
}




const Update_Profile = () => {
    const [, dispatch] = useReducer(reducer, initialState);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        address: '',
        phone: '',
        birthday: '',
        image: '',
        role: '',
        status: ''
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getCurrentUser();
                setUser(response.data);
                setFormData({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    password: '',
                    address: response.data.address,
                    phone: response.data.phone,
                    birthday: response.data.birthday ? response.data.birthday.split('T')[0] : '',
                    image: response.data.image,
                    role: response.data.role.name,
                    status: response.data.status
                });
            } catch (err) {
                setError('Error fetching user data: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('User data is not available');
            return;
        }
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('No authentication token found');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }
            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            await axios.put(`http://localhost:5000/api/users/${user.id}`, formDataToSend, config);
            alert('Profile updated successfully');
        } catch (err) {
            setError('Error updating profile: ' + err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Fragment>
            <PageTitle activeMenu="Profile" motherMenu="App" />

            <div className="row">
                <div className="col-lg-12">
                    <div className="profile card card-body px-3 pt-3 pb-0">
                        <div className="profile-head">
                            <div className="photo-content ">
                                <div className="cover-photo rounded"></div>
                            </div>
                            <div className="profile-info">
                                <div className="profile-photo">
                                    <img src={user?.image} className="img-fluid rounded-circle" alt="profile" />
                                </div>
                                <div className="profile-details">
                                    <div className="profile-name px-3 pt-2">
                                        <h4 className="text-primary mb-0">{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</h4>
                                        <p>{user ? user.role.name : ''}</p>
                                    </div>
                                    <div className="profile-email px-2 pt-2">
                                        <h4 className="text-muted mb-0">{user ? user.email : 'Loading...'}</h4>
                                        <p>Email</p>
                                    </div>
                                    <Dropdown className="dropdown ms-auto">
                                        <Dropdown.Toggle
                                            variant="primary"
                                            className="btn btn-primary light sharp i-false"
                                            data-toggle="dropdown"
                                            aria-expanded="true"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                            >
                                                <g
                                                    stroke="none"
                                                    strokeWidth="1"
                                                    fill="none"
                                                    fillRule="evenodd"
                                                >
                                                    <rect x="0" y="0" width="24" height="24"></rect>
                                                    <circle fill="#000000" cx="5" cy="12" r="2"></circle>
                                                    <circle fill="#000000" cx="12" cy="12" r="2"></circle>
                                                    <circle fill="#000000" cx="19" cy="12" r="2"></circle>
                                                </g>
                                            </svg>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                                            <Dropdown.Item className="dropdown-item">
                                                <i className="fa fa-user-circle text-primary me-2" />
                                                View profile
                                            </Dropdown.Item>
                                            <Dropdown.Item className="dropdown-item">
                                                <i className="fa fa-users text-primary me-2" />
                                                Add to close friends
                                            </Dropdown.Item>
                                            <Dropdown.Item className="dropdown-item">
                                                <i className="fa fa-plus text-primary me-2" />
                                                Add to group
                                            </Dropdown.Item>
                                            <Dropdown.Item className="dropdown-item">
                                                <i className="fa fa-ban text-primary me-2" />
                                                Block
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-8">
                    <div className="card">
                        <div className="card-body">
                            <div className="profile-tab">
                                <div className="custom-tab-1">
                                    <Tab.Container defaultActiveKey='Posts'>
                                        <Nav as='ul' className="nav nav-tabs">
                                            <Nav.Item as='li' className="nav-item">
                                                <Nav.Link to="#my-posts" eventKey='Posts'>Posts</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as='li' className="nav-item">
                                                <Nav.Link to="#about-me" eventKey='About'>About Me</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as='li' className="nav-item">
                                                <Nav.Link to="#profile-settings" eventKey='Setting'>Setting</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                        <Tab.Content>
                                            <Tab.Pane id="profile-settings" eventKey='Setting'>
                                                <div className="pt-3">
                                                    <div className="settings-form">
                                                        <h4 className="text-primary">Account Setting</h4>
                                                        <form onSubmit={handleSubmit}>
                                                            <div className="row">
                                                                <div className="form-group mb-3 col-md-6">
                                                                    <label className="form-label">First Name</label>
                                                                    <input type="text" name="firstName" placeholder="First Name" className="form-control" value={formData.firstName} onChange={handleChange} />
                                                                </div>
                                                                <div className="form-group mb-3 col-md-6">
                                                                    <label className="form-label">Last Name</label>
                                                                    <input type="text" name="lastName" placeholder="Last Name" className="form-control" value={formData.lastName} onChange={handleChange} />
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="form-group mb-3 col-md-6">
                                                                    <label className="form-label">Email</label>
                                                                    <input type="email" name="email" placeholder="Email" className="form-control" value={formData.email} onChange={handleChange} />
                                                                </div>
                                                                <div className="form-group mb-3 col-md-6">
                                                                    <label className="form-label">Password</label>
                                                                    <input type="password" name="password" placeholder="Password" className="form-control" value={formData.password} onChange={handleChange} />
                                                                </div>
                                                            </div>
                                                            <div className="form-group mb-3">
                                                                <label className="form-label">Address</label>
                                                                <input type="text" name="address" placeholder="1234 Main St" className="form-control" value={formData.address} onChange={handleChange} />
                                                            </div>
                                                            <div className="form-group mb-3">
                                                                <label className="form-label">Phone</label>
                                                                <input type="text" name="phone" placeholder="Phone" className="form-control" value={formData.phone} onChange={handleChange} />
                                                            </div>
                                                            <div className="form-group mb-3">
                                                                <label className="form-label">Birthday</label>
                                                                <input type="date" name="birthday" className="form-control" value={formData.birthday} onChange={handleChange} />
                                                            </div>
                                                            <div className="form-group mb-3">
                                                                <label className="form-label">Image</label>
                                                                <input type="file" name="image" className="form-control" onChange={handleImageChange} />
                                                            </div>
                                                            <div className="form-group mb-3">
                                                                <label className="form-label">Role</label>
                                                                <input type="text" name="role" className="form-control" value={formData.role} readOnly />
                                                            </div>
                                                            <div className="form-group mb-3">
                                                                <label className="form-label">Status</label>
                                                                <input type="text" name="status" className="form-control" value={formData.status} readOnly />
                                                            </div>
                                                            <button className="btn btn-primary" type="submit">Update</button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Tab.Container>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Update_Profile;