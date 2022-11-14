import React from "react";
import Chart from "react-apexcharts";
import { useEffect, useState } from 'react';
import { io, Manager } from "socket.io-client";

//const API_HOST = "http://localhost:3000";
const API_HOST = "https://bcdam-json-server.herokuapp.com";
//const API_HOST = "http://bcdam.ddns.net:3000";
const BACKLOG_API_URL = `${API_HOST}/backlog`;
//const ASP_HOST = "http://localhost:5000/receiver";
const ASP_HOST = "https://bcdam-python-asp-service-extra.herokuapp.com/socket.io";
const ASP_HOST_GETPORT = "https://bcdam-python-asp-service-extra.herokuapp.com/getport"; //localhost: no 0.0.0.0., then initial connect and discob\nnecy with emptying quueue s not there.
//const ASP_HOST = "http://localhost:5001/"
const POSE_PROBLEM_URL = `${ASP_HOST}/problem`;
const GET_ANSWER_URL = `${ASP_HOST}/answer`;

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


export default function ScheduleChart({ optimization_criterion }) {
    console.log("ScheduleChart: optimization_criterion: ", optimization_criterion)



    const [socketInstance, setSocketInstance] = useState("");
    const [loading, setLoading] = useState(false);
    const [backlog, setbacklog] = useState([
        { epic: '', benefit: '', cost: '' }
    ])

    const [seriesh, setseriesh] = useState([]);

    const [problemPosed, setproblemPosed] = useState(0);

    const [numCalls, setnumCalls] = useState(0);

    const [ASPHostPort, setASPHostPort] = useState(0);



    const fetchBacklog = () => {
        console.log("fecthBacklog starts", numCalls)
        setnumCalls(numCalls + 1)
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
                    alert("ScheduleChart: something in fetchBacklog is wrong")
                }
            }
            )
            .then(json => setbacklog(json))
    }


    var seriesx = []
    var jsonResponseListBacklog = {};
    var jsonResponseListConstruction = {};
    var jsonResponseListProduction = {};



    function makeSeries(jsonResponse) {
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

        seriesx = backlog.map(b => (new serieselement('epic ' + b.epic, [{ x: 'Production', y: jsonResponseListProduction[b.epic] },
        { x: 'Construction', y: jsonResponseListConstruction[b.epic] },
        { x: 'Backlog', y: jsonResponseListBacklog[b.epic] }])))

        setseriesh(seriesx);

        console.log("seriesh: ", seriesh)
        console.log("seriesx: ", seriesx)

    }

    //useEffect(() => {
    //   socket.on("data", (data) => {console.log("socket on", data);
    //      setMessages([...messages, data.data]);
    //     });
    //  }, [socket]);

    const fetchPort = () => {
        console.log("fecthPort starts")
        fetch(`${ASP_HOST_GETPORT}`, {
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
                    alert("ScheduleChart: something in fetchPort is wrong")
                }
            }
            )
            .then(json => setASPHostPort(json))
    }




    useEffect(() => {

        fetchBacklog();

    }, [optimization_criterion]);

    useEffect(() => {

        fetchPort();


    }, [backlog]);

    useEffect(() => {
        console.log("useffect on backlog open socket")
        console.log("env: ", process.env);
        console.log("ASPHostPort: ", ASPHostPort);
        //nowport = process.env.PORT || process.env.REACT_APP_PORT || 1260, userSession


        const manager = new Manager(`${ASP_HOST}`);
        //manager.opts.path='/0.0.0.0';
        manager.engine.port = ASPHostPort;
        manager.opts.port = ASPHostPort;

        console.log("window.location", window.location)
        console.log("window.location.port", window.location.port)


        //console.log("manager: ", manager);
        // check manager.nsps
        console.log(`${ASP_HOST}:` + ASPHostPort)

        const socket = manager.socket('/', {
            transports: ["websocket"],
            cors: {
                origin: ["wss://bcdam.herokuapp.com/42292/ws"],
            },

        });
        console.log("socket1: ", socket);
        console.log("socket.io.engine.port:", socket.io.engine.port);
        //socket.io.engine.port = 17181;
        console.log("socket.io.engine.port:", socket.io.engine.port);

        console.log("socket: ", socket);

        setSocketInstance(socket);


        socket.on('connect', (msg) => {
            console.log("client: useffect on backlog connect: ", msg);
        });


        //console.log("origin: ", "wss://bcdam.herokuapp.com:" + process.env.REACT_APP_PORT + "/ws");

        socket.emit('preparedata', optimization_criterion);

        //setLoading(false)

        socket.on('status', (msg) => {
            console.log("client got status: ", msg);
            socket.emit('senddata', "I'd lke the next answer, please")
        });

        socket.on('data', (msg) => {
            console.log("client got data: ", msg.data);
            const [car, ...cdr] = msg.data;
            console.log("cdr: ", cdr);
            makeSeries(cdr)
            //socket.emit('senddata', "I'd lke the next answer, please")
        });

        socket.on('end', (msg) => {
            console.log("client got end: ", msg);

        });

        //setLoading(false);

        socket.on("disconnect", (msg) => {
            console.log("client: disconnect: ", msg);
        });

        socket.on("hat", (msg) => {
            console.log("client: got this: ", msg);
            //socket.emit('chat', "plong")
        });

        return function cleanup() {
            socket.disconnect();
        };

    }, [backlog, ASPHostPort !== "0"]);

    //useEffect(() => {
    //   if (loading === true){
    //  console.log("useffect on socketinstance get data")
    //poseProblem();
    //setproblemPosed(1)

    //socket.on("data", (data) => { console.log("socket on", data) });
    //}
    // }, [loading]);

    //useEffect(() => {
    //  Schedule();
    //   setproblemPosed(0)

    //}, [problemPosed]);



    const options = {
        toolbar: { show: false },
        noData: {
            text: 'Loading...'
        },
        colors: ["#cc3c43",
            "#f5b74f",
            "#ccec43",
            "#367852",
            "#246dec",


            "#4f35a1",
            "#4f35ff",
        ],
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
            type: 'number'
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
                        height="270"
                    />
                </div>
            </div>
        </div>
    );


}
