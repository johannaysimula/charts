import { useEffect, useState } from "react";


export default function WebSocketCall({ socket }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleText = (e) => {
    const inputMessage = e.target.value;
    setMessage(inputMessage);
  };

  const handleSubmit = () => {
    if (!message) {
      return;
    }
    
    socket.emit("preparedata", message);
    setMessage("");
  };

  useEffect(() => {
    socket.on("data", (data) => {console.log("socket on data: ", data);
      //setMessages([...messages, data.data]);
    });
    socket.on("status", (data) => {console.log("socket on status: ", data);
      setMessages([...messages, data.data]);
      socket.emit("senddata", message)
    });
  }, [socket]);

  return (
    <div>
      <h2>WebSocket Communication</h2>
      <input type="text" value={message} onChange={handleText} />
      <button onClick={handleSubmit}>submit</button>
      <ul>
        {messages.map((message, ind) => {
          return <li key={ind}>{message}</li>;
        })}
      </ul>
    </div>
  );
}