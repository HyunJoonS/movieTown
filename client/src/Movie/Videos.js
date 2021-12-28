import React, { useEffect } from "react";
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faPlay } from "@fortawesome/free-solid-svg-icons";
import ImageModal from '../component/ImageModal';
import './Movie.scss';
import { useState } from "react";

function Videos(props) {
    let [activeVideo, setActiveVideo] = useState([]);
    const btnSlideLeft = <FontAwesomeIcon icon={faAngleLeft} size="lg" />
    const btnSlideRight = <FontAwesomeIcon icon={faAngleRight} size="lg" />
    const btnPlay = <FontAwesomeIcon icon={faPlay} size="3x" />
    let [modalOpen,SetModalOpen] = useState(false);
    let [modalImage,SetModalImage]=useState();
    const modalControl=(img)=>{
        SetModalImage(img)
        modalClose();
    }
    const modalClose=()=>{
        SetModalOpen(!modalOpen);
    }
    
    let image_url = 'https://image.tmdb.org/t/p/w500'
    let image_orginal = 'https://image.tmdb.org/t/p/original';
    useEffect(()=>{
        if(props.movie.videos.results.length >0){
            setActiveVideo(props.movie.videos.results[0]);
        }      
    },[])

    let [slide, setslide] = useState({ //슬라이드 관련
        maxpage: (props.movie.videos.results.length / 4) - 1,
        width: 1120,
        page: 0,
        style: { transform: 'translateX(0px)' }
    });

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
        <div>
            {props.movie.videos.results.length > 0 ?            
            <div className='Videos'>
                <div className='title'>
                    <h5>영상</h5>
                    <span>{props.movie.videos.results.length}</span>
                </div>
                <hr></hr>                
                 <div className='video_wrap'>
                    <ReactPlayer
                        className='react-player'
                        width='100%'
                        height='100%'
                        controls='true'
                        url={'https://www.youtube.com/watch?v=' + activeVideo.key}
                    />
                </div> 
                <div className="video_list">
                    <ul>
                        {props.movie.videos.results.map((data) => {
                            return (
                                <li style={slide.style} onClick={() => {
                                    setActiveVideo(data);
                                }}>
                                    <div className="videoPhoto-item">
                                        <img src={"https://img.youtube.com/vi/" + data.key + "/sddefault.jpg"} />
                                        <span className='play_icon'>{btnPlay}</span>
                                        <span className='play_time'></span>
                                    </div>
                                </li>
                            )
                        })}

                    </ul>

                    <span className="slidebtn slide-L" style={slide.page == 0 ? { display: 'none' } : null} onClick={() => {
                        Slide({ type: 'left' });
                    }}>{btnSlideLeft}
                    </span>
                    <span className="slidebtn slide-R" style={slide.page == slide.maxpage ? { display: 'none' } : null} onClick={() => {
                        Slide({ type: 'right' });
                    }}>{btnSlideRight}
                    </span>
                </div>                                
            </div>            
                :
                <div className='Videos'><div className='title'>
                    <h5>영상</h5>
                    <span>{props.movie.videos.results.length}</span>
                </div>
                <hr></hr>
                <p>영상 제공 정보가 없습니다.</p>
                </div>}                
            <div className="Photos">
                <div className='title'>
                    <h5>포토</h5>
                    <span>{props.images.posters.length+props.images.backdrops.length}</span>
                </div>
                <hr></hr>  

                {props.images.backdrops.length>0 ?
                <div className='subtitle'>
                    <h4>배경</h4>                    
                </div>
                :null}         
                <ul className='list_photo'>
                        {[...props.images.backdrops.sort((a,b)=> a.width - b.width)].map((data)=>{
                            return(
                                <li className='small-size' onClick={()=>{modalControl(image_orginal+ data.file_path)}}>
                                    <div className='videoPhoto-item'>
                                        <img src={image_url+ data.file_path}/>                                        
                                        <span>{data.width+'x'+data.height}</span>
                                    </div>
                                </li> 
                            )
                        })}
                </ul>  
                {props.images.posters.length>0 ?
                <div className='subtitle'>
                    <h4>포스터</h4>                    
                </div>
                :null}                          
                <ul className='list_photo'>
                        {[...props.images.posters.sort((a,b)=> a.width - b.width)].map((data)=>{
                            return(
                                <li className='small-size'>
                                    <div className='videoPhoto-item'>
                                        <img src={image_url+ data.file_path}/>                                        
                                        <span>{data.width+'x'+data.height}</span>
                                    </div>
                                </li> 
                            )
                        })}
                </ul>  
            </div>
           {modalOpen && <ImageModal modalClose={modalClose} modalImage={modalImage}></ImageModal> }
        </div>
    )
}
export default Videos;