import { faAngleRight, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import ContentsBox from "../component/Contentsbox";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Box } from "@material-ui/core";
import '../Movie/Movie.scss'
import Credits from './Credits'
import Videos from './Videos'
import Review from "../Movie/Review";

const noimage = '/img/noimage.jpg'
function Person(props) {
    let [movie, setMovie] = useState(null);
    let [images, setImages] = useState(null);
    let [응답코드,set응답코드] = useState();
    let { id } = useParams();
    let [menu, setMenu] = useState({ tabNum: 0 });
    const menuList = {
        0: 
        <줄거리 movie={movie} key={1} />,
        // <출연진 movie={movie} key={2} setMenu={setMenu} />,
        // <영상포토 movie={movie} images={images} key={3} setMenu={setMenu}/>],
        1: <Credits credits={movie}/>,
        2: <Videos movie={movie} images={images} />,
    }
    function 유효성검사(params,i) {
        try{
            if(params.results.KR[i] != null){                
                return true;
            }
            return false;
        }
        catch(e){
            return false;
        }
        
    }

    const getAxios_movie =()=>{
        axios.get(`/api/person/${id}`).then((res)=>{
            setMovie(res.data); set응답코드(res.status); console.log('인물',res)
        }).catch(err=>console.log(err));
    }

    const getAxios_images = ()=>{
        axios.get(`/api/images/person/${id}`).then((res)=>{
            setImages(res.data); console.log('이미지',res)
        }).catch(err=>console.log(err));          
    }

    useEffect(() => {
        getAxios_movie();
        getAxios_images();
    }, [id])

    //한국등급
    let release_dates = () => {
        return movie.release_dates.results.findIndex((data) => data.iso_3166_1 == 'KR')
    }
    if(응답코드){
        return (
            <div className='Movie'>
                {응답코드 == 200?
                    <div>
                        <ContentsBox />
                        <section className='main'>
                            <div className="poster">
                                <img src={movie.profile_path != null ? 'https://image.tmdb.org/t/p/w500' + movie.profile_path : noimage}></img>
                            </div>
                            <div className="detail">
                                <div className="detail-title">
                                    <div className="detail-title-main">
                                        <span>{movie.name}</span>
                                    </div>                                
                                </div>
                                <div className="detail-info">
                                    <div className="inner-info">
                                        <dl><dt>직업</dt><dd>{movie.known_for_department?movie.known_for_department:'정보없음'}</dd></dl>
                                        <dl><dt>작품수</dt><dd>{movie.combined_credits?movie.combined_credits.cast.length:'정보없음'}</dd></dl>
                                        <dl><dt>성별</dt><dd>{movie.gender==1?'여성':'남성'}</dd></dl>
                                        <dl><dt>생일</dt><dd>{movie.birthday?movie.birthday:'정보없음'}</dd></dl>
                                        <dl><dt>출생지</dt><dd>{movie.place_of_birth}</dd></dl>
                                        <dl><dt></dt><dd></dd></dl>
                                    </div>
                                    <div className="inner-info">
                                        {movie.also_known_as.slice(0,6).map((data,i)=>{
                                            return(
                                                
                                                <dl><dt>{i+'.'}</dt><dd>{data}</dd></dl>
                                            )
                                        })}
                                        
                                                            
                                    </div>
                                </div>
    
                            </div>
                        </section>
                        <section className='body'>
                            <ul className="tabmenu">
                                <li className={menu.tabNum === 0 ? 'on' : ''} onClick={() => { setMenu({ tabNum: 0 }) }}>주요정보</li>
                                <li className={menu.tabNum === 1 ? 'on' : ''} onClick={() => { setMenu({ tabNum: 1 }) }}>출연작품</li>
                                <li className={menu.tabNum === 2 ? 'on' : ''} onClick={() => { setMenu({ tabNum: 2 }) }}>포토</li>
                            </ul>
    
                            <div>

                                {images!=null ?
                                    menuList[menu.tabNum]
                                    : null} 
                            </div>
    
    
    
                        </section>
                    </div>
                    : 
                    <div>잘못된 페이지 입니다.</div>
                    }
            </div>
        )
    }
    else{
        return( <div className="123123" style={{height:'90vh',position:'relative'}}>
        <Box sx={{position:'absolute',left:'50%',top:'50%'}}><CircularProgress /></Box>
    </div>)
    }
   
}

function 줄거리(props) {
    return (
        <div className='Movie-components'>
            <div className='story' onClick={()=>{}}>
                <span className="qlabel" its-ta-ident-ref="http://www.wikidata.org/entity/Q9176">
                {props.movie.translations.translations[0].data.biography}
                </span>
            </div>
        </div>
    )
}

function 출연진(props) {
    const btnSlideRight = <FontAwesomeIcon icon={faAngleRight} size="lg" />
    let num = () => {
        let max = 7;
        if (props.movie.credits.cast.length > max) {
            return max;
        }
        else { return props.movie.credits.cast.length; }
    }
    const MenuMoveEvent=()=>{
        props.setMenu({tabNum:1});
    }
    return (
        <div className='Movie-components' onClick={MenuMoveEvent}>
            <div className='cast'>
                <div className='more'>
                    <h5>출연진</h5>
                    <a>더보기<span>{btnSlideRight}</span></a>
                </div>
                <hr></hr>
                <ul>
                    {[...Array(num())].map((data, i) => {
                        return (
                            <li>
                                <img src={props.movie.credits.cast[i].profile_path != null ? 'https://image.tmdb.org/t/p/w500' + props.movie.credits.cast[i].profile_path : noimage}></img>
                                <div className='names'>
                                    <h6>{props.movie.credits.cast[i].name}</h6>
                                    <p>{props.movie.credits.cast[i].character}</p>
                                </div>
                            </li>
                        )
                    })
                    }
                </ul>
            </div>
        </div>
    )
}
function 영상포토(props) {
    let image_url = 'https://image.tmdb.org/t/p/w500'
    const btnSlideRight = <FontAwesomeIcon icon={faAngleRight} size="lg" />
    const btnPlay = <FontAwesomeIcon icon={faPlay} size="3x" />
    const MenuMoveEvent=()=>{
        props.setMenu({tabNum:2});
    }
    useEffect(()=>{
        console.log('영상포토',props.images.profiles.length);
    },[])
    return (
        <div className='Movie-components'>
            <div className='videosPhoto'>
                <div className='more' onClick={MenuMoveEvent}>
                    <h5>영상/포토</h5>
                    <a>더보기<span>{btnSlideRight}</span></a>
                </div>
                <hr></hr>
                {props.images.profiles.length>0?
                <>
                {/* <ul className='list_video'>
                    {
                        [...props.movie.videos.results.slice(0, 2)].map((data) => {
                            return (
                                <li className='big-size' onClick={MenuMoveEvent}>
                                    <div className='videoPhoto-item'>
                                        <img src={"https://img.youtube.com/vi/" + data.key + "/sddefault.jpg"} />
                                        <span className='play_icon'>{btnPlay}</span>
                                        <span className='play_time'></span>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul> */}

                <ul className='list_photo'>
                    {[...props.images.profiles.sort((a, b) => a.width - b.width).slice(0, 4)].map((data) => {
                        return (
                            <li className='small-size' onClick={MenuMoveEvent}>
                                <div className='videoPhoto-item'>
                                    <img src={image_url + data.file_path} />
                                </div>
                            </li>
                        )
                    })}
                </ul>
                </>
                :<>'정보가 없습니다.'<br></br></>
                }
            </div>
        </div>
    )
}
export default Person;