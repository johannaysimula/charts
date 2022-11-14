import "./styles.css";

import RealizedChart from "./RealizedChart";
import ScheduleChart from "./ScheduleChart";
import Epics from "./Epics";
import GetResults from "./GetResults";
import { useEffect, useState } from 'react';







export default function App() {
  console.log("App starts");
  const [buttonStatus, setButtonStatus] = useState("bctc");

  const bctc = () => {
    setButtonStatus("bctc");
  };

  const bp = () => {
    setButtonStatus("bp");
  };

  useEffect(() => {

    console.log("useEffect buttonStatus: ", buttonStatus)
  }, [buttonStatus]);

  return (console.log("in return buttonStatus: ", buttonStatus),
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
            <p >
            <button class="processButton" onClick={bctc}>Optimize benefit/cost per time in construction</button></p>
            <p ><button class="processButton" onClick={bp}>Optimize benefit in production</button></p>
          </div>
          
          
          <div class="charts-card">
            <p class="chart-title">Schedule</p>
            <div id="schedule-chart"></div>
            <ScheduleChart optimization_criterion={buttonStatus} />

            <p class="chart-title">Realized Benefit, Cost and Benefit/Cost</p>
            <div id="realized-chart"></div>
            <RealizedChart optimization_criterion={buttonStatus} />
          </div>

          <div class="charts-card">
            <p class="chart-title">WebSocket</p>
            <div id="websocket-chart"></div>
            
          </div>
        </div>
        
      </main >
    </div >
    //setButtonStatus("None")
  );
}
