import NavbarSub from "../../component/NavbarSub";
import { useHistory,useParams } from "react-router";
import Board_Modify from '../Board_Modify'
import { useEffect, useState } from "react";
import axios from "axios";
import {useSelector} from 'react-redux'
function Movie_Board_Modify(params) {
    let history = useHistory();
    let loginState = useSelector(a => a.reducer_user)
    let path = useParams();
    let [bbsState,setBbsState] = useState([]);
    useEffect(()=>{        
        axios.get('/api/board/'+ path.id).then((res)=>{   
            console.log(res.data[0])                      
            setBbsState(res.data);
        }).catch((err)=>{
            alert('로그인을 해주세요');
            history.goBack();
        })        
    },[])
    return(
        <div className="movie_board_write">
            <div className="wrap">
                <NavbarSub hover={'community'} page={'movie-board'} ></NavbarSub>
                {bbsState.length>0 && loginState.length>0?
                    bbsState[0].writerID == loginState[0].userID?
                    <Board_Modify state={bbsState[0]}></Board_Modify>
                    :<span>잘못된 접근입니다.</span>
                :null}                
            </div>
        </div>
    )
}
export default Movie_Board_Modify;