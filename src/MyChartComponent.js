import React from "react";
import Chart from "react-apexcharts";

const MyChartComponent = ({ covidData }) => {
  const options = { labels: ["Cases", "Recovered", "Deaths"] };

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={options}
            series={covidData.map((data) => data)}
            type="donut"
            width="300"
          />
        </div>
      </div>
    </div>
  );
};

export default MyChartComponent;
