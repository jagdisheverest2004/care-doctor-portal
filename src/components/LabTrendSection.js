import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LabTrendSection = ({ patient }) => {
  if (!patient.labTrends || patient.labTrends.length === 0) {
    return (
      <div className="section-card">
        <h3>Lab Trends</h3>
        <p style={{ color: "#888" }}>No lab trend data available</p>
      </div>
    );
  }

  // Determine which metric to show based on patient condition
  const determinePrimaryMetric = () => {
    const chronic = patient.chronicDiseases || [];
    if (chronic.includes("Type 2 Diabetes") || chronic.some(c => c.includes("Diabetes"))) {
      return "sugar";
    }
    if (
      chronic.includes("Cardiac disease") ||
      chronic.some(c => c.includes("Heart") || c.includes("Cardiac"))
    ) {
      return "troponin";
    }
    if (
      chronic.includes("Chronic kidney disease") ||
      chronic.some(c => c.includes("Kidney"))
    ) {
      return "creatinine";
    }
    return "sugar";
  };

  const primaryMetric = determinePrimaryMetric();
  const years = patient.labTrends.map((t) => t.year.toString());
  const values = patient.labTrends.map((t) => {
    switch (primaryMetric) {
      case "sugar":
        return t.sugar || 0;
      case "troponin":
        return t.troponin || 0;
      case "creatinine":
        return t.creatinine || 0;
      case "bp":
        return t.bp || 0;
      default:
        return t.sugar || 0;
    }
  });

  const getMetricLabel = () => {
    switch (primaryMetric) {
      case "sugar":
        return "Blood Sugar (mg/dL)";
      case "troponin":
        return "Troponin (ng/mL)";
      case "creatinine":
        return "Serum Creatinine (mg/dL)";
      case "bp":
        return "Blood Pressure (mmHg)";
      default:
        return "Value";
    }
  };

  const chartData = {
    labels: years,
    datasets: [
      {
        label: getMetricLabel(),
        data: values,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: { size: 13 },
          color: "#333",
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        borderColor: "#2563eb",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { color: "#666", font: { size: 12 } },
        grid: { color: "#e5e7eb" },
      },
      x: {
        ticks: { color: "#666", font: { size: 12 } },
        grid: { color: "#e5e7eb" },
      },
    },
  };

  return (
    <div className="section-card">
      <h3>15-Year Lab Trends</h3>
      <div style={{ padding: "20px 0" }}>
        <Line data={chartData} options={chartOptions} height={300} />
      </div>
      <div
        style={{
          marginTop: "20px",
          padding: "10px 15px",
          backgroundColor: "#f0f9ff",
          borderRadius: "6px",
          fontSize: "13px",
          color: "#0369a1",
        }}
      >
        <strong>Metric:</strong> {getMetricLabel()} • <strong>Period:</strong> {years[0]} - {years[years.length - 1]}
      </div>
    </div>
  );
};

export default LabTrendSection;
