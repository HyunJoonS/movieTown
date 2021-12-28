import axios from "axios";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import ProfileImageChange from "component/ProfileImageChangeModal";
import './Mypage.scss'
const Mypage = (props) => {
    const btnCamera = <FontAwesomeIcon icon={faCamera} size="lg"/>    
    let 현재비밀번호ref = useRef();
    let 닉네임ref = useRef();
    let history = useHistory();
    let [state, setState] = useState([]);
    let [닉네임, set닉네임] = useState('현준');
    let [닉네임수정, set닉네임수정] = useState(false);
    let [비밀번호수정, set비밀번호수정] = useState(false);
    let [프로필이미지modal,set프로필이미지modal] = useState(false);
    useEffect(() => {
        axios.get('/api/login').then((res) => {
            setState(res.data);
            set닉네임(res.data[0].NickName)
        }).catch((error) => {
            alert(error.response.data.message); history.goBack()
        });
    }, [])

    useEffect(() => {
        if (닉네임수정) {
            닉네임ref.current.focus();
        }
    }, [닉네임수정])

    const modalClose = ()=>{
        set프로필이미지modal(!프로필이미지modal);
    }
    const 닉네임수정Event = () => {
        set닉네임수정(!닉네임수정);
        let nick = state[0].NickName ? state[0].NickName : '';
        set닉네임(nick);        
    }    
    const 닉네임change = (e) => {
        set닉네임(e.target.value);
    }
    const submitEvent = () => {
        let body = {
            nickName: 닉네임,
            userID: state[0].userID
        }
        axios.post('/api/user/update/nickname', body)
            .then(res => { alert(res.data); window.location.replace("./mypage") })
            .catch(err => console.log(err));
    }
    const 비밀번호수정Event=()=>{
        if(state[0].googleFacebook){
            alert('외부계정은 비밀번호를 수정하실 수 없습니다.\n구글, 페이스북 등 계정이 소속된 사이트에서 수정해주세요')
        }
        else{
            set비밀번호수정(!비밀번호수정)
        }
    }


    if (state.length > 0) {
        return (
            <div className="Mypage">
                <h4>내정보 관리</h4>
                <hr></hr>
                <div className="profileImage-wrap">
                    <div className="profileImage">
                        <img src={state[0].ProfileImage ? state[0].ProfileImage : './img/haru.png'}></img>
                    </div>
                    <div className="btn-ImageChange" onClick={modalClose}>
                        {btnCamera}
                    </div>
                </div>
                {프로필이미지modal?
                <ProfileImageChange modalClose={modalClose} id={state[0].userID} profileImage={state[0].ProfileImage ? state[0].ProfileImage : './img/haru.png'}></ProfileImageChange>
                :null}                
                <div className="mypage-userInfo" style={닉네임수정 ? { borderBottom: '2px solid black' } : null}>
                    <dl>
                        <dt>닉네임</dt>
                        {닉네임수정 ?
                            <dd>
                                <input type='text' value={닉네임} ref={닉네임ref} onChange={닉네임change}></input>
                                <button className="submit" type="button" onClick={submitEvent}>확인</button>
                                <button type="button" onClick={닉네임수정Event}>취소</button>
                            </dd>
                            :
                            <dd>
                                <span>{state[0].NickName ? state[0].NickName : '닉네임을 설정해 주세요'}</span>
                                <button type="button" onClick={닉네임수정Event}>수정</button>
                            </dd>
                        }
                    </dl>
                </div>
                <div className="mypage-userInfo">
                    <dl>
                        <dt>아이디</dt>
                        <dd>
                            <span>{state[0].email ? state[0].email + ` (${state[0].provider} 로그인)`
                                : state[0].userID}</span>
                        </dd>
                    </dl>
                </div>
               
                {비밀번호수정
                    ?
                    <><div className="mypage-userInfo">
                        <dl>
                            <dt>기존 비밀번호</dt>
                            <dd>
                                <input type='text' placeholder="현재 비밀번호를 입력해주세요"></input>
                            </dd>
                        </dl>
                    </div>
                        <div className="mypage-userInfo">
                            <dl>
                                <dt>비밀번호</dt>
                                <dd>
                                    <input type='text' placeholder="변경할 비밀번호를 입력해주세요"></input>
                                </dd>
                            </dl>
                        </div>
                        <div className="mypage-userInfo">
                            <dl>
                                <dt>비밀번호 확인</dt>
                                <dd>
                                    <input type='text' placeholder="변경할 비밀번호를 입력해주세요"></input>
                                    <button className="submit" type="button" onClick={() => {}}>확인</button>
                                    <button type="button" onClick={()=>{set비밀번호수정(!비밀번호수정)}}>취소</button>
                                </dd>
                            </dl>
                        </div></>
                    :
                    <div className="mypage-userInfo">
                        <dl>
                            <dt>비밀번호</dt>
                            <dd>
                                <span>비밀번호 관리</span>
                                <button type="button" onClick={비밀번호수정Event}>수정</button>
                            </dd>
                        </dl>
                    </div>
                }
            </div>
        )
    }
    else {
        return (
            <></>
        )
    }

}
export default Mypage;