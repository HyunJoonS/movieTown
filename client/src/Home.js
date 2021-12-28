import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import qs from 'qs';
import './Home.scss';
import Searchbar from './component/searchbar';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircularProgress from '@material-ui/core/CircularProgress';
import { faAngleLeft, faAngleRight, faTimes, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import { useSelector,useDispatch } from "react-redux";
import CardListSlide from "component/CardListSlide";
import Chat from "component/Chat";
function Home() {
    const axios = require('axios');
    const btnSlideLeft = <FontAwesomeIcon icon={faAngleLeft} size="lg" />
    const btnSlideRight = <FontAwesomeIcon icon={faAngleRight} size="lg" />
    const btnVolumeOn = <FontAwesomeIcon icon={faVolumeUp} size="lg" />
    const btnVolumeMute = <FontAwesomeIcon icon={faVolumeMute} size="lg" />
    const history = useHistory();
    let state = useSelector((state) => state)
  
    let dispatch = useDispatch();
    let poster_url = 'https://image.tmdb.org/t/p/w500'
    let [popular, setPopular] = useState(); //인기 20위 가져오기
    let [popular2,setPopular2] = useState();
    let [popular3,setPopular3] = useState();
    let [playerState, setPlayerState] = useState({ muted: true });
    let [active, setActive] = useState(); //선택된 영화
    let [activeVideo, setActiveVideo] = useState(); //선택영화의 비디오정보
    const [visible, setVisible] = useState({ hover: 'home' });



    useEffect(()=>{
        dispatch({type : 'reload'});
        getMovieUpcoming().then((res)=>{setPopular2(res)});
        getTVpopular().then((res)=>{setPopular3(res)});
    },[])

    useEffect(() => {
        if(state.reducer_movie){
            state.reducer_movie.then((state)=>{
                setPopular(state);
                console.log('popular',state);
                Active(state.results[0])
                throw new Error("Error in then()");
            }).catch((err)=>{               
                console.log('then error: ',err);
            })
        }     
    }, [state])

    const getVideo = async (resolve) => {
        const id = resolve.id;
        const result = await axios.get('api/detail/movie/' + id);
        console.log('getVideo ',result.data);
        setActiveVideo(result.data);
    }
 
    let getMovieUpcoming = async () => {
        const result = await axios.get('/api/upcoming')
        return result.data;
    }

    const getTVpopular = async () => {
        const result = await axios.get('/api/tv/popular')
        return result.data;
    }

    let [slide, setslide] = useState({ //슬라이드 관련
        maxpage: 3,
        width: 1120,
        page: 0,
        style: { transform: 'translateX(0px)' }
    });

    var mytimeout;
    function mytimer(movie){
        mytimeout= setTimeout(()=>{ Active(movie)},2000);        
    }
    function stoptimer() {        
        clearTimeout(mytimeout);
    }

    const Active = (data)=>{
        setActive(data);
        getVideo(data)  
    }


    function Slide(action) {
        const slideWidth = -slide.width;
        let slidepage = slide.page;
        if (action.type == 'left') {
            if (slide.page > 0) {
                slidepage--;
                setslide({
                    ...slide,
                    page: slidepage,
                    style: { transform: 'translateX(' + slideWidth * slidepage + 'px)' }
                });
            }
        }
        else if (action.type == 'right') {
            if (slide.page < slide.maxpage) {
                slidepage++;
                setslide({
                    ...slide,
                    page: slidepage,
                    style: { transform: 'translateX(' + slideWidth * slidepage + 'px)' }
                });
            }
        }
        console.log(slidepage);
    }
    return (
        <div className='Home'>
            <section className="top">
                <div className="movieBox">
                    <div className="player-wrapper">
                        {activeVideo != null ?
                            <ReactPlayer
                                className='react-player'
                                width='100%'
                                height='150%'
                                playing={true}
                                loop={true}
                                muted={playerState.muted}
                                url={'https://www.youtube.com/watch?v=' + activeVideo.videos.results[0].key} />
                            : null
                        }

                        <div className="react-player-mask"></div>
                        <div className="inner-head mycontainer contentsBox">
                            <ul className="nev" onMouseLeave={() => { setVisible({ ...visible, hover: 'home' }) }}>
                                <li onMouseEnter={() => { setVisible({ ...visible, hover: 'home' }) }}
                                    className={visible.hover == 'home' ? "nev-list nev-home on" : "nev-list nev-home"} >
                                    홈
                                </li>
                                <li onMouseEnter={() => { setVisible({ ...visible, hover: 'ranking' }) }}
                                    className={visible.hover == 'ranking' ? "nev-list nev-movie on" : "nev-list nev-movie"} >
                                    영화
                                    {visible.hover == 'ranking' ?
                                        <ul className='nev-sublist on'>
                                            <li className='on' onClick={() => { history.push('/movie/popular') }}>인기</li>
                                            <li className='on' onClick={() => { history.push('/movie/now-playing') }}>현재 상영중</li>
                                            <li className='on' onClick={() => { history.push('/movie/top-rated') }}>높은 평점</li>
                                            <li className='on' onClick={() => { history.push('/movie/upcoming') }}>개봉 예정</li>
                                        </ul> : null
                                    }                                    
                                </li>
                                <li onMouseEnter={() => { setVisible({ ...visible, hover: 'premovie' }) }}
                                    className={visible.hover == 'premovie' ? "nev-list nev-tv on" : "nev-list nev-tv"} >
                                    TV프로그램      
                                    {visible.hover == 'premovie' ?
                                        <ul className='nev-sublist on'>
                                            <li className='on' onClick={() => { history.push('/tv/popular') }}>인기</li>
                                            <li className='on' onClick={() => { history.push('/tv/airing-today') }}>오늘 방영</li>
                                            <li className='on' onClick={() => { history.push('/tv/on-the-air') }}>TV 방영중</li>
                                            <li className='on' onClick={() => { history.push('/tv/top-rated') }}>높은 평점</li>
                                        </ul> : null
                                    }  
                                </li>
                                <li onMouseEnter={() => { setVisible({ ...visible, hover: 'contents' }) }}
                                    className={visible.hover == 'contents' ? "nev-list nev-contents on" : "nev-list nev-contents"} >
                                    커뮤니티
                                    {visible.hover == 'contents' ?
                                        <ul className='nev-sublist on'>
                                            <li className='on' onClick={() => { history.push('/board/movie')}}>공지사항</li>
                                            <li className='on' onClick={() => { history.push('/board/movie')}}>영화</li>
                                            <li className='on' onClick={() => { history.push('/board/movie')}}>TV 프로그램</li>
                                            <li className='on' onClick={() => { history.push('/board/movie')}}>자유 게시판</li>
                                        </ul> : null
                                    }  
                                </li>
                            </ul>
                        </div>
                        <div className="inner-body mycontainer contentsBox">
                            <div className="title">
                                {active != null ? active.title : null}
                            </div>
                            <p className="posts">
                                {active != null ? active.overview : null}
                            </p>
                            <div className="preview-btn">
                                <p>예고편 보기</p>
                            </div>
                            <div className='volume'>
                                <i onClick={() => {
                                    setPlayerState({ ...playerState, muted: !playerState.muted })
                                }}>{playerState.muted ? btnVolumeMute : btnVolumeOn}{playerState.muted}</i>
                            </div>
                        </div>
                    </div>

                    <div className="ranking-wrapper">
                        <div className='-wrapper'>
                            <ul className="ranking" style={slide.style}>
                                {
                                    (popular != null) ?
                                        popular.results.map((movie, i) => {
                                            return (
                                                <li className="ranking-content" >
                                                    <div className='ranking-content-poster'>
                                                        <div className="defult">
                                                            <img src={poster_url + movie.poster_path}></img>
                                                            <div className="number">{i + 1}</div>
                                                            <div className="point blurEffect">평점 <b>{movie.vote_average.toFixed(1)}</b> / 투표수 <b>{movie.vote_count}</b></div>
                                                        </div>
                                                        <div className="info" onClick={()=>{history.push('movie/'+movie.id)}} 
                                                        onMouseEnter={()=>{mytimer(movie)}  }
                                                        onMouseLeave={()=>{stoptimer()}}>
                                                           <p>{movie.overview ? movie.overview : '입력된 내용이 없습니다.'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="title"><h4>{movie.title}</h4></div>
                                                </li>
                                            )
                                        })
                                        : null
                                }
                            </ul>
                        </div>
                        <i className="slide slide-left" style={slide.page == 0 ? { display: 'none' } : null} onClick={() => {
                            Slide({ type: 'left' });
                        }}>{btnSlideLeft}</i>
                        <i className="slide slide-right" style={slide.page == slide.maxpage ? { display: 'none' } : null} onClick={() => {
                            Slide({ type: 'right' });
                        }}>{btnSlideRight}</i>
                    </div>

                </div>
            </section>
            <section className="bottom">            
                <Searchbar></Searchbar>                                
                 {popular2 ?
                <CardListSlide movieOrTV={'movie'} state={popular2} title={'개봉 예정'}></CardListSlide>
                : '없음'
                }
                   {popular3 ?
                <CardListSlide movieOrTV={'TV'} state={popular3} title={'TV 인기'}></CardListSlide>
                : '없음'
                }            
                    
            </section>
        </div>
    )
}
export default Home;