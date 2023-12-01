import { useState, useEffect, createRef } from "react";
import { io } from "socket.io-client"

import { ToastContainer, toast } from 'react-toastify';

import './App.css';

function App() {
  // const APIurl = "http://localhost:5005"
  const APIurl = "https://node-handson-5-backend-nb8e.onrender.com"
  const roomNameRef = createRef();
  const userNameRef = createRef();
  const userMessageRef = createRef();
  const [userJoind, setuserJoind] = useState([]);
  const [isVisible, setIsvisible] = useState(false);
  let [userCounter, setUserCounter] = useState(0)
  const socketClient = io(APIurl);


  const handleJoinRoom = (e) => {
    e.preventDefault();
    const roomName = roomNameRef.current.value
    const userName = userNameRef.current.value
    socketClient.emit("JOIN__ROOM", { roomName, userName });
    toast.success('Join Room Successfully!', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    setIsvisible(true)
  }

  const handleSendMessageClick = (e) => {
    e.preventDefault();
    socketClient.emit('Msg', "New Message");
    console.log("Perfect okk...");
  }


  useEffect(() => {
    socketClient.on("JOINING__ALERT", (response) => {
      const temp = {resMsg: response}
      userJoind.push(temp)
      setuserJoind(userJoind);
      setUserCounter(++userCounter)
    });
    socketClient.on("receivedMessage", res => {
      console.log(res)
    })

  }, [socketClient, userJoind, userCounter]);
  return (
    <main className="mainContainer">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {
        !isVisible && <div className="roomJoiningContainer">

          <h2 className="roomJoiningContainer__Heading">Join Room</h2>

          <div className="roomJoiningContainer__formBox">

            <input type="text" id="roomID" name="roomName" placeholder="Enter Your Join Room Name" className="roomJoiningContainer_inutField" ref={roomNameRef} />

          </div>

          <div className="roomJoiningContainer__formBox">
            <input type="text" id="userName" name="userName" placeholder="Enter Your Name" className="roomJoiningContainer_inutField" ref={userNameRef} />
          </div>

          <div className="roomJoiningContainer__formBox">
            <button className="joinRoomButton" onClick={handleJoinRoom}>Join Room</button>
          </div>
        </div>
      }

      {
        isVisible && <div className="chatContainer">
          <div className="chatcontainer-ChatBox">
            {userJoind.map((msg, index) => {
              return <p key={index + 2} className="joinMSg">{msg.resMsg}</p>
            })}
          </div>

          <div className="chatContainer_formBox">
            <input type="text" id="Usermessage" ref={userMessageRef} name="Usermessage" className="UsermessageField" placeholder="Type Your Message...." aria-multiline />
            <button className="sendMessageButton" onClick={handleSendMessageClick}>SEND</button>
          </div>
        </div>
      }
    </main>
  );
}

export default App;
