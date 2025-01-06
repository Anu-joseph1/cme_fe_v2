import React, { useEffect, useState, useRef } from "react";
import Plotly from "plotly.js-dist";
import axios from "axios";

const LineChart = ({ fileName }) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  const adjustLayoutForView = (layout) => {
    if (window.innerWidth <= 768) {
      // Mobile view adjustments
      return {
        ...layout,
        title: "", // Hide chart title
        yaxis: {
          ...layout.yaxis,
          title: "", // Hide Y-axis title
        },
        legend: {
          ...layout.legend,
          orientation: "h", // Horizontal legend
          x: 0.5, // Center the legend horizontally
          y: -0.3, // Position legend below the chart
          xanchor: "center",
        },
      };
    }
    // Desktop view
    return {
      ...layout,
      title: "Sensor Data Over Time", // Show chart title
      yaxis: {
        ...layout.yaxis,
        title: "Sensor Values", // Show Y-axis title
      },
      legend: {
        ...layout.legend,
        orientation: "v", // Vertical legend
        x: 1.05, // Position to the right
        y: 1,
      },
    };
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://v36ua2mw2spxphztmdrwb5tahi0pltwl.lambda-url.ap-south-1.on.aws/data",
        {
          params: { file_name: fileName },
        }
      );
      const rawData = response.data;

      const xValues = rawData.map((item) => item.TIME);

      const yKeys = Object.keys(rawData[0]).filter((key) =>
        key.startsWith("DO")
      );

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
        xaxis: {
          title: "Time",
          showgrid: true,
          tickangle: -45,
          tickfont: { size: 14 },
          tickmode: "linear",
          dtick: Math.ceil(xValues.length / 10),
          automargin: true,
        },
        yaxis: {
          showgrid: true,
          tickfont: { size: 14 },
        },
        legend: {
          font: { size: 12 },
        },
        height: 700,
        autosize: true,
        margin: {
          l: 40, // Left margin
          r: 40, // Right margin
          // t: 60, // Top margin
          b: 35, // Bottom margin
        },
      };

      // Adjust layout for the current view (desktop or mobile)
      const adjustedLayout = adjustLayoutForView(layout);
      setChartData({ traces, layout: adjustedLayout });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const handleResize = () => {
      if (chartData) {
        const updatedLayout = adjustLayoutForView(chartData.layout);
        Plotly.relayout(chartRef.current, updatedLayout); // Update layout dynamically
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fileName, chartData]);

  const generateColor = (index) => {
    const colors = [
      "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
      "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    ];
    return colors[index % colors.length];
  };

  useEffect(() => {
    if (chartData) {
      Plotly.newPlot(chartRef.current, chartData.traces, chartData.layout, {
        responsive: true,
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
      });
    }

    return () => {
      if (chartRef.current) {
        Plotly.purge(chartRef.current);
      }
    };
  }, [chartData]);

  if (!chartData) {
    return <div>Loading chart...</div>;
  }

  return (
    <div className="linechart-wrapper">
      <div className="linechart-container">
        <div ref={chartRef} />
      </div>
    </div>
  );
};

export default LineChart;
