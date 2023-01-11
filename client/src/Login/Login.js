import { useState } from 'react';
import { useHistory } from "react-router";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from 'react-redux';
import './Login.scss'
import axios from 'axios';
function Login() {
    let [focus, setFocus] = useState(['login','login','login','login']);
    let [page,setPage] = useState('loginPage')
    let [userID,setUserID] = useState('')
    let [userPW,setUserPW] = useState('')
    let [userPWok,setUserPWok] = useState('')
    let dispatch = useDispatch();

    const Submit_Login = ()=>{
        let body = {
            userID : userID,
            userPW : userPW,
        }
        axios.post('/api/login',body).then((response)=>{
            if(userID == response.data){
                // window.sessionStorage.setItem('loginID',userID);
                history.push('/');
            }
            else{
                console.log(response);
                alert(response.data);
            }
        })
    }


    const Submit_Register = ()=>{
        let body = {
            userID : userID,
            userPW : userPW,
        }
        if(!!userID && !!userPW && !!userPWok && userPW == userPWok){            
            axios.post('/api/register',body).then((response)=>{
                console.log(response.data);
                alert(response.data);
                if(response.data == '가입 성공'){
                    history.push('/');
                }
            });
        }
        else if( !!userPW && !!userPWok && userPW != userPWok){
            alert('패스워드 불일치');
        }
        else{
            alert('입력값을 확인해주세요');
        }
    }

    const history = useHistory();
    const exitbtn = <FontAwesomeIcon icon={faTimes} size='2x'></FontAwesomeIcon>
    const facebook = {
        text:'Facebook 로그인',
        bgcolor: '#3b5998',
        imgsrc:'https://static.parastorage.com/services/login-statics/1.1831.0/images/facebook-logo.svg',
        URL : '/api/auth/facebook'
    }
    const google = {
        text:'Google 로그인',        
        bgcolor: '#4285f4',
        imgsrc:'https://static.parastorage.com/services/login-statics/1.1831.0/images/google-logo.svg',
        URL : '/api/auth/google'
    }
   
    return (
        <div className='Login'>
            <div className="Login-box">
                {page == 'loginPage' ?
                    <div>
                        <h2>로그인</h2>
                        <p>계정이 없으신가요?</p>
                        <p className='go_register' onClick={()=>{
                            setPage('registerPage')
                        }}>새 계정 만들기 {'>'}</p>
                        <div className='sosialbox'>
                            <Socialbtn data={facebook} />
                            <Socialbtn data={google} />
                        </div>
                        <LoginInput value={userID} setValue={setUserID} name={'아이디'} focus={focus} setFocus={setFocus} id={0} type='text'/>
                        <LoginInput value={userPW} setValue={setUserPW} name={'패스워드'} focus={focus} setFocus={setFocus} id={1} type='password' />
                            
                        <div className="bottom">
                            <a>비밀번호 또는 아이디 찾기</a>    
                            <div className="loginbtn" onClick={Submit_Login}>로그인</div>   
                        </div>  
                    </div>
                    : <div>
                        <h2>가입하기</h2>
                        <p>이미 사용 중인 계정이 있습니까?</p>
                        <p className='go_register' onClick={()=>{
                            setPage('loginPage')
                        }}>계정으로 로그인하기 {'>'}</p>      
                        <LoginInput name={'아이디'} value={userID} setValue={setUserID} focus={focus} setFocus={setFocus} id={0} type='text'/>
                        <LoginInput name={'패스워드'} value={userPW} setValue={setUserPW} focus={focus} setFocus={setFocus} id={1} type='password'/>          
                        <LoginInput name={'패스워드 확인'} value={userPWok} setValue={setUserPWok} focus={focus} setFocus={setFocus} id={2} type='password'/>                            
                        <div className="bottom">
                            {/* <a>비밀번호 또는 아이디 찾기</a>     */}
                            <div className="loginbtn" onClick={Submit_Register}>가입하기</div>   
                        </div>  
                    </div>
                }                    
                            <div className='exit' onClick={()=>{
                                history.push('/');
                            }}>
                                {exitbtn}
                            </div>
     
            </div>
        </div>
    )
}

function LoginInput(props){    
    function setFocus(text){        
        let array = [ ...props.focus];
        array[props.id] = text;
        props.setFocus(array);
    }
    const inputHandler = (e)=>{
        props.setValue(e.target.value);
    }
    return (
        <div>
            <div className={props.focus[props.id]}>
                <input value={props.value} onChange={inputHandler} id={props.id} type={props.type} onFocus={() => { setFocus('login focus') }} onBlur={(e) => {
                    if (e.target.value == '') {
                        setFocus('login')
                    }
                    else {
                        setFocus('login focus2')
                    }
                }}>
                </input>
                <label for={props.id}>{props.name}</label>
            </div>
        </div>
    )
}



function Socialbtn(props){
    let history = useHistory();
    return(
    <div className='socialLoginButton' style={{backgroundColor:props.data.bgcolor, borderColor:props.data.bgcolor }}
        onClick={()=>{window.location.replace(props.data.URL); }}>
        <div className='buttonIcon'>
            <img className='buttonImage2' src={props.data.imgsrc}></img>
        </div>
        <div className='sosialLogin'>{props.data.text}</div>
    </div>
    )    
}
export default Login;
