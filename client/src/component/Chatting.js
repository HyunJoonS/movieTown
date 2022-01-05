import axios from 'axios';
import { useEffect, useState } from 'react';

import socketio from 'socket.io-client'
import Chat from './Chat';


const Chatting = ()=>{
    const [currentSocket,setCurrentSocket] = useState();
    const [chatLog,setChatLog] = useState();
    useEffect(()=>{
        setCurrentSocket(socketio('http://localhost:5000',{transports:["websocket"]}));     
        axios.get('/api/chat').then((res)=>{

          let array = [];
          res.data.map((data)=>{
              let messageObj = {
                id: data.userID,
                nickname: data.NickName,
                profileImage: data.ProfileImage,
                message: data.text,
                type : 'chat',
             }
             array.push(messageObj)
          })

          setChatLog(array);
          console.log(array);
        }).catch()
    },[])
  return(
      <>
      {currentSocket!=null && chatLog != null?
        <Chat socket={currentSocket} log={chatLog}></Chat>
        :null
      }
      </>
  )
};
export default Chatting;