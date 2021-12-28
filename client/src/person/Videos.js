import React, { useEffect } from "react";
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faPlay } from "@fortawesome/free-solid-svg-icons";
import ImageModal from '../component/ImageModal';
import '../Movie/Movie.scss'
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

    try{
        return (
            <div>
                <div className="Photos" style={{marginTop:'30px'}}>
                    <div className='title'>
                        <h5>포토</h5>
                        <span>{props.images.profiles.length}</span>
                    </div>
                    <hr></hr>  
                    <ul className='list_photo'>
                            {[...props.images.profiles.sort((a,b)=> a.width - b.width)].map((data)=>{
                                return(
                                    <li className='small-size' onClick={()=>{modalControl(image_orginal+ data.file_path)}}>
                                        <div className='videoPhoto-item' style={{height:'150px'}}>
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
    catch(err){
        return(<>데이터 없음</>)
    }
}
export default Videos;