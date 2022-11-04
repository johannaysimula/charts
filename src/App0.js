import "./styles.css";

import RealizedChart from "./RealizedChart";
import ScheduleChart from "./ScheduleChart";
import Epics from "./Epics";
import GetResults from "./GetResults";
import { useEffect, useState } from 'react';







export default function App() {
  console.log("App starts");
  const [buttonStatus, setButtonStatus] = useState("None");

  const bctc = () => {
    setButtonStatus("bctc");
  };

  const bp = () => {
    setButtonStatus("bp");
  };

  useEffect(() => {

    console.log("useEffect buttonStatus: ", buttonStatus)
  }, [buttonStatus]);

  return (console.log("buttonStatus: ", buttonStatus),
    <div className="App">

      <main class="main-container">
        <div class="main-title">
          <p class="font-weight-bold">Benefit-Cost-Driven Agile Management Dashboard</p>
        </div>

        <div class="charts">
          <div class="charts-card">
            <p class="chart-title">Epics estimates</p>
            <div id="epics-chart"></div>
            <Epics />
          </div>

          <div class="charts-card">
            <p class="chart-title">Schedule</p>
            <div id="schedule-chart"></div>
            {buttonStatus !== "None" ? (<ScheduleChart optimization_criterion={buttonStatus} />) : ("Waiting for optimization choice")}

            <p class="chart-title">Realized Benefit, Cost and Benefit/Cost</p>
            <div id="realized-chart"></div>
            {buttonStatus === "Ready" ? (<RealizedChart optimization_criterion={buttonStatus} />) : ("Waiting for optimization choice")}
          </div>

          <div class="charts-card">
            <p class="chart-title">WebSocket</p>
            <div id="websocket-chart"></div>
            
          </div>
        </div>
        <button onClick={bctc}>Optimize benefit/cost per time in construction</button>
        <button onClick={bp}>Optimize benefit in production</button>

      </main >
    </div >
    //setButtonStatus("None")
  );
}
