//https://www.freecodecamp.org/news/build-dynamic-forms-in-react/

import { useEffect, useState } from 'react';
//import React, { Component } from "react";
import './App.css';

//const API_HOST = "http://localhost:3000";
const CALC_HOST = "http://localhost:5000";
//const API_HOST = "http://bcdam.ddns.net:3000";
const API_HOST = "https://bcdam-json-server.herokuapp.com:3000";
//const CALC_HOST = "http://bcdam.ddns.net:5000";
const BACKLOG_API_URL = `${API_HOST}/backlog`;
const PARAMETERS_API_URL = `${API_HOST}/parameters`;
const CALCULATION_API_URL = `${CALC_HOST}/inventory`;

function Epics() {

    const [backlog, setbacklog] = useState([
        { epic: '', benefit: '', cost: '', time: '', id: 0}
    ])

    const [parameters, setparameters] = useState(
        { capacity: '', horizon: '' }
    )

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

    const removeFields = (index) => {
        var id = backlog[index].id;
        console.log("removefields index: ", index)
        let data = [...backlog];
        data.splice(index, 1);
        setbacklog(data);
        deletefromBacklog(id);

    }

    const handleParametersChange = (event) => {
        let data = { capacity: parameters.capacity, horizon: parameters.horizon };
        console.log("handleParametersChange data: ", data)
        console.log("event.target.value: ", event.target.value)
        data[event.target.name] = event.target.value;
        setparameters(data);
    }

    const addFields = () => {
        let newfield = { epic: '', benefit: '', cost: '', time: '', id: backlog.length+1 }
        console.log("addFieklds backlog[backlog.length] : ",backlog.length+1 )

        setbacklog([...backlog, newfield])
        //alert("addfields ", backlog[0])
    }

    const submit = (e) => {
        e.preventDefault();

        console.log("submit", backlog);

        //alert("submit ", backlog)
        updateBacklog()
        updateParameters()
        //fetchBacklog()
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

    const fetchParameters = () => {
        fetch(`${PARAMETERS_API_URL}`, {
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
                    alert("something in fetchParameters is wrong")
                }
            }
            )
            .then(json => setparameters(json))

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


    const deletefromBacklog = (id) => {

        console.log("deletefromBacklog", backlog, "id", id);

        fetch(`${BACKLOG_API_URL}/${id}`, {
            method: 'DELETE'
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
                    alert("something is wrong")
                }
            })
    }




    const updateBacklog = () => {

        var i;
        backlog.map((input, index) => {
            console.log("updateBacklog", backlog, "index", index, "item", backlog[index], "id: ", backlog[index].id);
            i = backlog[index].id;
            fetch(`${BACKLOG_API_URL}/${i}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ epic: backlog[index].epic, benefit: backlog[index].benefit, cost: backlog[index].cost, time: backlog[index].time, id: backlog[index].id })
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
                            body: JSON.stringify({ epic: backlog[index].epic, benefit: backlog[index].benefit, cost: backlog[index].cost, time: backlog[index].time, id: backlog[index].id })
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


    const updateParameters = () => {


        fetch(`${PARAMETERS_API_URL}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ capacity: parameters.capacity, horizon: parameters.horizon })
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
                    fetch(`${PARAMETERS_API_URL}`, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({ capacity: parameters.capacity, horizon: parameters.horizon })
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
    }



    const setInitial = () => {
        console.log("setInitial");
        fetchBacklog();
        fetchCalculation();
        fetchParameters();
        console.log("effect parameters: ", parameters)
        //setInputFields(epics);
    }

    //const forceUpdate = useReducer(bool => !bool)[1];


    useEffect(() => {
        //if (inputFields.length==0) 
        setInitial();
    }, []);



    return (
        <div class="epics-container">
            <form >
                <label> &nbsp; &nbsp;  Epic         &nbsp; &nbsp;    Benefit  &nbsp; &nbsp;  Cost &nbsp;&nbsp; Time &nbsp;&nbsp; Benefit/Cost</label>
                {backlog.map((input, index) => {
                    return (
                        <div key={index}>
                            <input
                                name='epic'
                                placeholder='epic name'
                                value={input.epic}
                                size="2"
                                text-align='right'
                                onChange={event => handleFormChange(index, event)}
                            />
                            <input
                                name='benefit'
                                placeholder='benefit points'
                                value={input.benefit}
                                size="2"
                                onChange={event => handleFormChange(index, event)}
                            />
                            <input
                                name='cost'
                                placeholder='size points'
                                value={input.cost}
                                size="2"
                                onChange={event => handleFormChange(index, event)}
                            />
                            <input
                                name='time'
                                placeholder='time'
                                value={input.time}
                                size="2"
                                onChange={event => handleFormChange(index, event)}
                            />
                            <input
                                name='benefit/cost'
                                placeholder='benefit/cost  index'
                                value={calculation.find(e => e.id === input.id)?.benefit_cost}
                                size="2"
                            />
                            <button onClick={() => removeFields(index)}>Remove</button>
                        </div>

                    )
                })}

                <div class="parameters-container">
                    <label>Cost Capacity:</label>
                    <input
                        name='capacity'
                        placeholder='capacity'
                        value={parameters.capacity}
                        size="2"
                        onChange={event => handleParametersChange(event)}
                    />
                </div>
                <div class="parameters-container">
                    <label>Time Horizon:
                        <input
                            name='horizon'
                            placeholder='timesteps'

                            Value={parameters.horizon}
                            size="2"
                            onChange={event => handleParametersChange(event)}
                        />
                    </label>
                </div>

            </form>


            <button onClick={addFields}>Add More..</button>
            <button onClick={submit}>Submit</button>
        </div>
    );
}

export default Epics;