import React, { useState } from 'react';
import { Card, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

// Register Chart.js components
Chart.register(...registerables);

const ComplaintAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [restaurantId, setRestaurantId] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [timePeriod, setTimePeriod] = useState('monthly');

  // Analytics data states
  const [statusData, setStatusData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [timeData, setTimeData] = useState(null);
  const [resolutionTime, setResolutionTime] = useState(null);
  const [satisfactionData, setSatisfactionData] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No authentication token found');

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch restaurants if needed
      if (restaurants.length === 0) {
        try {
          const restaurantsResponse = await axios.get('http://localhost:5000/api/restaurants', {
            headers
          });

          if (Array.isArray(restaurantsResponse.data)) {
            setRestaurants(restaurantsResponse.data);
          } else if (restaurantsResponse.data && Array.isArray(restaurantsResponse.data.data)) {
            setRestaurants(restaurantsResponse.data.data);
          } else {
            setRestaurants([]);
          }
        } catch (err) {
          console.error('Error fetching restaurants:', err);
          // Continue with analytics even if restaurant fetch fails
        }
      }

      const baseUrl = 'http://localhost:5000/api/complaint-analytics';

      // Prepare query parameters
      const params = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      if (restaurantId) {
        params.restaurantId = restaurantId;
      }

      // Fetch complaints by status
      const statusResponse = await axios.get(`${baseUrl}/by-status`, {
        headers,
        params
      });
      setStatusData(statusResponse.data);

      // Fetch complaints by category
      const categoryResponse = await axios.get(`${baseUrl}/by-category`, {
        headers,
        params
      });
      setCategoryData(categoryResponse.data);

      // Fetch complaints by time period
      const timeResponse = await axios.get(`${baseUrl}/by-time`, {
        headers,
        params: { ...params, period: timePeriod }
      });
      setTimeData(timeResponse.data);

      // Fetch average resolution time
      const resolutionResponse = await axios.get(`${baseUrl}/resolution-time`, {
        headers,
        params
      });
      setResolutionTime(resolutionResponse.data);

      // Fetch satisfaction ratings
      const satisfactionResponse = await axios.get(`${baseUrl}/satisfaction`, {
        headers,
        params
      });
      setSatisfactionData(satisfactionResponse.data);

      setDataFetched(true);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAnalyticsData();
  };

  // Prepare chart data
  const prepareStatusChartData = () => {
    if (!statusData || !Array.isArray(statusData)) return null;

    const labels = statusData.map(item => item.status);
    const data = statusData.map(item => item.count);
    const backgroundColors = [
      '#28a745', // Green for Resolved
      '#17a2b8', // Blue for In Progress
      '#ffc107', // Yellow for Pending
      '#6c757d'  // Gray for Closed
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }
      ]
    };
  };

  const prepareCategoryChartData = () => {
    if (!categoryData || !Array.isArray(categoryData)) return null;

    const labels = categoryData.map(item => item.category);
    const data = categoryData.map(item => item.count);
    const backgroundColors = [
      '#fd7e14', // Orange for Food Quality
      '#20c997', // Teal for Service
      '#6610f2', // Purple for Cleanliness
      '#e83e8c', // Pink for Billing
      '#6c757d'  // Gray for Other
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }
      ]
    };
  };

  const prepareTimeChartData = () => {
    if (!timeData || !Array.isArray(timeData)) return null;

    const labels = timeData.map(item => item.period);
    const data = timeData.map(item => item.count);

    return {
      labels,
      datasets: [
        {
          label: 'Complaints Over Time',
          data,
          fill: false,
          borderColor: '#007bff',
          tension: 0.1
        }
      ]
    };
  };

  const prepareSatisfactionChartData = () => {
    if (!satisfactionData || !satisfactionData.distribution || !Array.isArray(satisfactionData.distribution)) return null;

    const labels = satisfactionData.distribution.map(item => `${item.rating} Stars`);
    const data = satisfactionData.distribution.map(item => item.count);
    const backgroundColors = [
      '#dc3545', // Red for 1 star
      '#fd7e14', // Orange for 2 stars
      '#ffc107', // Yellow for 3 stars
      '#20c997', // Teal for 4 stars
      '#28a745'  // Green for 5 stars
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }
      ]
    };
  };

  return (
    <div className="complaint-analytics">
      <Card className="mb-4">
        <Card.Header>
          <h4>Complaint Analytics</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <DatePicker
                    selected={endDate}
                    onChange={date => setEndDate(date)}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    minDate={startDate}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Restaurant</Form.Label>
                  <Form.Select
                    value={restaurantId}
                    onChange={e => setRestaurantId(e.target.value)}
                  >
                    <option value="">All Restaurants</option>
                    {Array.isArray(restaurants) && restaurants.map(restaurant => (
                      <option key={restaurant._id} value={restaurant._id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Time Period</Form.Label>
                  <Form.Select
                    value={timePeriod}
                    onChange={e => setTimePeriod(e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="text-center">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Loading...</span>
                  </>
                ) : (
                  'Generate Analytics'
                )}
              </Button>
            </div>
          </Form>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Card.Body>
      </Card>

      {!loading && !error && !dataFetched && (
        <Card className="mt-4">
          <Card.Body className="text-center py-5">
            <h4>Welcome to Complaint Analytics</h4>
            <p className="text-muted">
              Select your date range and filters above, then click "Generate Analytics" to view complaint statistics.
            </p>
            <div className="mt-4">
              <Button variant="primary" onClick={handleSubmit}>
                Generate Analytics
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {!loading && !error && dataFetched && statusData && (
        <Row>
          <Col lg={6} className="mb-4">
            <Card>
              <Card.Header>
                <h5>Complaints by Status</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px' }}>
                  <Doughnut
                    data={prepareStatusChartData()}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-4">
            <Card>
              <Card.Header>
                <h5>Complaints by Category</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px' }}>
                  <Pie
                    data={prepareCategoryChartData()}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={12} className="mb-4">
            <Card>
              <Card.Header>
                <h5>Complaints Over Time</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px' }}>
                  <Line
                    data={prepareTimeChartData()}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        }
                      }
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-4">
            <Card>
              <Card.Header>
                <h5>Satisfaction Ratings</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px' }}>
                  <Bar
                    data={prepareSatisfactionChartData()}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        }
                      }
                    }}
                  />
                </div>
                {satisfactionData && typeof satisfactionData.averageRating === 'number' && (
                  <div className="text-center mt-3">
                    <h6>Average Rating: {satisfactionData.averageRating.toFixed(1)} / 5</h6>
                    <p>Based on {satisfactionData.totalRatings || 0} ratings</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-4">
            <Card>
              <Card.Header>
                <h5>Resolution Time</h5>
              </Card.Header>
              <Card.Body className="d-flex flex-column justify-content-center align-items-center" style={{ height: '300px' }}>
                {resolutionTime && typeof resolutionTime.averageResolutionTimeHours === 'number' && (
                  <>
                    <h1 className="display-4 text-primary">
                      {resolutionTime.averageResolutionTimeHours.toFixed(1)}
                    </h1>
                    <h5>Average Hours to Resolution</h5>
                    <p className="text-muted">
                      Based on {resolutionTime.complaintCount || 0} resolved complaints
                    </p>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ComplaintAnalytics;
