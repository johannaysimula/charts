//https://elements.heroku.com/buttons/eecs130/json-server-heroku

import React from "react";
import Chart from "react-apexcharts";

import { useEffect, useState } from 'react';

//const API_HOST = "http://localhost:3000";
const ASP_HOST = "http://localhost:5000/receiver";
//const ASP_HOST = "https://bcdam-python-asp-service.herokuapp.com/receiver";



//const button2 = document.getElementById("recomputeButton")
//const data2 = document.getElementById("info")
// Create an array of cars to send to the server:
const command2 = [
    { "command": 'metrics', "mode": 'work' }
];



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
    //console.log("prepareMetricsData input: ", response)
    for (let i = 0; i < numberofTimesteps; i++) {
        //console.log("i: ", i)
        for (let j = listT[i]; j < listT[i + 1]; j++) {
            paddedlist[j] = list[i];
            //console.log("paddedlist: ", paddedlist)
        }

    }
    paddedlist[listT[numberofTimesteps - 1]] = list[numberofTimesteps - 1];

    //data2.innerHTML += "<p>" + "paddedlist " + paddedlist + " " + listT[listT.length-1];
    //console.log("prepareMetricsData paddedlist: ", paddedlist)
    return (paddedlist);

};
//var responseListBenefitrealized=[];
//var responseListBenefitrealizedT=[];
function RealizedChart() {

    const [jsonResponseBenefit, setjsonResponseBenefit] = useState([]);
    const [jsonResponseBenefitCummulative, setjsonResponseBenefitCummulative] = useState([]);
    const [jsonResponseCost, setjsonResponseCost] = useState([]);
    const [jsonResponseCostCummulative, setjsonResponseCostCummulative] = useState([]);
    const [jsonResponseBenefitCost, setjsonResponseBenefitCost] = useState([]);
    const [jsonResponseBenefitCostCummulative, setjsonResponseBenefitCostCummulative] = useState([]);
    const [jsonResponseBenefitXCostCummulative, setjsonResponseBenefitXCostCummulative] = useState([]);

    const [jsonResponseBenefitConstruction, setjsonResponseBenefitConstruction] = useState([]);
    const [jsonResponseBenefitConstructionCummulative, setjsonResponseBenefitConstructionCummulative] = useState([]);
    const [jsonResponseCostConstruction, setjsonResponseCostConstruction] = useState([]);
    const [jsonResponseCostConstructionCummulative, setjsonResponseCostConstructionCummulative] = useState([]);
    const [jsonResponseBenefitXCostConstructionCummulative, setjsonResponseBenefitXCostConstructionCummulative] = useState([]);


    // Create an event listener on the button element:
    function Metrics() {

        // Get the reciever endpoint from Python using fetch:
        fetch(`${ASP_HOST}`,
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

                // Now for the metrics
                console.log("Now for the metrics", jsonResponse)

                class serieselement {
                    constructor(T, metric) {
                        this.T = T;
                        this.metric = metric;
                    }
                }

                var benefitdata = jsonResponse.find(e => e.theme === 'benefit').data;
                var benefitdatacummulative = benefitdata.map((sum => value => new serieselement(value.T, sum.metric += value.metric))({ metric: 0 }));
                console.log("benefitdata", benefitdata)
                console.log("benefitdatacummulative", benefitdatacummulative)
                setjsonResponseBenefit(prepareMetricsData(benefitdata));
                setjsonResponseBenefitCummulative(prepareMetricsData(benefitdatacummulative));

                //console.log("jsonResponseBenefit: ", jsonResponseBenefit)

                var costdata = jsonResponse.find(e => e.theme === 'cost').data;
                var costdatacummulative = costdata.map((sum => value => new serieselement(value.T, sum.metric += value.metric))({ metric: 0 }));
                setjsonResponseCost(prepareMetricsData(costdata));
                setjsonResponseCostCummulative(prepareMetricsData(costdatacummulative));
                //console.log("jsonResponseCost: ", jsonResponseCost);

                //Prepare benefit and cost data for construction graph:
                var benefitdataconstruction = jsonResponse.find(e => e.theme === 'benefitconstruction').data;
                var benefitdataconstructioncummulative = benefitdataconstruction.map((sum => value => new serieselement(value.T, sum.metric += value.metric))({ metric: 0 }));
                console.log("benefitdataconstruction", benefitdataconstruction)
                console.log("benefitdataconstructioncummulative", benefitdataconstructioncummulative)
                setjsonResponseBenefitConstruction(prepareMetricsData(benefitdataconstruction));
                setjsonResponseBenefitConstructionCummulative(prepareMetricsData(benefitdataconstructioncummulative));

                var costdataconstruction = jsonResponse.find(e => e.theme === 'costconstruction').data;
                var costdataconstructioncummulative = costdataconstruction.map((sum => value => new serieselement(value.T, sum.metric += value.metric))({ metric: 0 }));
                console.log("costdataconstruction", costdataconstruction)
                console.log("costdataconstructioncummulative", costdataconstructioncummulative)
                setjsonResponseCostConstruction(prepareMetricsData(costdataconstruction));
                setjsonResponseCostConstructionCummulative(prepareMetricsData(costdataconstructioncummulative));


                //return(jsonResponseBenefit)
                //data2.innerHTML += "<p> jsonResponseBenefitCost " + jsonResponseBenefitCost

                //for (let item of jsonResponse) data2.innerHTML += "<p> jsonResponse" + item
                //for (let item of jsonResponseBenefit) data2.innerHTML += "<p> jsonResponseBenefit" + item.metric + " " + item.T
                //return ({ benefit: jsonResponseBenefit, cost: jsonResponseCost, benefitcost: jsonResponseBenefitCost });

            }

            ).catch((err) => console.error(err));
        //return({benefit: jsonResponseBenefit, cost: jsonResponseCost, benefitcost: jsonResponseBenefitCost })
        //console.log("jsonResponseBenefit: ", jsonResponseBenefit)
        //return(jsonResponseBenefit)

    }


    useEffect(() => {
        //if (inputFields.length==0) 
        Metrics();
    }, []);

    useEffect(() => {
        //if (inputFields.length==0) 
        var jrbc = [];
        var jrbcCummulative = [];
        var jrbcXCummulative = [];


        for (let i = 0; i < jsonResponseCost.length; i++) {
            jrbc[i] = (jsonResponseCost[i] === 0 ? 0 : jsonResponseBenefit[i] / jsonResponseCost[i])
            jrbcCummulative[i] = (jsonResponseCostCummulative[i] === 0 ? 0 : jsonResponseBenefitCummulative[i] / jsonResponseCostCummulative[i])
            jrbcXCummulative[i] = [jsonResponseCostCummulative[i], jsonResponseBenefitCummulative[i]]

            console.log("jrbc: ", jrbc)
            setjsonResponseBenefitCost(jrbc);
            setjsonResponseBenefitCostCummulative(jrbcCummulative);
            setjsonResponseBenefitXCostCummulative(jrbcXCummulative);
        }
    }, [jsonResponseBenefit]);

    useEffect(() => {
        //if (inputFields.length==0) 
        
        var jrbcConstructionXCummulative = [];

        for (let i = 0; i < jsonResponseCostConstruction.length; i++) {
            jrbcConstructionXCummulative[i] = [jsonResponseCostConstructionCummulative[i], jsonResponseBenefitConstructionCummulative[i]]
        }

        setjsonResponseBenefitXCostConstructionCummulative(jrbcConstructionXCummulative);
    }, [jsonResponseBenefitConstruction]);






    console.log("out jsonResponseBenefit: ", jsonResponseBenefit)

    const options = {
        toolbar: { show: false },
        yaxis: {
            decimalsInFloat: 2,
        },
        noData: {
            text: 'Loading...'
        },
        colors: ["#0aeb0a", "crimson", "blueviolet"],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth'
        },
        //labels: ['Dec 01', 'Dec 02','Dec 03','Dec 04','Dec 05','Dec 06','Dec 07'],
        markers: {
            size: 0
        }
    };

    const xoptions = {
        toolbar: { show: false },
        xaxis: { type: 'numeric' },
        yaxis: {
            decimalsInFloat: 2,
        },
        noData: {
            text: 'Loading...'
        },
        colors: ["#0aeb0a", "crimson", "blueviolet"],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth'
        },
        //labels: ['Dec 01', 'Dec 02','Dec 03','Dec 04','Dec 05','Dec 06','Dec 07'],
        markers: {
            size: 0
        }
    };
    const series = [{
        name: 'Benefit',
        data: jsonResponseBenefit
    }, {
        name: 'Cost',
        data: jsonResponseCost
    }, {
        name: 'Benefit/Cost',
        data: jsonResponseBenefitCost
    }]

    const seriesCummulative = [{
        name: 'Benefit',
        data: jsonResponseBenefitCummulative
    }, {
        name: 'Cost',
        data: jsonResponseCostCummulative
    }, {
        name: 'Benefit/Cost',
        data: jsonResponseBenefitCostCummulative
    }]

    const seriesXCummulative = [{
        name: 'Benefit over Cost',
        data: jsonResponseBenefitXCostCummulative
    }]

    const seriesXConstructionCummulative = [{
        name: 'Benefit over Cost',
        data: jsonResponseBenefitXCostConstructionCummulative
    }]

    return (
        <div className="app">
            <label>Entered into Production</label>
            <div className="row">
                <div className="areaChart">
                    <Chart
                        options={options}
                        series={series}
                        type="area"
                        height="250"
                    />
                </div>
            </div>
            <label>Cummulative</label>
            <div className="row">
                <div className="areaChart">
                    <Chart
                        options={options}
                        series={seriesCummulative}
                        type="area"
                        height="250"
                    />
                </div>
            </div>
            <label>Benefit by Cost in Production</label>
            <div className="row">
                <div className="areaChart">
                    <Chart
                        options={xoptions}
                        series={seriesXCummulative}
                        type="area"
                        height="250"
                    />
                </div>
            </div>
            <label>Benefit by Cost in Construction</label>
            <div className="row">
                <div className="areaChart">
                    <Chart
                        options={xoptions}
                        series={seriesXConstructionCummulative}
                        type="area"
                        height="250"
                    />
                </div>
            </div>
        </div>
    );
}

export default RealizedChart;
