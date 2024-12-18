import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

const LineChart = ({ fileName }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/data", {
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
          width: 1000,
          height: 620,
          autosize: true,

        };

        setChartData({ traces, layout });
        console.log("Chart data", chartData.traces)
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

  if (!chartData) {
    return <div>Loading chart...</div>;
  }

  return (
    <div className="linechart-wrapper">
      <div className="linechart-container">
        <Plot
          className="plotly-chart"
          data={chartData.traces}
          layout={chartData.layout}
          config={{
            responsive: true,
            scrollZoom: true, // Enable zooming via mouse scroll
            displayModeBar: true,
          }}
        />
      </div>
    </div>
  );
};

export default LineChart;
