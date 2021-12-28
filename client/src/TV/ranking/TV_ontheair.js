import React, { useEffect, useState } from "react"
import { useHistory } from "react-router";
import NavbarSub from "../../component/NavbarSub";
import CardList from "../../component/CardList";
import { useSelector } from "react-redux";
import axios from "axios";

function Movie_upcoming() {
    let history = useHistory();
    let [state, setState] = useState(); // 20개 목록 가져오기

    let getAxios = async () => {
        const result = await axios.get('/api/tv/on-the-air')
        return result.data;
    }
  
    useEffect(() => {
        getAxios().then((a)=>{
            setState(a);    
        })       
    }, [])
    return (
        <div>
            <NavbarSub hover={'tv'} page = {'on-the-air'} ></NavbarSub>
            <CardList state={state} title={'현재 방영 중인 TV 프로그램'} movieOrTV={'tv'}></CardList>
        </div>
    )
  
  }
  export default Movie_upcoming;