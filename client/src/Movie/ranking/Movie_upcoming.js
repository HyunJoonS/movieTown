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
        const result = await axios.get('/api/upcoming')
        return result.data;
    }
  
    useEffect(() => {
        getAxios().then((a)=>{
            setState(a);    
        })       
    }, [])
    return (
        <div>
            <NavbarSub hover={'movie'} page = {'upcoming'} ></NavbarSub>
            <CardList state={state} title={'개봉 예정'} movieOrTV={'movie'}></CardList>
        </div>
    )
  
  }
  export default Movie_upcoming;