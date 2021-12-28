import React from "react"
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import './Navbar.scss';
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
function Navbar() {
    //let state = useSelector(state => state.reducer_user);
    let [state,setState] = useState([]);
    let dispatch = useDispatch();
    let loginState  = useSelector(a => a.reducer_user);
    let location = useLocation();
    useEffect(()=>{
        console.log('네브바')
        axios.get('/api/login').then((res)=>{
            console.log('보냄 payload : ', res.data)
             dispatch({type :'login', payload:res.data})
        })        
    },[location])
    useEffect(()=>{
        setState(loginState);
        console.log('loginstate : ',loginState);
    },[loginState])
    return (
        <>
            {state.length>0?
                <로그인 state={state[0]} setState={setState}></로그인>
                :<비로그인></비로그인>
            }
        </>
    )
}


function 비로그인(params) {
    let history = useHistory();
    return (
        <div className='navbar'>
            <div className="wrap">
                <div className="logo">홈</div>
                <div className='loginBox' onClick={() => { history.push('/login') }}>로그인</div>
            </div>
        </div>
    )
}
function 로그인(params) {
    let history = useHistory();
    let dispatch = useDispatch();
    let [openMenu,setOpenMenu] = useState(false);
    let profileImg = params.state.ProfileImage?params.state.ProfileImage:'/img/haru.png';
    let userID = params.state.email? params.state.email:params.state.userID;
    const logout = () => {
        axios.get('/api/logout').then((res) => {
            params.setState([]);
            alert('로그아웃 되었습니다.');

        });
    }
    const MenuOpenEvent = ()=>{
        setOpenMenu(!openMenu);
    }

    return (
        <div className='navbar'>
            <div className="wrap">
                <div className="logo" onClick={()=>{history.push('/')}}>홈</div>
                <div className='profileImage' onClick={MenuOpenEvent}><img src={profileImg}></img></div>
                <div className="menu-bg" onClick={MenuOpenEvent} style={openMenu==true ? {display:'block'}:{display:'none'}}>
                </div>
                <div className="menuWrap"  style={openMenu==true ? {display:'block'}:{display:'none'}}>
                    <div className="menu">
                        <div className="menu-profileImage">
                            <img src={profileImg}></img>
                        </div>
                        <div className="names">
                            <p>{params.state.NickName?params.state.NickName:'닉네임을 설정해주세요'}</p>
                            <p className="id">{userID}</p>
                        </div>
                        <span className="circle" onClick={()=>{MenuOpenEvent(); history.push('/mypage')}}>계정관리</span>
                        <hr></hr>
                        <span className='square' onClick={()=>{MenuOpenEvent();logout()}}>로그아웃</span>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Navbar;