import React, { useEffect, useState } from "react"
import { useHistory } from "react-router";
import NavbarSub from "../../component/NavbarSub";
import CardList from "../../component/CardList";
import axios from "axios";

function MovieNowPlaying() {
    let history = useHistory();
    let [state, setState] = useState(); // 20개 목록 가져오기

    let getAxios = async () => {
        const result = await axios.get('/api/tv/airing-today')
        return result.data;
    }
  
    useEffect(() => {
        getAxios().then((a)=>{
            setState(a);    
            console.log(a);
        })       
    }, [])
    return (
        <div>
            <NavbarSub hover={'tv'} page = {'airing-today'} ></NavbarSub>
            <CardList state={state} title={'오늘 방영할 TV 프로그램'} movieOrTV={'tv'}></CardList>
        </div>
    )
  
  }
  export default MovieNowPlaying;