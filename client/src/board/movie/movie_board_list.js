import React, { useEffect, useState } from "react";
import './movie_board_list.scss'
import NavbarSub from "../../component/NavbarSub";
import Board_List from "board/Board_list";
import axios from "axios";
import { useLocation } from "react-router";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
function Movie_board_list(params) {
    const location = useLocation();
    let [state,setState]=useState();
    let [value,setValue]=useState();
    let path = useParams();

    const boardName = [
        {type : 'movie', title : '영화 게시판'},
        {type : 'tv', title : 'TV 게시판'},
        {type : 'free', title : '자유 게시판'}
    ]
    let board_title =  boardName.find(e => e.type == path.type)
    useEffect(()=>{        
        console.log('type : ', board_title.title);
        console.log('location state:',location.state);
        if(location.state){
            setValue(location.state.params.value);
            console.log('2',location.state.params.value)
        }
        else{
            setValue({
                page : 1,
                limit : 15,
                searchTerm: '전체기간',
                searchRange: '게시글',
                searchText: '',
            })
        }
    },[path])
    useEffect(()=>{  
        if(value!=null){
            let body={
                page: value['page'],
                limit: value['limit'],
                searchTerm : value['searchTerm'],
                searchRange : value['searchRange'],
                searchText : value['searchText'],
            }
            axios.get(`/api/board/list/${path.type}`,{params:body}).then((res)=>{
                setState(res.data);
            })        
            console.log('1',value,state);
        }             
    },[value])
    return (
        <div className='movie_board_list'>
            <div className="wrap">
                <NavbarSub hover={'community'} page={`${path.type}-board`} ></NavbarSub>
                <h4>{board_title.title}</h4>
                {state?
                <Board_List 
                    state={state} 
                    type={path.type}
                    value={value}
                    setValue={setValue}
                />:null}                
            </div>
        </div>
    )
}


export default Movie_board_list;