import React, { useEffect, useState } from 'react';
import { Dropdown, Nav, Tab } from 'react-bootstrap';
import ActivityLineChart from './Sego/Home/ActivityLineChart';
import axios from '../../config/axios';
import { useAuth } from '../../context/authContext';

const GuestPrediction = () => {
  const [session, setSession] = useState('Monthly');
  const [hourLabels, setHourLabels] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRestaurantSchedule = async () => {
      try {
        // 1. Fetch the schedule
        const response = await axios.get(
          `/restaurants/${user.restaurant._id}/schedule`
        );
        const { workFrom, workTo } = response.data;

        // 2. Generate hourly labels
        const generateHourlyLabels = (from, to) => {
          const [fH, fM] = from.split(':').map(Number);
          const [tH, tM] = to.split(':').map(Number);
          const startHour = Math.floor(fH + fM / 60);
          const endHour = Math.round(tH + tM / 60);
          const labels = [];
          for (let h = startHour; h <= endHour; h++) {
            labels.push(h.toString().padStart(2, '0') + ':00');
          }
          return labels;
        };

        setHourLabels(generateHourlyLabels(workFrom, workTo));
      } catch (error) {
        console.error('Error fetching restaurant schedule:', error);
      }
    };

    if (user?.restaurant?._id) {
      fetchRestaurantSchedule();
    }
  }, [user]);

  return (
    <div className="card">
      <div className="card-header d-sm-flex d-block pb-0 border-0">
        <div className="me-auto pe-3">
          <h4 className="text-black fs-20">Revenue</h4>
          <p className="fs-13 mb-0 text-black">
            Lorem ipsum dolor sit amet, consectetur
          </p>
        </div>
        <Dropdown className="dropdown mt-sm-0 mt-3">
          <Dropdown.Toggle className="btn btn-primary light dropdown-toggle">
            {session}
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item onClick={() => setSession('Month')}>
              Month
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSession('Day')}>Day</Dropdown.Item>
            <Dropdown.Item onClick={() => setSession('Week')}>
              Week
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSession('Year')}>
              Year
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="card-body" id="user-activity">
        <Tab.Container defaultActiveKey="all-food">
          <div className="d-flex flex-wrap mb-4">
            <div className="me-auto mb-2 pe-3 d-flex align-items-center">
              {/* …SVG icon… */}
              <div className="ms-3">
                <p className="fs-12 mb-1">Income</p>
                <span className="fs-22 text-black font-w600">$126,000</span>
              </div>
            </div>
            <div className="card-action revenue-tabs">
              <Nav as="ul" className="nav nav-tabs">
                <Nav.Item as="li">
                  <Nav.Link eventKey="all-food">All Food</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </div>

          <Tab.Content>
            <Tab.Pane eventKey="all-food">
              <ActivityLineChart dataActive={0} labels={hourLabels} />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

export default GuestPrediction;
