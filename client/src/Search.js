import React, { useEffect, useState } from "react";
import qs from 'qs';
import { useLocation,useHistory } from "react-router";
import './Search.scss';
import genre from './genre.json';
import ContentsBox from "./component/Contentsbox";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Box } from "@material-ui/core";

const axios = require('axios');


function Search() {
    let [status,setStatus] = useState([]);
    let [movie, set_movie] = useState();
    let [title, set_title] = useState();
    let [tabmenu,setTabMenu]=useState(0);
    const getAxios = async () => {
        const query = qs.parse(window.location.search, { ignoreQueryPrefix: true })
        const result = await axios.get('api/search/' + query.query)
        setStatus(result.data);
        set_title(query.query);
        // set_movie(result.data)

        console.log(result.data);
    }
    useEffect(() => {
        getAxios();
    }, [useLocation()])

    const menuList = {
        0: [        
        <MovieList status={status[0]} menu={'전체'} title='영화'/>,
        <MovieList status={status[1]} menu={'전체'} title='TV프로그램'/>,
        <MovieList status={status[2]} menu={'전체'} title='영화인'/>,
        ],
        1: <MovieList status={status[0]} title='영화'/>,
        2: <MovieList status={status[1]} title='TV프로그램'/>,
        3: <MovieList status={status[2]} title={'영화인'}/>
    }

    const classname_Menu=(props)=>{
        try{
            if(props.total_results>0){
                return 'menu'
            }
            else{
                return 'menu off'
            }
        }catch{
            return 'menu off'
        }        
    }

    const click_Menu=(i)=>{
        try{
            if(status[i].total_results>0){
                console.log(i,status[i]);
                return setTabMenu(i+1);
            }
            else{
                return null
            }
        }catch{
            return null
        }        
    }
    return (
        <div className='Search'>
            <ContentsBox />
            <div className='search-body'>
                <h3 className="title">
                    <span className='title-accent'>'
                        {(title != null) ? title : null}'
                    </span> 
                    <span>검색결과</span>
                </h3>
                <ul className='tabmenu'>
                    <li className={tabmenu==0?'menu on':'menu'} onClick={()=>{setTabMenu(0)}}>
                        전체
                    </li>
                    <li className={tabmenu==1?'menu on':classname_Menu(status[0])} onClick={()=>{click_Menu(0)}}>
                        영화
                    </li>
                    <li className={tabmenu==2?'menu on':classname_Menu(status[1])} onClick={()=>{click_Menu(1)}}>
                        TV프로그램
                    </li>
                    <li className={tabmenu==3?'menu on':classname_Menu(status[2])} onClick={()=>{click_Menu(2)}}>
                        영화인
                    </li>
                </ul>
                {status.length>0?menuList[tabmenu]:<Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}


            </div>
        </div>
    )
}



function MovieList(props) {
    let [state,setState] = useState([]);
    let [info,setInfo] = useState({
        dt1 : '제작',
        dt2 : '장르',
        dt3 : '개요',
    })
    useEffect(()=>{
        if(props.menu=='전체'){
            setState(props.status.results.slice(0,4)); 
        }
        else{
            setState(props.status.results);
        }   
        if(props.title=='TV프로그램'){
            console.log('실행',info);
            setInfo({...info, dt1:'제작'})
        }    
        else if(props.title=='영화인'){
            setInfo({
                dt1 : '직업',
                dt2 : '작품',
                dt3 : '',
            })
        }
        console.log(props.status);
    },[props])

    const ImagePath=(data)=>{
        switch(props.title){
            case '영화인':                
                return data.profile_path;
            default :
                return data.poster_path;
        }
    }
    const title = (data)=>{
        if(props.title=='영화'){
            return data.title;
        }
        else if(props.title=='TV프로그램'){
            return data.name;
        }
        else{
            return data.name;
        }
    }

    const subTitle = (data)=>{
        if(props.title=='영화'){
            return data.original_title;
        }
        else if(props.title=='TV프로그램'){
            return data.original_name;
        }
        else{
            return data.name;
        }
    }
    const D1 =(data)=>{
        switch(props.title){
            case '영화':
                return data.release_date;
            case 'TV프로그램': 
                return data.first_air_date;
            default :
                return data.known_for_department;
        }
    }
    const D2 = (data)=>{
        switch(props.title){
            case '영화인':      
            let array=[];         
                data.known_for.map((data)=>{array.push(<span>{data.original_title+', '}</span>)}); 
                return array;
            default :
                return 장르목록(data).join(',');
        }
    }
    const history = useHistory();
    function 장르목록(props) {
        let array = [];
        props.genre_ids.map(function (data) {
            let temp = genre.genres.find(e => e.id == data)
                array.push(temp.name)
        })
        return array;
    }
    // <장르 props={data} key={i}/>
    if (state) {
        if (state.length > 0) {
            return (
                <div className="SearchComponent">
                    <div className='detail'>
                        <div className='classification'>
                            {props.title} <span>{props.status.total_results}</span>
                        </div>
                        <div className='detail-list'>
                            <ul>
                                {state.map((data,i) => {
                                    const d1 = D1(data);
                                    const d2 =  D2(data);
                                    const d3 = data.overview;
                                    const image = ImagePath(data);
                                    const noimage = 'img/noimage.jpg';
                                    return (
                                        <li>
                                            <div className="detail-list-poster" onClick={()=>{history.push('/movie/'+data.id)}}>
                                                <img src={image != null?
                                                    'https://image.tmdb.org/t/p/w500'+image
                                                :noimage}></img>
                                            </div>
                                            <div className="detail-list-info">
                                                <div className="detail-title">{title(data)}</div>
                                                <div className="detail-subtitle">{subTitle(data)}</div>
                                                <dl><dt>{info.dt1}</dt><dd>{d1!= null ? d1.substring(0,4) : '미발매'}</dd></dl>
                                                <dl><dt>{info.dt2}</dt><dd>{d2!='' ? d2 : '미정'                                                      
                                                }
                                                </dd></dl>
                                                <dl><dt>{info.dt3}</dt><dd>{d3}</dd></dl>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    <hr></hr>
                </div>
            )
        }
        else if (state.length == 0) {
            return (<div>{props.title} 검색결과 0건</div>)
        }
    }
    else {
        return (<Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>)
    }
}
export default Search;