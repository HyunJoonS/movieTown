import { useEffect, useState } from 'react';

import socketio from 'socket.io-client'
import Chat from './Chat';


const Chatting = ()=>{
    const [currentSocket,setCurrentSocket] = useState();
    useEffect(()=>{
        setCurrentSocket(socketio('http://localhost:5000',{transports:["websocket"]}));
    },[])
  return(
      <>
      {currentSocket!=null?
        <Chat socket={currentSocket}></Chat>
        :null
      }
      </>
  )
};
export default Chatting;