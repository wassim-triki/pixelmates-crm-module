import React, { useEffect, useState } from 'react';
import { Dropdown, Nav, Tab } from 'react-bootstrap';
import ActivityLineChart from './Sego/Home/ActivityLineChart';
import axios from '../../config/axios';
import { useAuth } from '../../context/authContext';
import DatePicker from 'react-datepicker';

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
          <h4 className="text-black fs-20">Peak Guest Hour Prediction</h4>
          <p className="fs-13 mb-0 text-black">
            A prediction of peak guestcount vs hour of day.
          </p>
        </div>
        <Nav as="ul" className="nav nav-tabs">
          <Nav.Item as="li">
            <div className="input-hasicon">
              <DatePicker
                selected={new Date()}
                // onChange={(date) => setStartDate(date)}
                className="form-control "
              />
              <div className="icon">
                <i className="far fa-calendar" />
              </div>
            </div>
          </Nav.Item>
        </Nav>
      </div>

      <div className="card-body" id="user-activity">
        <Tab.Container defaultActiveKey="all-food">
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
