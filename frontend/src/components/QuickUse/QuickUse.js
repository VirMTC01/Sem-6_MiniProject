import "./QuickUse.css";
import { io } from "socket.io-client";

function handleSocketConnection(){
    const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("connect", () => {
      console.log("connected", socket.id);
      setSocketId(socket.id);
    });

     
    return () => {  
      socket.disconnect();
    };
  }, []); 
}



function QuickUse(){
    return(
        <>
        <label htmlFor="username">Name</label>
        <input type="text" id="username"/>
        <label htmlFor="roomid">Room ID</label>
        <input type="text" id="roomid"/>
        <button onClick={handleSocketConnection()}>Join Room</button>
        </>
    );
}

export default QuickUse;