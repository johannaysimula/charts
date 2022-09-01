import "./styles.css";

import RealizedChart from "./RealizedChart";
import ScheduleChart from "./ScheduleChart";
import Epics from "./Epics";


export default function App() {
  return (
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
            <div id="scedule-chart"></div>
            <ScheduleChart />

            <p class="chart-title">Realized Benefit, Cost and Benefit/Cost</p>
            <div id="realized-chart"></div>
            <RealizedChart />


          </div>

          

        </div>

      </main >










    </div >
  );
}
