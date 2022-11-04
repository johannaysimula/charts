
import "./App.css";
import HttpCall from "./components/HttpCall";
import WebSocketCall from "./components/WebSocketCall";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";



function GetResults() {
  const [socketInstance, setSocketInstance] = useState("");
  const [loading, setLoading] = useState(true);
  const [buttonStatus, setButtonStatus] = useState(false);
  console.log("GetResults starts")
  const handleClick = () => {
    if (buttonStatus === false) {
      setButtonStatus(true);
    } else {
      setButtonStatus(false);
    }
  };

  useEffect(() => {
    if (buttonStatus === true) {
      const socket = io("localhost:5001/", {
        transports: ["websocket"],
        cors: {
          origin: "http://localhost:3000/",
        },
      });

      setSocketInstance(socket);

      socket.on("connect", (data) => {
        console.log("connect: ", data);
      });

      setLoading(false);

      socket.on("disconnect", (data) => {
      console.log("disconnect: ", data);
      });

      return function cleanup() {
      socket.disconnect();
      };
    }
  }, [buttonStatus]);

  return (console.log("buttonStatus: ", buttonStatus),
    <div className="websocket-chart">
      <h1>React/Flask App + socket.io</h1>
      <div className="line">
        <HttpCall />
      </div>
      {!buttonStatus ? (
        <button onClick={handleClick}>turn chat on</button>
      ) : (
        <>
          <button onClick={handleClick}>turn chat off</button>
          <div className="line">
            {!loading && <WebSocketCall socket={socketInstance} />}
          </div>
        </>
      )}
    </div>
  );
}

export default GetResults;

