import React from "react";
import Chart from "react-apexcharts";
import { useEffect, useState } from 'react';

const API_HOST = "http://localhost:3000";
const BACKLOG_API_URL = `${API_HOST}/backlog`;

const command2 = [
    { "command": 'metrics', "mode": 'work' }
];




function preparePredicatesData(response) {
    //data2.innerHTML += "<p>" + "response in " + response;
    var len = response.length;
    var last = response.at(len - 1);
    response.splice(1, len - 1);
    response.push(last + 1);
    //data2.innerHTML += "<p>" + "response " + response;
    return (response);
}



function ScheduleChart() {

    const [backlog, setbacklog] = useState([
        { epic: '', benefit: '', cost: '' }
    ])

    const [seriesh, setseriesh] = useState([]);
    
    const fetchBacklog = () => {
        fetch(`${BACKLOG_API_URL}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        }
        )
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    alert("something in fetchBacklog is wrong")
                }
            }
            )
            .then(json => setbacklog(json))

    }

    var seriesx = []
    var jsonResponseListBacklog = {};
    var jsonResponseListConstruction = {};
    var jsonResponseListProduction = {};


    // Create an event listener on the button element:
    function Schedule() {
        // Get the reciever endpoint from Python using fetch:
        fetch("http://127.0.0.1:5001/receiver",
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                // Strigify the payload into JSON:
                body: JSON.stringify(command2)
            }).then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    alert("something is wrong")
                }
            }).then(jsonResponse => {

                console.log("jsonResponse: ", jsonResponse)




                function generateResponseList(backlogitem, keyword, list) {
                    var l = [];
                    console.log("generateResponseList backlogitem: ", backlogitem.epic)
                    jsonResponse.find(e => e.theme === 'predicates').data.filter(e => e.holds === keyword + '(' + backlogitem.epic + ')').map(e => l.push(e.T));
                    list[backlogitem.epic] = preparePredicatesData(l);
                    console.log("generateResponseList: ", list[backlogitem.epic])


                }


                backlog.map(b => generateResponseList(b, 'inbacklog', jsonResponseListBacklog));
                console.log("jsonResponseListBacklog: ", jsonResponseListBacklog);

                backlog.map(b => generateResponseList(b, 'inconstruction', jsonResponseListConstruction));
                console.log("jsonResponseListConstruction: ", jsonResponseListConstruction);

                backlog.map(b => generateResponseList(b, 'inproduction', jsonResponseListProduction));
                console.log("jsonResponseListProduction: ", jsonResponseListProduction);



                class serieselement {
                    constructor(name, data) {
                        this.name = name;
                        this.data = data;
                    }
                }

                seriesx = backlog.map(b => (new serieselement('epic ' + b.epic,  [{ x: 'Production', y: jsonResponseListProduction[b.epic]},
                { x: 'Construction', y: jsonResponseListConstruction[b.epic] },
                { x: 'Backlog', y: jsonResponseListBacklog[b.epic] }])))
                
                setseriesh(seriesx);

                console.log("seriesh: ", seriesh)
                console.log("seriesx: ", seriesx)
                
            }

            ).catch((err) => console.error(err));
        

    }
    


    useEffect(() => {
        fetchBacklog();
    }, []);

    useEffect(() => {
        Schedule();

    }, [backlog]);


    const options = {
        toolbar: { show: false },
        noData: {
            text: 'Loading...'
        },
        colors: ["#246dec",
            "#cc3c43",
            "#367852",
            "#f5b74f",
            "#4f35a1"],
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
        yaxis: {
            title: {
               
            }
        },
        dataLabels: {
            enabled: false,

        },
        fill: {
            type: 'solid',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.25,
                gradientToColors: undefined,
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [50, 0, 100, 100]
            }
        },
        xaxis: {
            type: 'datetime'
        },
        legend: {
            position: 'top'
        }
    };



    return (
        <div className="app">
            <div className="row">
                <div className="schedule-chart">
                    <Chart
                        options={options}
                        series={seriesh}
                        type="rangeBar"
                        height="370"
                    />
                </div>
            </div>
        </div>
    );
}

export default ScheduleChart;
