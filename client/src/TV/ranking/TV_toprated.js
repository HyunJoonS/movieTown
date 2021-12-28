import React, { useEffect, useState } from "react"
import { useHistory } from "react-router";
import NavbarSub from "../../component/NavbarSub";
import CardList from "../../component/CardList";
import axios from "axios";

function Movie_toprated() {
    let history = useHistory();
    let [state, setState] = useState(); // 20개 목록 가져오기

    let getAxios = async () => {
        const result = await axios.get('/api/tv/toprated')
        return result.data;
    }
  
    useEffect(() => {
        getAxios().then((a)=>{
            setState(a);    
        })       
    }, [])
    return (
        <div>
            <NavbarSub hover={'tv'} page = {'tvtop-rated'}></NavbarSub>
            <CardList state={state} title={'높은 평점'} movieOrTV={'tv'}></CardList>
        </div>
    )
  
  }
  export default Movie_toprated;