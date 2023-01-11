import './Board_View.scss'
import { useHistory, useLocation } from 'react-router';
import { propTypes } from 'react-bootstrap/esm/Image';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { findAllInRenderedTree } from 'react-dom/test-utils';
import { useSelector } from 'react-redux';
function BoardView(params) {    
    let history = useHistory();
    //datetime format "YYYY-MM-DD HH:mm:ss"
    const offset = new Date().getTimezoneOffset() * 60000;
    const st_date = new Date(Date.now() - offset).toISOString().substr(0, 10).replace(/-/gi, '.');
    const location = useLocation();
    let [답글state,set답글State]=useState(null);
    let loginState  = useSelector(a => a.reducer_user);

    useEffect(() => {
        console.log('params.comment : ',params.comment);
        console.log('params.state : ',params.state);
        // console.log(location.state);
    }, [params])

    function 게시물수정하기({userID}){
        return (
            <>{
                userID == params.state[params.index].writerID?
                <span className='skyblue_btn' onClick={() => { history.push('/board/modify/'+params.state[params.index].boardID)}}>수정하기</span>
                :null
            }
            </>
        )           
    }

    function 게시물삭제하기({userID}){
        const delete_board = ()=>{
            let YESorNO = window.confirm('정말로 게시물을 삭제 하시겠습니까?');
            if(YESorNO){
                axios.delete('/api/board/delete/'+params.state[params.index].boardID).then((res)=>{
                    alert('게시물이 삭제 되었습니다.');
                    pageEvent('목록');
                })
            }
        }
        return (
            <>{
                userID == params.state[params.index].writerID?
                <span className='skyblue_btn' onClick={delete_board}>삭제하기</span>
                :null
            }
            </>
        )           
    }
    function pageEvent(page) {
        if (page == '이전') {
            console.log(params.index)
            if (params.state.length - params.index -1 > 0) {
                let id = params.state[params.index + 1].boardID;
                history.push('./' + id); window.scrollTo(0, 0);
            }
            else {
                alert('이전 게시글이 없습니다.');
            }
        }
        else if (page == '다음') {
            if (params.index > 0) {
                let id = params.state[params.index - 1].boardID;
                history.push('./' + id); window.scrollTo(0, 0);
            }
            else {
                alert('다음 게시글이 없습니다.');
            }
        }
        else if (page == '목록'){
            history.push({
                pathname: '../' + params.type,
                state: location.state
            })
        }
    }


    const 글쓰기buttonEvent = ()=>{
        if(loginState.length >0){
            console.log('글쓰기',loginState);
            history.push(`./${params.type}/write`)
        }
        else{
            alert('로그인을 해주세요.')
        }
    }
    return (
        <div>
            <div className='Board_View'>
                <div className="button">
                    <div className='btn_right'>
                        {loginState.length>0?
                        <>
                            <게시물수정하기 userID={loginState[0].userID}></게시물수정하기>
                            <게시물삭제하기 userID={loginState[0].userID}></게시물삭제하기>
                        </>
                        :null
                        }
                        <span onClick={() => { pageEvent('이전') }}>이전글</span>
                        <span onClick={() => { pageEvent('다음') }}>다음글</span>
                        <span onClick={() => { pageEvent('목록') }}>목록</span>
                    </div>
                </div>
                <div className="post_wrap">
                    <p className='tit'>{params.title}{'>'}</p>
                    <h4>{params.state[params.index].boardTitle}</h4>
                    <div className='writer'>
                        <div className='profileImg'>
                             <img src={params.state[params.index].ProfileImage ? params.state[params.index].ProfileImage : null}></img>
                        </div>
                        <div className="userinfo">
                            <div className="userNames">
                                {params.state[params.index].NickName}
                            </div>
                            <div className="date_times">
                                <span>{params.state[params.index].createDate.substring(0, 10)}</span>
                                <span>조회{params.state[params.index].read_Count + 1}</span>
                            </div>
                        </div>
                    </div>
                    <div className='text'>
                        {/* 리액트는 <p></p>같은태그를 변수를통해 넣을수없음 때문에 아래와같은 코드로 삽입해야함*/}
                        <div dangerouslySetInnerHTML={{ __html: params.state[params.index].boardText }}>
                        </div>
                    </div>
                    <div className='user_post_more'>
                        <div className='profileImg'>
                            <img src="11" alt="" />
                        </div>
                        <div className="userNames" onClick={() => {
                            alert('기능 미구현');
                        }}>
                            <b>{params.state[params.index].NickName}</b>님의 게시글 더보기{' >'}
                        </div>
                    </div>
                    <div className='like'>
                        <span>좋아요</span>
                        <span><b>0</b></span>
                        <span>댓글</span>
                        <span><b>{params.comment.length}</b></span>
                        <div className="report">
                            <span>공유</span>
                            <span>신고</span>
                        </div>
                    </div>
                    <div className='comment_Box'>
                        <div className='comment_tit'>
                            <h4>댓글</h4>
                            <span className={params.댓글순서=='등록순'?'on':''} onClick={()=>{params.set댓글순서('등록순')}}>등록순</span>
                            <span className={params.댓글순서=='최신순'?'on':''} onClick={()=>{params.set댓글순서('최신순')}}>최신순</span>
                        </div>
                        <div className='user_comment_list'>
                            <ul>
                                {params.comment.map((data,i) => {
                                    return (   
                                        <>                                     
                                        <li style={data.depth>0?{paddingLeft:`50px`}:{}} >                                            
                                            <div className='profileImg'>
                                                <img src="11" alt="" />
                                            </div>
                                            <div className='textbox'>
                                                <div className="userNames">
                                                    <b>{data.NickName}</b>
                                                    {data.userID==params.state[params.index].writerID?<span className='Reple-writer'>작성자</span>:null}                                                  
                                                </div>
                                                <div className="userText">
                                                    {data.depth>1?<b>{params.comment[params.comment.findIndex((e)=>e.id==data.parent)].NickName} </b>:null}
                                                    {data.commentText}
                                                </div>
                                                <div className="userdatetime">
                                                    <span>{data.createDate}</span> <span className='reple_btn' onClick={()=>{set답글State(i)}}>답글쓰기</span>
                                                </div>
                                            </div>                                            
                                        </li>
                                        <답글 comment={data} visible={답글state} index={i} setVisible={set답글State}/>
                                        </>
                                    )
                                })
                                }                            
                            </ul>
                        </div>
                        <댓글 boardID={params.state[params.index].boardID}/>
                    </div>
                </div>
                <div className='ArticleBottomBtns'>
                    <div className="left_area">
                        <span className="skyblue_btn"
                            onClick={글쓰기buttonEvent}>
                            글쓰기
                        </span>
                    </div>
                    <div className="right_area">
                        <span onClick={() => { history.push('../' + params.type) }}>목록</span>
                        <span onClick={() => { window.scrollTo(0, 0) }}>
                            Top
                        </span>
                    </div>
                </div>
            </div>
            <div className="bbs_list ListStyle">
                <h4>{`'${params.title}'의 목록`}</h4>
                <table>
                    <tbody>
                        {params.state.map((data, i) => {
                            return (
                                <tr onClick={() => { history.push('./' + data.boardID); window.scrollTo(0, 0); }} className={params.index === i ? 'selected' : ''}>
                                    <td style={{ width: '70%' }}>{data.boardTitle}</td>
                                    <td style={{ width: '15%' }}>{data.NickName}</td>
                                    <td style={{ width: '15%' }}>{st_date === data.createDate.substring(0, 10) ? data.createDate.substring(12, 17) : data.createDate}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function 댓글({boardID}){    
    let loginState = useSelector(state => state.reducer_user);
    let history = useHistory();
    const inputRef=useRef();
   
    const submitEvent=()=>{
        if(loginState.length>0){
            let body={
                boardID : boardID,
                text : inputRef.current.value,
                parent : 0,
                action : '댓글'                          
            } 
            axios.post('/api/board/comments',body).then((res)=>{
                alert(res.data);
                window.location.reload();
            })
        }
        else{
            alert('로그인을 해주세요');
        }
    }

    return (
        <div className='comment_writer' >
            <div className="comment_inbox_name">
                {loginState.length>0?loginState[0].NickName:null}
            </div>
            <div className="comment_inbox_text">
                <textarea type="text" placeholder="댓글을 남겨보세요"  ref={inputRef}/>
            </div>
            <div className="submit">
                <button type="button" className='skyblue_btn' onClick={submitEvent}>등록</button>
            </div>
        </div>
    )
}
function 답글(props){
    let loginState = useSelector(state => state.reducer_user);
    let history = useHistory();
    const inputRef=useRef();
   
    const submitEvent=()=>{
        if(loginState.length>0){
            let body={
                boardID : props.comment.boardID,
                text : inputRef.current.value,  
                parent : props.comment.id,
                action : '대댓글'                          
            } 
            axios.post('/api/board/comments',body).then((res)=>{
                alert(res.data);
                window.location.reload();
            })
        }
        else{
            alert('로그인을 해주세요');
        }
    }

    const 취소=(e)=>{
        let result=window.confirm('이미 입력된 답글 내용을 취소 하겠습니까?')
        if(result){
            props.setVisible(null)
            inputRef.current.value='';
        }        
    }
    return (
        <div className='comment_writer ml50' style={(props.visible==props.index?{display:'block'}:{display:'none'})}>
            <div className="comment_inbox_name">
                {loginState.length>0?loginState[0].NickName:null}
            </div>
            <div className="comment_inbox_text">
                <textarea type="text" placeholder="댓글을 남겨보세요" ref={inputRef}/>
            </div>
            <div className="submit">
                 <button type="button" className='skyblue_btn' onClick={취소}>취소</button>
                <button type="button" className='skyblue_btn' onClick={submitEvent}>등록</button>
            </div>
        </div>
    )
}
export default BoardView;