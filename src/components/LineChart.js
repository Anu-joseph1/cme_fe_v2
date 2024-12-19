import React, { useEffect, useState, useRef } from "react";
import Plotly from "plotly.js-dist"; // Import Plotly
import axios from "axios";

const LineChart = ({ fileName }) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null); // Create a ref for the chart container

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://v36ua2mw2spxphztmdrwb5tahi0pltwl.lambda-url.ap-south-1.on.aws/data", {
          params: { file_name: fileName },
        });
        const rawData = response.data;

        // Extract X-axis (Time)
        const xValues = rawData.map((item) => `${item.TIME}`);

        // Extract keys for dynamic Y datasets (e.g., DO1, DO2, ...)
        const yKeys = Object.keys(rawData[0]).filter((key) =>
          key.startsWith("DO")
        );

        // Create traces for each DO key
        const traces = yKeys.map((key, index) => ({
          x: xValues,
          y: rawData.map((item) => item[key] ?? 0),
          type: "scatter",
          mode: "lines+markers",
          marker: { color: generateColor(index) },
          line: { dash: index % 2 === 0 ? "solid" : "dot" },
          name: key,
        }));

        const layout = {
          title: "Sensor Data Over Time",
          xaxis: {
            title: "Time",
            showgrid: true,
            tickangle: -45,
            tickfont: { size: 14 },
            tickmode: "linear", // Ensure ticks follow a regular interval
            dtick: Math.ceil(xValues.length / 10), // Show every nth label (adjust to avoid congestion)
            automargin: true, // Adjust margin for readability
          },
          yaxis: {
            title: "Sensor Values",
            showgrid: true,
            tickfont: { size: 14 },
          },
          legend: {
            font: { size: 12 },
            x: 1.05,
            y: 1,
            orientation: "v",
          },
          // width: 1000,
          height: 700,
          autosize: true,
        };

        setChartData({ traces, layout });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, [fileName]);

  const generateColor = (index) => {
    const colors = [
      "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
      "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    ];
    return colors[index % colors.length];
  };

  useEffect(() => {
    if (chartData) {
      // Render the chart when chartData is available
      Plotly.newPlot(chartRef.current, chartData.traces, chartData.layout, {
        responsive: true,
        scrollZoom: true, // Enable zooming via mouse scroll
        displayModeBar: true,
      });
    }

    return () => {
      if (chartRef.current) {
        Plotly.purge(chartRef.current); // Clean up the plot when component unmounts or updates
      }
    };
  }, [chartData]);

  if (!chartData) {
    return <div>Loading chart...</div>;
  }

  return (
    <div className="linechart-wrapper">
      <div className="linechart-container">
        <div ref={chartRef} /> {/* Empty div to hold the Plotly chart */}
      </div>
    </div>
  );
};

export default LineChart;
