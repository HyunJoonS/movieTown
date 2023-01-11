import { faStar,faThumbsUp,faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mapToStyles } from "@popperjs/core/lib/modifiers/computeStyles";
import axios from "axios";
import React, { useState,useEffect, useRef } from "react";
import './Movie.scss'
function Review_view(props){
    const noimage = '/img/noimage.jpg'
    const starbtn = <FontAwesomeIcon icon={faStar} size='lg'></FontAwesomeIcon>
    let [starpoint,setStarpoint] = useState(null);
    let [감상평,set감상평] = useState('');
    let [spoiler,setSpoiler] = useState(null);
    let [viewSpoiler,setViewSpoiler] = useState('0');
    let [viewReviews,setViewReviews] = useState([]);
    const inputRef = useRef(null);

    const getreview = async()=>{
        const result = await axios.get(props.dburl+'/'+props.id)
        return result.data;
    }
    useEffect(()=>{   
        getreview().then((resolve)=>{
            setViewReviews(resolve);
            console.log('log',resolve);
        })    
    },[])


    

    function 등록(){
        let body = {
            starpoint : starpoint,
            text : 감상평,
            spoiler : spoiler,
            movieID : props.id,
        }
        if(body.starpoint!=null && body.text && body.spoiler != null && body.movieID){        
            axios.post(props.dburl,body).then((response)=>{
                alert(response.data);
                console.log(response);

            getreview().then((resolve)=>{
                setViewReviews(resolve);
                console.log('log',resolve);
            })


            })
        }
        else{
            alert('입력값을 확인해주세요')
        }        
    }

    const 자동높이조절 = ()=>{
        inputRef.current.style.height = inputRef.current.style.height = '30px';
        inputRef.current.style.height = inputRef.current.scrollHeight+'px';
    }
 
    const 감상평Handler = (e)=>{
        set감상평(e.target.value);
    }

    const setpoint = (num)=>{
        if(num*2.0 != starpoint){
            setStarpoint(num*2.0)
        }
        else{
            setStarpoint(num*2.0-1.0)
        }
        
    }
    const star = (num,point)=>{
        if(num*2 <= point){
            return {width:'100%'};
        }
        else if((num*2)-1 <= point){
            return {width:'50%'};
        }
        else{
            return {width:'0%'};
        }
    }

    function RvPoint(params) {
        return(
            <div className='rv-starpoint'>
                <span className='inner-star'>{starbtn}
                    <span className='outer-star'style={star(1,params)}>{starbtn}</span>
                </span>
                <span className='inner-star'>{starbtn}
                    <span className='outer-star' style={star(2,params)}>{starbtn}</span>
                </span>
                <span className='inner-star'>{starbtn}
                    <span className='outer-star' style={star(3,params)}>{starbtn}</span>
                </span>
                <span className='inner-star'>{starbtn}
                    <span className='outer-star' style={star(4,params)}>{starbtn}</span>
                </span>
                <span className='inner-star'>{starbtn}
                    <span className='outer-star' style={star(5,params)}>{starbtn}</span>
                </span>
            </div>  
        )
    }
    
    return(
        <div className='Review'>
            <div className='title'>
                <h5>관람객 평점</h5><h5 className='red'> {viewReviews.length > 0 ? viewReviews[0].avg :'0'}점</h5> 
                <span>({viewReviews != null ? viewReviews.length:'0'}명)</span>
            </div>
            <div className='my_review'>
                              
                <div className='rv-inputbox'>
                    <div className='rv-starpoint'>
                        <span className='inner-star' onClick={()=>{setpoint(1)}}>{starbtn}
                            <span className='outer-star'style={star(1,starpoint)}>{starbtn}</span>
                        </span>
                        <span className='inner-star' onClick={()=>{setpoint(2)}}>{starbtn}
                            <span className='outer-star' style={star(2,starpoint)}>{starbtn}</span>
                        </span>
                        <span className='inner-star' onClick={()=>{setpoint(3)}}>{starbtn}
                            <span className='outer-star' style={star(3,starpoint)}>{starbtn}</span>
                        </span>
                        <span className='inner-star' onClick={()=>{setpoint(4)}}>{starbtn}
                            <span className='outer-star' style={star(4,starpoint)}>{starbtn}</span>
                        </span>
                        <span className='inner-star' onClick={()=>{setpoint(5)}}>{starbtn}
                            <span className='outer-star' style={star(5,starpoint)}>{starbtn}</span>
                        </span>
                    </div>  
                    <textarea onChange={감상평Handler} ref={inputRef} onKeyUp={자동높이조절}></textarea>
                    <p>(0/1000)</p>
                    <div className='rv-question'>
                        <p>감상평에 스포일러가 포함되어있나요?</p>
                        <span className={spoiler === false ? 'active':''} onClick={()=>{setSpoiler(false)}}>없음</span>
                        <span className={spoiler === true ? 'active':''} onClick={()=>{setSpoiler(true)}}>있음</span>
                        <div className='rv-submit' onClick={등록}>등록</div>
                    </div>                                        
                </div>              
                <div className='rv-comment'>
                        <ul>
                            {viewReviews.length>0 ? viewReviews.map((data)=>{
                                return(
                                    <li className='comment-list'>
                                    <div className='comment-profile_img'>
                                        <img src={noimage}></img>
                                    </div>
                                    <div className="comment-box">
                                        <div className="star_point">
                                            {RvPoint(data.point)}
                                        </div>
                                        <div className='names'>
                                            <span className='name'>{data.userID}</span>
                                            <span className='time'>{data.date}</span>
                                        </div>
                                        <div className='text'>
                                            <p>{data.text}</p>
                                        </div>                                
                                        <Like
                                            mylike={0}
                                            like={data.like}
                                            dislike={data.dislike}
                                            id={1}
                                        />
                                    </div>
                                </li>
                                )
                            }):
                            <li className='no_review'>
                                <img src ={'/img/haru.png'}></img>
                                <p>첫번째로 댓글을 달아보세요!</p>
                            </li>
                            }                    
                        </ul>
                    </div>
            </div>
            
        </div>
    )
}
function Like(props){
    let [mylike,setmylike] = useState(props.mylike);
    const thumbsUpbtn= <FontAwesomeIcon icon={faThumbsUp} size='2px'></FontAwesomeIcon>
    const thumbsDownbtn= <FontAwesomeIcon icon={faThumbsDown} size='2px'></FontAwesomeIcon>


    function likeUpdate(params) {
        //db에 정보를 업데이트
    }

    function lickEvent() {
        let copy = mylike;
        if(mylike == 1){
            setmylike(0)
        }
        else{
            setmylike(1)
        }
        likeUpdate();
    }

    function dislickEvent() {
        let copy = mylike;
        if(mylike == -1){            
            setmylike(0)
        }
        else{
            setmylike(-1)
        }
        likeUpdate();
    }
    function likecount(params) {
       if(mylike == 1){
           return params+1;
       }
       else{
           return params;
       }
    }
    function dislikecount(params) {
        if(mylike == -1){
            return params+1;
        }
        else{
           return params;
        }
     }

    return(
        <div className='toolbar'>
            <span className={mylike === 1 ? 'thumbs check' : 'thumbs'}
            onClick={lickEvent}>{thumbsUpbtn}</span>
            <span className='thumbs-count'>{likecount(props.like)}</span>
            <span className={mylike === -1 ? 'thumbs check' : 'thumbs'}
            onClick={dislickEvent}>{thumbsDownbtn}</span>
            <span className='thumbs-count'>{dislikecount(props.dislike)}</span>
        </div>
    )
}

export default Review_view;