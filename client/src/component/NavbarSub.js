import React, { useState } from "react"
import { useHistory } from "react-router";
function NavbarSub(props) {
    const [visible, setVisible] = useState({ hover: props.hover });
    const [childVisible, setChildVisible] = useState({ hover: props.page });

    let history = useHistory();
    return (
        <div className="NavbarSub">
            <ul className="nev" onMouseLeave={() => { setVisible({ ...visible, hover: props.hover }) }}>
                <li onMouseEnter={() => { setVisible({ ...visible, hover: 'home' }) }}
                    className={visible.hover == 'home' ? "nev-list nev-home on" : "nev-list nev-home"}
                    onClick={() => { history.push('/') }}>
                    홈
                </li>
                <li onMouseEnter={() => { setVisible({ ...visible, hover: 'movie' }) }}
                    className={visible.hover == 'movie' ? "nev-list nev-movie on" : "nev-list nev-movie"}
                    >
                    영화
                    {visible.hover == 'movie' ?
                        <ul className='nev-sublist on' 
                            onMouseLeave={() => { setChildVisible({ ...childVisible, hover: props.page }) }}
                            >
                            <li className={childVisible.hover == 'movie' ? 'on' : ''}
                                onMouseEnter={() => { setChildVisible({ hover: 'movie' }) }}
                                onClick={() => { history.push('/movie/popular') }}>
                                인기
                            </li>
                            <li className={childVisible.hover == 'now-playing' ? 'on' : ''}
                                onMouseEnter={() => { setChildVisible({ hover: 'now-playing' }) }}
                                onClick={() => { history.push('/movie/now-playing') }}>
                                현재 상영중
                            </li>
                            <li className={childVisible.hover == 'upcoming' ? 'on' : ''}
                                onMouseEnter={() => { setChildVisible({ hover: 'upcoming' }) }}
                                onClick={() => { history.push('/movie/upcoming') }}>
                                개봉 예정
                            </li>
                            <li className={childVisible.hover == 'top-rated' ? 'on' : ''}
                                onMouseEnter={() => { setChildVisible({ hover: 'top-rated' }) }}
                                onClick={() => { history.push('/movie/top-rated') }}>
                                높은 평점
                            </li>
                        </ul> : null
                    }
                </li>

                <li onMouseEnter={() => { setVisible({ ...visible, hover: 'tv' }) }}
                    className={visible.hover == 'tv' ? "nev-list nev-tv on" : "nev-list nev-tv"}
                    >
                    TV프로그램
                    {visible.hover == 'tv' ?
                        <ul className='nev-sublist on' 
                            onMouseLeave={() => { setChildVisible({ ...childVisible, hover: props.page }) }}
                            >
                            <li className={childVisible.hover == 'tv' ? 'on' : ''}
                                onMouseEnter={() => { setChildVisible({ hover: 'tv' }) }}
                                onClick={() => { history.push('/tv/popular') }}>
                                인기
                            </li>
                            <li className={childVisible.hover == 'airing-today' ? 'on' : ''}
                                onMouseEnter={() => { setChildVisible({ hover: 'airing-today' }) }}
                                onClick={() => { history.push('/tv/airing-today') }}>
                                오늘 방영
                            </li>
                            <li className={childVisible.hover == 'on-the-air' ? 'on' : ''}
                                onMouseEnter={() => { setChildVisible({ hover: 'on-the-air' }) }}
                                onClick={() => { history.push('/tv/on-the-air') }}>
                                TV 방영중
                            </li>
                            <li className={childVisible.hover == 'tvtop-rated' ? 'on' : ''}
                                onMouseEnter={() => { setChildVisible({ hover: 'tvtop-rated' }) }}
                                onClick={() => { history.push('/tv/top-rated') }}>
                                높은 평점
                            </li>
                        </ul> : null
                    }
                </li>

                <li onMouseEnter={() => { setVisible({ ...visible, hover: 'community' }) }}
                    className={visible.hover == 'community' ? "nev-list nev-community on" : "nev-list nev-community"}
                    >
                    커뮤니티
                    {visible.hover == 'community' ?
                        <ul className='nev-sublist on' 
                            onMouseLeave={() => { setChildVisible({ ...childVisible, hover: props.page }) }}
                            >
                            <li className={childVisible.hover == 'notice-board' ? 'on' : ''}
                                onMouseEnter={() => { setChildVisible({ hover: 'notice-board' }) }}
                                onClick={()=>{history.push('/board/notice')}}>
                                공지사항
                            </li>
                            <li className={childVisible.hover == 'movie-board' ? 'on' : ''}
                                onMouseEnter={() => { setChildVisible({ hover: 'movie-board' }) }}
                                onClick={()=>{history.push('/board/movie')}}>
                                영화
                            </li>
                            <li className={childVisible.hover == 'tv-board' ? 'on' : ''}
                                onMouseEnter={() => { setChildVisible({ hover: 'tv-board' }) }}
                                onClick={()=>{history.push('/board/tv')}}>
                                TV 프로그램
                            </li>
                            <li className={childVisible.hover == 'free-board' ? 'on' : ''}
                                onMouseEnter={() => { setChildVisible({ hover: 'free-board' }) }}
                                onClick={()=>{history.push('/board/free')}}>
                                자유게시판
                            </li>
                        </ul> : null
                    }
                </li>

            </ul>
        </div>
    )
}

export default NavbarSub;