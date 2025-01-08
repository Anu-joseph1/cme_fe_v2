import React, { useEffect, useState, useRef } from "react";
import Plotly from "plotly.js-dist";
import axios from "axios";

const LineChart = ({ fileName }) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);
  const [layout, setLayout] = useState(null);

  const adjustLayoutForView = (baseLayout) => {
    const isMobile = window.innerWidth <= 768;
    return {
      ...baseLayout,
      title: isMobile ? "" : "Sensor Data Over Time",
      yaxis: { ...baseLayout.yaxis, title: isMobile ? "" : "Sensor Values" },
      legend: {
        ...baseLayout.legend,
        orientation: isMobile ? "h" : "v",
        x: isMobile ? 0.5 : 1.05,
        y: isMobile ? -0.3 : 1,
        xanchor: isMobile ? "center" : "left",
      },
      autosize: true,
      width: isMobile ? window.innerWidth * 0.9 : null, // Increased width for mobile
      height: isMobile ? window.innerHeight * 0.6 : 700, // Adjust height for mobile
      // margin: {
      //   l: isMobile ? 10 : 40,
      // },
    };
  };
  

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://v36ua2mw2spxphztmdrwb5tahi0pltwl.lambda-url.ap-south-1.on.aws/data",
        { params: { file_name: fileName } }
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

      const baseLayout = {
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
        margin: {
          l: 40,
          r: 10,
          b: 35,
        },
      };

      const adjustedLayout = adjustLayoutForView(baseLayout);

      setChartData(traces);
      setLayout(adjustedLayout);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const generateColor = (index) => {
    const colors = [
      "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
      "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    ];
    return colors[index % colors.length];
  };

  useEffect(() => {
    fetchData();
  }, [fileName]);

  useEffect(() => {
    if (chartData && layout) {
      Plotly.react(chartRef.current, chartData, layout, {
        responsive: true,
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
      });
    }

    const handleResize = () => {
      if (layout) {
        const updatedLayout = adjustLayoutForView(layout);
        setLayout(updatedLayout);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [chartData, layout]);

  return (
    <div className="linechart-wrapper">
      <div className="linechart-container">
        <div ref={chartRef} />
      </div>
    </div>
  );
};

export default LineChart;
