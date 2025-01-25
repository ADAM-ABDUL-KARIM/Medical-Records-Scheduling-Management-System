import React, { useState, useEffect } from "react";
import api from "../api";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/AnalyticDashboard.css"; // Import custom styles

function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const res = await api.get("/api/analytics/");
      setAnalyticsData(res.data);
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
    }
  };

  if (!analyticsData) {
    return <div>Loading...</div>;
  }

  const data = {
    labels: ["Total Patients", "Recovered Patients", "Not Recovered Patients"],
    datasets: [
      {
        label: "Number of Patients",
        data: [
          analyticsData.total_patients,
          analyticsData.recovered_patients,
          analyticsData.not_recovered_patients,
        ],
        backgroundColor: ["#36A2EB", "#4BC0C0", "#FF6384"],
      },
    ],
  };

  return (
    <div className="analytics-container">
      <h2>Patient Analytics</h2>
      <div className="chart-container">
        <Bar data={data} width={800} height={400} />
      </div>
    </div>
  );
}

export default AnalyticsDashboard;