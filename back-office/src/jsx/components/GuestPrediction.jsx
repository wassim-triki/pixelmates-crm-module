// src/components/GuestPrediction.jsx
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { Nav } from 'react-bootstrap';
import ActivityLineChart from './Sego/Home/ActivityLineChart';
import axiosInstance from '../../config/axios';
import axios from 'axios';
import { useAuth } from '../../context/authContext';

const GuestPrediction = () => {
  const { user } = useAuth();

  // schedule
  const [workFrom, setWorkFrom] = useState('');
  const [workTo, setWorkTo] = useState('');

  // chart data
  const [labels, setLabels] = useState([]);
  const [predictions, setPredictions] = useState([]);

  // date & event flag
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [specialEvent, setSpecialEvent] = useState(0);

  // fetch schedule once
  useEffect(() => {
    if (!user?.restaurant?._id) return;
    axiosInstance
      .get(`/restaurants/${user.restaurant._id}/schedule`)
      .then((res) => {
        setWorkFrom(res.data.workFrom);
        setWorkTo(res.data.workTo);
      })
      .catch((err) => console.error('Schedule error:', err));
  }, [user]);

  // whenever date or schedule or flag changes → predict
  useEffect(() => {
    if (!workFrom || !workTo) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    const startTime = `${dateStr}T${workFrom}`;
    const endTime = `${dateStr}T${workTo}`;

    axios
      .post('http://192.168.70.126:5001/predict', {
        start_time: startTime,
        end_time: endTime,
        special_event: specialEvent,
      })
      .then((res) => {
        const { hours, predictions } = res.data;
        // build "HH:00" labels
        setLabels(hours.map((h) => h.toString().padStart(2, '0') + ':00'));
        setPredictions(predictions);
      })
      .catch((err) => console.error('Prediction error:', err));
  }, [selectedDate, workFrom, workTo, specialEvent]);

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center pb-0 border-0">
        <div>
          <h4 className="fs-20">Peak Guest Hour Prediction</h4>
          <p className="fs-13 mb-0">
            A prediction of peak guest count vs. hour of day.
          </p>
        </div>

        {/* date picker */}
        <Nav as="ul" className="nav nav-tabs">
          <Nav.Item as="li">
            <div className="input-hasicon">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
              />
              <div className="icon">
                <i className="far fa-calendar" />
              </div>
            </div>
          </Nav.Item>
        </Nav>
      </div>

      <div className="card-body" style={{ height: '350px' }}>
        <ActivityLineChart labels={labels} predictions={predictions} />
      </div>
    </div>
  );
};

export default GuestPrediction;
