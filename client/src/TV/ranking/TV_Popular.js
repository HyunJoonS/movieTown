import React, { useEffect, useState } from "react"
import { useHistory } from "react-router";
import NavbarSub from "../../component/NavbarSub";
import CardList from "../../component/CardList";
import axios from "axios";

function MoviePopular() {
    let history = useHistory();
    let [popular, setPopular] = useState(); // 20개 목록 가져오기

    let getAxios = async () => {
        const result = await axios.get('/api/tv/popular')
        return result.data;
    }

    useEffect(() => {
        getAxios().then((a)=>{
            setPopular(a);    
        })      
        console.log(popular) ;
    }, [])

    return (
        <div>
            <NavbarSub hover={'tv'} page = {'tv'}></NavbarSub>
            <CardList state={popular} title={'인기 TV프로그램'} movieOrTV={'tv'}></CardList>
        </div>
    )
  
  }
  export default MoviePopular;