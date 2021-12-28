import React, { useEffect } from "react";
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faPlay } from "@fortawesome/free-solid-svg-icons";
import ImageModal from '../component/ImageModal';
import '../Movie/Movie.scss'
import './credits.scss'
import { useState } from "react";
import { useHistory } from "react-router-dom";
import genre from '../genre.json';


const Credits = ({credits})=>{

    let [moreInt,setMoreInt] = useState(10);
    const moreEvent = ()=>{
        setMoreInt(moreInt+10);
    }
    let history = useHistory();
    function 장르목록(props) {
        let array = [];
        props.genre_ids.map(function (data) {
            let temp = genre.genres.find(e => e.id == data)
                array.push(temp.name)
        })
        return array;
    }
    return (
        <div>
            <div className="credits" style={{marginTop:'30px'}}>
                <div className='title'>
                    <h5>출연작</h5>
                    <span>{credits.credits.cast.length}</span>
                </div>
                <div className="detail" >
                    <ul >
                        {credits.credits.cast.slice(0, moreInt).map((data, i) => {
                            const info = {
                                dt1: '개봉',
                                dt2: '장르',
                                dt3: '내용'
                            }
                            const d1 = data.release_date;
                            const d2 = 장르목록(data).join(',');
                            const d3 = data.overview;
                            const movieid = data.id;
                            const image = data.poster_path;
                            const title = data.title;
                            const subtitle=data.original_title;
                            const noimage = '/img/noimage.jpg';
                            return (
                                <li>
                                    <div className="detail-list-poster" onClick={() => { history.push('/movie/' + movieid) }}>
                                        <img src={image != null ?
                                            'https://image.tmdb.org/t/p/w500' + image
                                            : noimage}></img>
                                    </div>
                                    <div className="detail-list-info">
                                        <div className="detail-title">{title}</div>
                                        <div className="detail-subtitle">{subtitle}</div>
                                        <dl><dt>{info.dt1}</dt><dd>{d1 != null ? d1.substring(0, 4) : '미발매'}</dd></dl>
                                        <dl><dt>{info.dt2}</dt><dd>{d2 != '' ? d2 : '미정'
                                        }
                                        </dd></dl>
                                        <dl><dt>{info.dt3}</dt><dd>{d3}</dd></dl>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    <hr></hr>
                    <div className="more">
                        <button className="btn_more" type="button" onClick={moreEvent}>더보기</button>
                    </div>
                    
                </div>           
            </div>
        </div>
    )
}
export default Credits