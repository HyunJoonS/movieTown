import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import './CardList.scss'

function CardList(props) {
    let history = useHistory();
    let poster_url = 'https://image.tmdb.org/t/p/w500'
    
    const btnSlideLeft = <FontAwesomeIcon icon={faAngleLeft} size="lg" />
    const btnSlideRight = <FontAwesomeIcon icon={faAngleRight} size="lg" />

    let [slide, setslide] = useState({ //슬라이드 관련
        maxpage: 3,
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
        <div className='CardList'>
        <div className="ranking-wrapper">
        <div className="maintitle">{props.title}</div>
            <div className='-wrapper'>
                <ul className="ranking" style={slide.style}>
                    {
                        (props.state != null) ?
                        props.state.results.map((movie, i) => {
                                return (
                                    <li className="ranking-content">
                                        <div className='ranking-content-poster'>
                                            <div className="defult">
                                                <img src={poster_url + movie.poster_path}></img>
                                                <div className="number">{i + 1}</div>
                                                <div className="point blurEffect">평점 <b>{movie.vote_average.toFixed(1)}</b> / 투표수 <b>{movie.vote_count}</b></div>
                                            </div>
                                            <div className="info" onClick={() => { history.push(`/${props.movieOrTV}/${movie.id}`) }}>
                                                <p>{movie.overview ? movie.overview : '입력된 내용이 없습니다.'}</p>
                                            </div>
                                        </div>
                                        <div className="title"><h4>{movie.title ? movie.title :movie.name}</h4></div>
                                        <div className="title"><p>{movie.release_date ? '개봉 '+ movie.release_date : '첫방영 '+movie.first_air_date}</p></div>
                                    </li>
                                )
                            })
                            : null
                    }
                </ul>
            </div>
        </div>
        </div>
    )
}

export default CardList;