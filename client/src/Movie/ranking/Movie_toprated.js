import React, { useEffect, useState } from "react"
import { useHistory } from "react-router";
import NavbarSub from "../../component/NavbarSub";
import CardList from "../../component/CardList";
import axios from "axios";

function Movie_toprated() {
    let history = useHistory();
    let [state, setState] = useState(); // 20개 목록 가져오기

    let getAxios = async () => {
        const result = await axios.get('/api/toprated')
        return result.data;
    }
  
    useEffect(() => {
        getAxios().then((a)=>{
            setState(a);    
        })       
    }, [])
    return (
        <div>
            <NavbarSub hover={'movie'} page = {'top-rated'}></NavbarSub>
            <CardList state={state} title={'높은 평점'} movieOrTV={'movie'}></CardList>
        </div>
    )
  
  }
  export default Movie_toprated;