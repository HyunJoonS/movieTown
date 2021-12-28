import { Component, useState } from "react"
import { useHistory } from "react-router";
import './compoments.scss';

function ContentsBox(){
    let history = useHistory();
    const [visible, setVisible] = useState({ hover: '' });
    return (
        <div className="contentsbox">
            <ul onMouseLeave={() => { setVisible({ ...visible, hover: '' }) }}>
                <li onMouseEnter={() => { setVisible({ ...visible, hover: 'home' }) }}
                    className={visible.hover == 'home' ? "nev-home on" : "nev-home"} 
                    onClick={()=>{history.push('/')}}
                    >
                    홈
                </li>
                <li onMouseEnter={() => { setVisible({ ...visible, hover: 'ranking' }) }}
                    className={visible.hover == 'ranking' ? "nev-ranking on" : "nev-ranking"} 
                    onClick={()=>{history.push('/movie/popular')}}>
                    영화
                </li>
                <li onMouseEnter={() => { setVisible({ ...visible, hover: 'premovie' }) }}
                    className={visible.hover == 'premovie' ? "nev-premovie on" : "nev-premovie"} 
                    onClick={()=>{history.push('/tv/popular')}}>
                    TV프로그램
                </li>
                <li onMouseEnter={() => { setVisible({ ...visible, hover: 'contents' }) }}
                    className={visible.hover == 'contents' ? "nev-contents on" : "nev-contents"} 
                    onClick={()=>{history.push('/board/movie')}}>
                    커뮤니티
                </li>
            </ul>
        </div>
    )
}
export default ContentsBox