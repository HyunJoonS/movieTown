import React, { useEffect, useState } from "react";
import './movie_board_list.scss'
import NavbarSub from "../../component/NavbarSub";
import BoardView from "../Board_View";
import { useHistory, useLocation, useParams } from "react-router";
import axios from "axios";


function Movie_board_view(params) {
    let [state,setState]=useState([]); //게시글목록
    let [comment,setComment]=useState([]); //댓글들
    let [댓글순서,set댓글순서]=useState('등록순');
    let [index,setIndex]=useState(0); //현재게시글은 몇번째인가?
    let path = useParams();
    let history = useHistory();
    useEffect(()=>{
        axios.get('/api/board/limit/'+path.id).then((res)=>{
            if(res.data.length===0){
                alert('삭제되었거나 존재하지 않는 게시물입니다.');
                history.goBack();
            }        
            else{
                let index = res.data.findIndex(v => v.boardID === parseInt(path.id));
                setIndex(index);
                setState(res.data);
                console.log('게시판목록 :',res.data);
                console.log('index :',index);
                axios.post('/api/board/readcount',{boardID:path.id});
            }
        })
    },[useLocation()])
    

    useEffect(()=>{
        if(댓글순서!=null){
            let body={
                order:댓글순서
            }
            console.log('코멘트 겟 요청을 보냄')
            axios.get('/api/board/comments/'+path.id,{params:body}).then((res)=>{
                if(res.data.length>0){
                    setComment(res.data);
                }
            })
        }       
    },[댓글순서])
    return (
        <div className='movie_board_view'>
            <div className="wrap">
                <NavbarSub/>
                {state.length>0 ?                
                <BoardView title={'영화 게시판'} type={path.type} 
                state={state}
                index={index}
                comment={comment}
                댓글순서={댓글순서}
                set댓글순서={set댓글순서}
                />          
                :null
                }                
            </div>
        </div>
    )
}
export default Movie_board_view;