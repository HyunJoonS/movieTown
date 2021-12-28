import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react"
import { useRef } from "react";
import { useEffect,memo } from "react";
import './Chat.scss'
import axios from 'axios';
import { useSelector } from "react-redux";
const Chat = ({socket}) => {
    let [visible,setVisible] = useState('off-chatting');
    let [message,setMessage] = useState();
    let [chatLog,setChatLog] = useState([]);
    let loginState  = useSelector(a => a.reducer_user);

    const exitbtn = <FontAwesomeIcon icon={faTimes} size='2x'></FontAwesomeIcon>
    const noimage = '/img/noimage.jpg'

    const enterKey = (e)=>{
        if(e.keyCode==13){
            e.preventDefault();
            pushMessage();
        }
    }
    const pushMessage = () => {
        if (loginState.length>0){
            if (message != '') {
                socket.emit('every', message);
                let messageObj = {
                    id: '',
                    nickname: 'ME',
                    profileImage: 'ME',
                    message: message,
                    type : 'ME',
                }
                setChatLog(chatLog => [...chatLog, messageObj]);
                setMessage('');
            }
        }
        else{
            alert('로그인을 해주세요')
        }         
    }
    const socketon = ()=>{
        socket.on('every',(msg)=>{  
            console.log('받은메세지',msg);        ;           
            setChatLog(chatLog=>[...chatLog,msg]);
        })
    }

    useEffect(()=>{
        socketon();
    },[])

    useEffect(()=>{
        console.log('채팅로그',chatLog);
    },[chatLog])

    return (
        <div>
            <section className='talk'>
            <div className={'Chat '+visible}>
                <div className="chat-wrap">
                    <div className="window">자유 채팅방
                        <span className="hidebtn" onClick={()=>{
                            setVisible('off-chatting');
                         }}>{exitbtn}</span>
                    </div>
                        {chatLog.length>0?
                            <Chatbox chatLog={chatLog}></Chatbox>
                        :null
                        }
                        
                    <div className="input-wrap">
                        <textarea type='textarea' value={message} onChange={(e)=>{setMessage(e.target.value)}}
                        onKeyDown={(e)=>{enterKey(e)}}></textarea>
                        <button type='button' onClick={pushMessage}>전송</button>
                    </div>
                </div>
            </div>
            </section>

            <section className='icon'>
                <div className={'Chat-icon '+visible} onClick={()=>{
                        setVisible('on-chatting');
                    }}>
                    <div className='iconwrap' >                    
                        <span>Talk</span>
                    </div>
                </div>
            </section>
        </div>
    )

  }
function Chatbox({chatLog}){
    const mainChatBoxRef =useRef();
    const scrollToBottom = () => {
        if (mainChatBoxRef.current) {
            mainChatBoxRef.current.scrollTop = mainChatBoxRef.current.scrollHeight;
        }
      };
      useEffect(()=>{        
        scrollToBottom();
      },[chatLog])
      return(
        <div className="mainChatBox" ref={mainChatBoxRef}>
            <ul className="ChatBox-ul">
                
                {chatLog!==undefined?chatLog.map((msg) => {               
                    switch(msg.type){
                        case 'ME':
                            return(<My_Message msg={msg}></My_Message>)
                        case 'chat':
                            return(<Your_Message msg={msg}></Your_Message>)
                        case 'system':
                            return(<Sys_Message msg={msg}></Sys_Message>)
                    }
                }):null}
            </ul>
        </div>
    )
      if(chatLog !==undefined){
        
      }
}
let Sys_Message = memo(({msg})=> {
    const noimage = '/img/noimage.jpg'
    return (
        <>
            <li className="sysChat">
                <span className='text'>{'현준님이 입장하셨습니다.'}</span>
            </li>
        </>
    )
})


let Your_Message = memo(({msg})=> {
    const noimage = '/img/noimage.jpg'
    return (
        <>
            <li className="userChat">
                <div className="message">
                    <div className="profile">
                        <img src={msg.profileImage?msg.profileImage:noimage}></img>
                    </div>
                    <span className='name'>{msg.nickname}</span>
                    <span className='text'>{msg.message}</span>
                </div>
            </li>
        </>
    )
})
let My_Message = memo(({msg})=> {
    const noimage = '/img/noimage.jpg'
    return (
        <>
            <li className="myChat">
                <div className="message">
                    <div className="profile">
                        <img src={noimage}></img>
                    </div>
                    <span className='name'>ME</span>
                    <span className='text'>{msg.message}</span>
                </div>
            </li>
        </>
    )
})




  export default Chat;