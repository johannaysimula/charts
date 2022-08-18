import React from "react";
import Chart from "react-apexcharts";
import { useEffect, useState } from 'react';

const API_HOST = "http://localhost:3000";
const BACKLOG_API_URL = `${API_HOST}/backlog`;



//const button2 = document.getElementById("recomputeButton")
//const data2 = document.getElementById("info")
// Create an array of cars to send to the server:
const command2 = [
    { "command": 'metrics', "mode": 'work' }
];

//const areaChart = document.getElementById("areaChart")
const timelineChart = document.getElementById("mixed-chart")
// Create an array of cars to send to the server:



function preparePredicatesData(response) {
    //data2.innerHTML += "<p>" + "response in " + response;
    var len = response.length;
    var last = response.at(len - 1);
    response.splice(1, len - 1);
    response.push(last + 1);
    //data2.innerHTML += "<p>" + "response " + response;
    return (response);
}


function prepareMetricsData(response) {

    var list = [];
    var listT = [];
    var paddedlist = [];
    var numberofTimesteps = 0;

    //data2.innerHTML += "<p> prepareData"; 
    //data2.innerHTML += "<p> response" + response;
    //response.map(e=>data2.innerHTML += "<p> response e" +  e[0]);

    response.map(e => (listT.push(e.T), list.push(e.metric)));
    //data2.innerHTML += "<p> response" +  response;
    numberofTimesteps = listT.length;
    //data2.innerHTML += "<p> numberofTimesteps" +  numberofTimesteps;
    console.log("prepareMetricsData input: ", response)
    for (let i = 0; i < numberofTimesteps; i++) {
        console.log("i: ", i)
        for (let j = listT[i]; j < listT[i + 1]; j++) {
            paddedlist[j] = list[i];
            console.log("paddedlist: ", paddedlist)
        }

    }
    paddedlist[listT[numberofTimesteps - 1]] = list[numberofTimesteps - 1];

    //data2.innerHTML += "<p>" + "paddedlist " + paddedlist + " " + listT[listT.length-1];
    console.log("prepareMetricsData paddedlist: ", paddedlist)
    return (paddedlist);

};
//var responseListBenefitrealized=[];
//var responseListBenefitrealizedT=[];
function ScheduleChart() {

    const [backlog, setbacklog] = useState([
        { epic: '', benefit: '', cost: '' }
    ])

    const [jsonResponseBenefit, setjsonResponseBenefit] = useState([]);
    const [jsonResponseCost, setjsonResponseCost] = useState([]);
    const [jsonResponseBenefitCost, setjsonResponseBenefitCost] = useState([]);

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
                var jsonResponseListBacklog = {};
                var jsonResponseListConstruction = {};
                var jsonResponseListProduction = {};




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

                series = [{
                    name: 'Epic ' + backlog[0].epic,
                    data: [{ x: 'Production', y: jsonResponseListProduction[backlog[0].epic] },
                    { x: 'Construction', y: jsonResponseListConstruction[backlog[0].epic] },
                    { x: 'Backlog', y: jsonResponseListBacklog[backlog[0].epic] }
                ]
                }
                ]

                console.log("series: ", series)


                //jsonResponse.find(e => e.theme === 'predicates').data.filter(e => e.holds === 'inbacklog(a)').map(e => la.push(e.T));
                //jsonResponseListBacklogA = preparePredicatesData(la);                       

            }

            ).catch((err) => console.error(err));
        //return({benefit: jsonResponseBenefit, cost: jsonResponseCost, benefitcost: jsonResponseBenefitCost })
        console.log("jsonResponseBenefit: ", jsonResponseBenefit)
        //return(jsonResponseBenefit)

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
                text: "Count"
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
    var series = [
        {
            name: 'Epic A',
            data: [
                {
                    x: 'Production',
                    y: [0, 2],
                },
                {
                    x: 'Construction',
                    y: [0, 3],
                },
                {
                    x: 'Backlog',
                    y: [0, 5],
                }
            ]
        },
        {
            name: 'Epic B',
            data: [
                {
                    x: 'Production',
                    y: [0, 2],
                },
                {
                    x: 'Construction',
                    y: [0, 5],
                },
                {
                    x: 'Backlog',
                    y: [2, 3],
                }
            ]
        },
        {
            name: 'Epic C',
            data: [
                {
                    x: 'Production',
                    y: [2, 6],
                },
                {
                    x: 'Construction',
                    y: [3, 4],
                },
                {
                    x: 'Backlog',
                    y: [2, 6],
                }
            ]
        }
    ]
    
    return (
        <div className="app">
            <div className="row">
                <div className="timelineChart">
                    <Chart
                        options={options}
                        series={series}
                        type="rangeBar"
                        height="350"
                    />
                </div>
            </div>
        </div>
    );
}

export default ScheduleChart;
