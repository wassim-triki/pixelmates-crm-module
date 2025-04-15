import React, { useState, useEffect } from "react"; // Ensure useState and useEffect are imported
import { Tab, Spinner } from "react-bootstrap"; // Import Spinner from react-bootstrap
import { Line } from "react-chartjs-2";
import axios from "axios";

const Statics = () => {
    const [session, setSession] = useState("Monthly");
    const [userStats, setUserStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) throw new Error("No authentication token found");
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const response = await axios.get("http://localhost:5000/api/users/statistics", config);
                if (Array.isArray(response.data)) {
                    setUserStats(response.data);
                } else {
                    console.error("Expected an array, but got:", response.data);
                    setUserStats([]);
                }
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message || "Error fetching statistics";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <p className="text-danger">{error}</p>
            </div>
        );
    }

    if (userStats.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <p className="text-muted">No statistics available.</p>
            </div>
        );
    }

    const chartData = {
        labels: userStats.map((stat) => `${stat.year}-${stat.month}`),
        datasets: [
            {
                label: "User Registrations",
                data: userStats.map((stat) => stat.count),
                fill: false,
                borderColor: "rgba(75,192,192,1)",
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="row">
            <div className="col-xl-9 col-xxl-8">
                <div className="card">
                    <Tab.Container defaultActiveKey="monthly">
                        <div className="card-header d-sm-flex d-block pb-0 border-0">
                            <div className="me-auto pe-3">
                                <h4 className="text-black fs-20">User Statistics</h4>
                                <p className="fs-13 mb-0 text-black">
                                    Overview of user registrations over time
                                </p>
                            </div>
                        </div>
                        <div className="card-body pb-0">
                            <Line data={chartData} />
                        </div>
                    </Tab.Container>
                </div>
            </div>
        </div>
    );
};

export default Statics;