import React from "react";
import Chart from "react-apexcharts";

import { useEffect,useState } from 'react';


//const button2 = document.getElementById("recomputeButton")
//const data2 = document.getElementById("info")
// Create an array of cars to send to the server:
const command2 = [
    { "command": 'metrics', "mode": 'work' }
];

//const areaChart = document.getElementById("areaChart")
const timelineChart = document.getElementById("mixed-chart")
// Create an array of cars to send to the server:


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
    const [jsonResponseCost, setjsonResponseCost] = useState([]);   
    const [jsonResponseBenefitCost, setjsonResponseBenefitCost] = useState([]);   


    // Create an event listener on the button element:
    function Metrics() {

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

                // Now for the metrics
                console.log("Now for the metrics", jsonResponse)



                setjsonResponseBenefit(prepareMetricsData(jsonResponse.find(e => e.theme === 'benefit').data));
                //console.log("jsonResponseBenefit: ", jsonResponseBenefit)
                setjsonResponseCost(prepareMetricsData(jsonResponse.find(e => e.theme === 'cost').data));
                //console.log("jsonResponseCost: ", jsonResponseCost);

                
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

                for (let i = 0; i < jsonResponseCost.length; i++) {
                    jrbc[i] = (jsonResponseCost[i] === 0 ? 0 : jsonResponseBenefit[i] / jsonResponseCost[i])
                }
                console.log("jrbc: ", jrbc)
                setjsonResponseBenefitCost(jrbc);
       }, [jsonResponseBenefit]);

       



    
    console.log("out jsonResponseBenefit: ", jsonResponseBenefit)
    
    const options = {
        toolbar: { show: false },
        yaxis: {
            decimalsInFloat: 2,
        },
        noData: {
            text: 'Loading...'
        },
        colors: ["#119911", "#990011", "#771177"],
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

    return (
        <div className="app">
            <div className="row">
                <div className="areaChart">
                    <Chart
                        options={options}
                        series={series}
                        type="area"
                        height="350"
                    />
                </div>
            </div>
        </div>
    );
}

export default RealizedChart;
