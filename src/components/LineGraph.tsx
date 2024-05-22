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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineGraphProps {
  data: { year: number; totalJobs: number }[];
}

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.year),
    datasets: [
      {
        label: "Total Jobs",
        data: data.map((d) => d.totalJobs),
        borderColor: "#007acc", 
        backgroundColor: "#e3f2fd",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "#007acc",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: { color: "#333" },
        grid: { color: "#e0e0e0" },
      },
      y: {
        ticks: { color: "#333" },
        grid: { color: "#e0e0e0" },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#333",
        },
      },
    },
  };

  return (
    <div style={{ width: "600px", height: "400px", margin: "0 auto" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineGraph;