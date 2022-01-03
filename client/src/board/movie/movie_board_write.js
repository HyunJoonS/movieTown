import NavbarSub from "../../component/NavbarSub";
import { useHistory } from "react-router";
import Board_Write from '../Board_Write'
import { useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { useSelector } from "react-redux";

function Movie_board_write(params) {
    let path = useParams();
    let history = useHistory();
    let loginState  = useSelector(a => a.reducer_user);
    useEffect(()=>{
        axios.get('/api/login').then((res)=>{

        }).catch((err)=>{
            alert('로그인을 해주세요');
            history.goBack();
        })        
    },[])
    useEffect(()=>{
        if(loginState.length>0){
            if(path.type == 'notice'){ //공지사항
                if(loginState[0].class != 'admin'){
                    history.goBack();
                    return alert('관리자가 아닙니다.');
                }
            } 
        }
    },[loginState])
    return(
        <div className="movie_board_write">
            <div className="wrap">
                <NavbarSub hover={'community'} page={`${path.type}-board`} ></NavbarSub>
                <Board_Write type={path.type}></Board_Write>
            </div>
        </div>
    )
}
export default Movie_board_write;