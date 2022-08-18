//https://www.freecodecamp.org/news/build-dynamic-forms-in-react/

import { useEffect, useState } from 'react';
//import React, { Component } from "react";
import './App.css';

const API_HOST = "http://localhost:3000";
const CALC_HOST = "http://localhost:5000";
const BACKLOG_API_URL = `${API_HOST}/backlog`;
const CALCULATION_API_URL = `${CALC_HOST}/inventory`;

function Epics() {

    const [backlog, setbacklog] = useState([
        { epic: '', benefit: '', cost: '' }
    ])

    const [calculation, setCalculation] = useState([]);




    //useEffect(() => {
    // fetchEpics();
    //  setInputFields(epics);
    //()
    //}, []);

    const handleFormChange = (index, event) => {
        let data = [...backlog];
        //alert(data[index])
        //alert(backlog[index][event.target.name])
        data[index][event.target.name] = event.target.value;
        setbacklog(data);
    }

    const addFields = () => {
        let newfield = { epic: '', benefit: '', cost: '' }

        setbacklog([...backlog, newfield])
        //alert("addfields ", backlog[0])
    }

    const submit = (e) => {
        e.preventDefault();

        console.log("submit", backlog);

        //alert("submit ", backlog)
        updateBacklog()
    }

    //const [epics, setEpics] = useState([]);

    // GET request function to your Mock API or python program
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

    const fetchCalculation = () => {
        //alert("fetch calculation");
        fetch(`${CALCULATION_API_URL}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => {
                if (res.ok) {//alert("something is right")
                    return res.json()
                } else {
                    alert("something is wrong")
                }
            })
            .then(json => setCalculation(json.metric)) // for python on port 5000 include .inventory. For json server on port 3000, the jason received is already stripped of its 'inventory' label. I don't know why this is.
    }




    const updateBacklog = () => {

        var i;
        backlog.map((input, index) => {
            console.log("updateBacklog", backlog, "index", index, "item", backlog[index]);
            i = index + 1;
            fetch(`${BACKLOG_API_URL}/${i}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ epic: backlog[index].epic, benefit: backlog[index].benefit, cost: backlog[index].cost })
            })
                //var id=1
                //fetch(`${BACKLOG_API_URL}/${id}`, {method: 'PUT'})
                //alert("stop")
                //fetch(`${BACKLOG_API_URL}`, {
                //method: 'POST',
                //body: JSON.stringify({epic: backlog[1].epic, cost: backlog[1].cost, benefit: backlog[1].benefit}),
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        console.log("POST instead");
                        fetch(`${BACKLOG_API_URL}`, {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify({ epic: backlog[index].epic, benefit: backlog[index].benefit, cost: backlog[index].cost })
                        })
                    }
                })
                .then(json => {
                    // reset inEditMode and unit price state values
                    //onCancel();

                    // fetch the updated data
                    //fetchBacklog();
                    //fetchCalculation();
                })
        })
    }


    const setInitial = () => {
        console.log("setInitial");
        fetchBacklog();
        fetchCalculation();
        //setInputFields(epics);
    }

    //const forceUpdate = useReducer(bool => !bool)[1];


    useEffect(() => {
        //if (inputFields.length==0) 
        setInitial();
    }, []);



    return (//alert("return"),
        <div className="App">
            <form onSubmit={submit}>
                <label>Epic               Benefit     Cost Benefit/Cost</label>
                {backlog.map((input, index) => {
                    console.log(calculation.find(e => e.id === input.id)?.benefit_cost);  //optiobnal chaining due to async for caluclation
                    return (




                        <div key={index}>

                            <input
                                name='epic'
                                placeholder='epic'
                                value={input.epic}
                                onChange={event => handleFormChange(index, event)}
                            />
                            <input
                                name='benefit'
                                placeholder='benefit'
                                value={input.benefit}
                                onChange={event => handleFormChange(index, event)}
                            />
                            <input
                                name='cost'
                                placeholder='cost'
                                value={input.cost}
                                onChange={event => handleFormChange(index, event)}
                            />
                            <input
                                name='benefit/cost'
                                value={calculation.find(e => e.id === input.id)?.benefit_cost}
                            />
                        </div>
                    )
                })}
            </form>
            
            <button onClick={addFields}>Add More..</button>
            <button onClick={submit}>Submit</button>
        </div>
    );
}

export default Epics;