import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form, Spinner, Alert, Card, Badge } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useAuth } from '../../../context/authContext';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement);

// Create a separate axios instance with retry logic for analytics
const analyticsAxios = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000
});

// Add request interceptor to add auth token
analyticsAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const AnalyticsModal = ({ show, onHide, restaurantId = null }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [dataFetched, setDataFetched] = useState(false);

  // Analytics data states
  const [statusData, setStatusData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [resolutionTime, setResolutionTime] = useState(null);

  // Initialize data when modal is shown
  useEffect(() => {
    if (show) {
      // Reset states
      setError(null);
      setDataFetched(false);

      // Set restaurant ID based on user role
      if (user?.role?.name === 'Admin' && user?.restaurant?._id) {
        console.log('Admin user with restaurant ID:', user.restaurant._id);
        setSelectedRestaurantId(user.restaurant._id);
        // Fetch data immediately for admin users
        setTimeout(() => {
          fetchAnalyticsData(user.restaurant._id);
        }, 100);
      } else if (restaurantId) {
        console.log('Using provided restaurant ID:', restaurantId);
        setSelectedRestaurantId(restaurantId);
        // Fetch data immediately for provided restaurant ID
        setTimeout(() => {
          fetchAnalyticsData(restaurantId);
        }, 100);
      } else {
        setSelectedRestaurantId('');
        // Only fetch restaurants list for SuperAdmin
        if (user?.role?.name === 'SuperAdmin') {
          fetchRestaurants();
        }
      }
    }
  }, [show, user, restaurantId]);

  const fetchRestaurants = async () => {
    try {
      const response = await analyticsAxios.get('/restaurants');
      if (Array.isArray(response.data)) {
        setRestaurants(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setRestaurants(response.data.data);
      } else {
        setRestaurants([]);
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    }
  };

  const fetchAnalyticsData = async (restaurantIdParam = null) => {
    if (loading) return; // Prevent multiple simultaneous requests

    setLoading(true);
    setError(null);

    try {
      // Prepare query parameters
      const params = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        period: timePeriod
      };

      // Use the restaurant ID from parameter or selected state
      const restId = restaurantIdParam || selectedRestaurantId;

      // Add restaurant ID if valid
      if (restId && /^[0-9a-fA-F]{24}$/.test(restId)) {
        params.restaurantId = restId;
        console.log('Using restaurant ID for analytics:', restId);
      }

      // Use a single endpoint to get all analytics data
      // This endpoint should be implemented on the server to avoid rate limiting
      try {
        const response = await analyticsAxios.get('/complaint-analytics/all', { params });

        if (response.data) {
          setStatusData(response.data.statusData || []);
          setCategoryData(response.data.categoryData || []);
          setTimeData(response.data.timeData || []);
          setResolutionTime(response.data.resolutionTime || null);
          setDataFetched(true);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);

        // Fallback to individual requests if the combined endpoint fails
        try {
          // Make individual requests with a delay between them
          const statusResponse = await analyticsAxios.get('/complaint-analytics/by-status', { params });
          setStatusData(statusResponse.data || []);

          await new Promise(resolve => setTimeout(resolve, 1000));

          const categoryResponse = await analyticsAxios.get('/complaint-analytics/by-category', { params });
          setCategoryData(categoryResponse.data || []);

          await new Promise(resolve => setTimeout(resolve, 1000));

          const timeParams = { ...params };
          const timeResponse = await analyticsAxios.get('/complaint-analytics/by-time', { params: timeParams });
          setTimeData(timeResponse.data || []);

          await new Promise(resolve => setTimeout(resolve, 1000));

          const resolutionResponse = await analyticsAxios.get('/complaint-analytics/resolution-time', { params });
          setResolutionTime(resolutionResponse.data || null);

          setDataFetched(true);
        } catch (fallbackError) {
          console.error('Fallback requests failed:', fallbackError);
          throw fallbackError;
        }
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again later.');

      // Set empty data to prevent UI errors
      setStatusData([]);
      setCategoryData([]);
      setTimeData([]);
      setResolutionTime(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAnalyticsData();
  };

  // Chart options and data preparation
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 10
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: {
          size: 12
        },
        bodyFont: {
          size: 11
        },
        padding: 10
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  const prepareStatusChartData = () => {
    if (!statusData || !Array.isArray(statusData) || statusData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{ data: [1], backgroundColor: ['#cccccc'], borderWidth: 0 }]
      };
    }

    const statusColors = {
      'Resolved': '#28a745',
      'In Progress': '#17a2b8',
      'Pending': '#ffc107',
      'Closed': '#6c757d',
      'default': '#cccccc'
    };

    const labels = statusData.map(item => item.status || 'Unknown');
    const data = statusData.map(item => item.count || 0);
    const backgroundColors = statusData.map(item =>
      statusColors[item.status] || statusColors.default
    );

    return {
      labels,
      datasets: [{ data, backgroundColor: backgroundColors, borderWidth: 0 }]
    };
  };

  const prepareCategoryChartData = () => {
    if (!categoryData || !Array.isArray(categoryData) || categoryData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{ data: [1], backgroundColor: ['#cccccc'], borderWidth: 0 }]
      };
    }

    const categoryColors = {
      'Food Quality': '#fd7e14',
      'Service': '#20c997',
      'Cleanliness': '#6610f2',
      'Billing': '#e83e8c',
      'Other': '#6c757d',
      'default': '#cccccc'
    };

    const labels = categoryData.map(item => item.category || 'Unknown');
    const data = categoryData.map(item => item.count || 0);
    const backgroundColors = categoryData.map(item =>
      categoryColors[item.category] || categoryColors.default
    );

    return {
      labels,
      datasets: [{ data, backgroundColor: backgroundColors, borderWidth: 0 }]
    };
  };

  const prepareTimeChartData = () => {
    if (!timeData || !Array.isArray(timeData) || timeData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{ data: [0], backgroundColor: '#007bff', borderRadius: 4 }]
      };
    }

    let labels = timeData.map(item => item.period || 'Unknown');
    let data = timeData.map(item => item.count || 0);

    // Add a dummy point for better visualization if only one data point
    if (labels.length === 1) {
      labels = [...labels, 'Next Period'];
      data = [...data, 0];
    }

    return {
      labels,
      datasets: [{ data, backgroundColor: '#007bff', borderRadius: 4 }]
    };
  };

  // Check if we have any data to display
  const hasData = dataFetched && (
    statusData?.length > 0 ||
    categoryData?.length > 0 ||
    timeData?.length > 0 ||
    resolutionTime?.averageResolutionTimeHours
  );

  return (
    <Modal show={show} onHide={onHide} size="lg" centered dialogClassName="analytics-modal">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fs-5">
          <i className="fas fa-chart-bar me-2"></i>
          Complaint Analytics
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-3">
        <Form onSubmit={handleSubmit} className="bg-light p-3 rounded mb-3">
          <Row className="g-2">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small">Start Date</Form.Label>
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  className="form-control form-control-sm"
                  dateFormat="yyyy-MM-dd"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small">End Date</Form.Label>
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  className="form-control form-control-sm"
                  dateFormat="yyyy-MM-dd"
                  minDate={startDate}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small">Restaurant</Form.Label>
                {user?.role?.name === 'Admin' ? (
                  <Form.Control
                    size="sm"
                    type="text"
                    value={user?.restaurant?.name || 'Your Restaurant'}
                    disabled
                    className="bg-light"
                  />
                ) : (
                  <Form.Select
                    size="sm"
                    value={selectedRestaurantId}
                    onChange={e => setSelectedRestaurantId(e.target.value)}
                    disabled={!!restaurantId}
                  >
                    {user?.role?.name === 'SuperAdmin' && !restaurantId && (
                      <option value="">All Restaurants</option>
                    )}
                    {Array.isArray(restaurants) && restaurants.map(restaurant => (
                      <option key={restaurant._id} value={restaurant._id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button type="submit" variant="primary" size="sm" className="w-100" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-1">Loading...</span>
                  </>
                ) : (
                  'Generate Analytics'
                )}
              </Button>
            </Col>
          </Row>
        </Form>

        {error && (
          <Alert variant="danger" className="py-2 small">
            {error}
          </Alert>
        )}

        {loading && (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" size="sm" />
            <p className="mt-2 small">Loading analytics data...</p>
          </div>
        )}

        {!loading && !error && !dataFetched && (
          <div className="text-center py-4">
            <p className="text-muted small">
              Select your date range and filters above, then click "Generate Analytics" to view complaint statistics.
            </p>
          </div>
        )}

        {!loading && !error && dataFetched && !hasData && (
          <Alert variant="info" className="text-center">
            <i className="fas fa-info-circle me-2"></i>
            No complaint data found for the selected filters. Try adjusting your date range or filters.
          </Alert>
        )}

        {!loading && !error && hasData && (
          <Row className="g-3">
            <Col md={6}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="py-2 bg-white">
                  <h6 className="mb-0">Status Distribution</h6>
                </Card.Header>
                <Card.Body className="p-2">
                  <div style={{ height: '180px' }}>
                    <Doughnut data={prepareStatusChartData()} options={chartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="py-2 bg-white">
                  <h6 className="mb-0">Category Distribution</h6>
                </Card.Header>
                <Card.Body className="p-2">
                  <div style={{ height: '180px' }}>
                    <Doughnut data={prepareCategoryChartData()} options={chartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={8}>
              <Card className="shadow-sm">
                <Card.Header className="py-2 bg-white">
                  <h6 className="mb-0">Complaints Over Time</h6>
                </Card.Header>
                <Card.Body className="p-2">
                  <div style={{ height: '180px' }}>
                    <Bar data={prepareTimeChartData()} options={barChartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="shadow-sm h-100">
                <Card.Header className="py-2 bg-white">
                  <h6 className="mb-0">Resolution Time</h6>
                </Card.Header>
                <Card.Body className="p-3 text-center d-flex flex-column justify-content-center">
                  {resolutionTime?.averageResolutionTimeHours ? (
                    <>
                      <h2 className="text-primary mb-0">{resolutionTime.averageResolutionTimeHours.toFixed(1)}</h2>
                      <p className="mb-1">Average Hours</p>
                      <Badge bg="light" text="dark" className="small">
                        Based on {resolutionTime.complaintCount || 0} resolved complaints
                      </Badge>
                    </>
                  ) : (
                    <p className="text-muted small">No resolution data available</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AnalyticsModal;
