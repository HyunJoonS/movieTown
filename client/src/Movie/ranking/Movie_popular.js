import React, { useEffect, useState } from "react"
import { useHistory } from "react-router";
import NavbarSub from "../../component/NavbarSub";
import CardList from "../../component/CardList";
import { useSelector } from "react-redux";
import axios from "axios";

function MoviePopular() {
    let history = useHistory();
    let [popular, setPopular] = useState(); // 20개 목록 가져오기

    let getAxios = async () => {
        const result = await axios.get('/api/popular')
        return result.data;
    }

    useEffect(() => {
        getAxios().then((a)=>{
            setPopular(a);    
        })       
    }, [])

    return (
        <div>
            <NavbarSub hover={'movie'} page = {'movie'}></NavbarSub>
            <CardList state={popular} title={'인기 영화'} movieOrTV={'movie'}></CardList>
        </div>
    )
  
  }
  export default MoviePopular;