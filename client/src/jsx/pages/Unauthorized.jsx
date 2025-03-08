// src/jsx/pages/Unauthorized.jsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-5">
      <h1>Unauthorized Access</h1>
      <p>You must be a SuperAdmin to view this page.</p>
      <Button variant="primary" onClick={() => navigate('/dashboard')}>
        Back to dashboard
      </Button>
    </div>
  );
};

export default Unauthorized;