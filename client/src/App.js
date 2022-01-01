import logo from './logo.svg';
import './App.css';
import Search from './Search';
import Home from './Home';
import MoviePopular from './Movie/ranking/Movie_popular';
import Movie_nowplaying from './Movie/ranking/Movie_nowplaying';
import Movie_toprated from './Movie/ranking/Movie_toprated';
import Movie_upcoming from './Movie/ranking/Movie_upcoming';
import Movie from './Movie/Movie';

import TV_airingtoday from './TV/ranking/TV_airingtoday';
import TV_toprated from './TV/ranking/TV_toprated';
import TV_ontheair from './TV/ranking/TV_ontheair';
import TV_Popular from './TV/ranking/TV_Popular';
import TV from './TV/TV';
import Person from './person/Person';

import Board_Movie_List from 'board/movie/movie_board_list';
import Board_Movie_View from 'board/movie/movie_board_view';
import Board_Movie_Write from 'board/movie/movie_board_write';
import Board_Movie_Modify from 'board/movie/movie_board_modify';
import Chatting from './component/Chatting';



import Mypage from './Login/Mypage';
import Login from './Login/Login';
import Navbar from './component/Navbar';
import { Link, useHistory, Switch, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import {useDispatch} from 'react-redux'

function App() {
  let dispatch = useDispatch();
  useEffect(()=>{

    // dispatch({type : 'reload'});
    // dispatch({type :'login'})
    // console.log('새로고침 되었습니다.');
  },[])

  return (
    <div>      
      <Switch>
        <Route path="/login"><Login/></Route>
        <Route path="/register"><div>회원가입 페이지</div></Route>        
        <Route path="/*">
          <Navbar />
          <Chatting></Chatting>
          <Switch>
            
            <Route path="/mypage"><Mypage/></Route>
            <Route path="/board/:type/write"><Board_Movie_Write /></Route>
            <Route path="/board/modify/:id"><Board_Movie_Modify /></Route>
            <Route path="/board/:type/:id"><Board_Movie_View /></Route>
            <Route path="/board/:type"><Board_Movie_List /></Route>

            <Route path="/movie/upcoming"><Movie_upcoming /></Route>
            <Route path="/movie/top-rated"><Movie_toprated /></Route>
            <Route path="/movie/now-playing"><Movie_nowplaying /></Route>
            <Route path="/movie/popular"><MoviePopular /></Route>
            <Route path="/movie/:id"><Movie /></Route>

            <Route path="/tv/airing-today"><TV_airingtoday /></Route>
            <Route path="/tv/top-rated"><TV_toprated /></Route>
            <Route path="/tv/on-the-air"><TV_ontheair /></Route>
            <Route path="/tv/popular"><TV_Popular /></Route>
            <Route path="/tv/:id"><TV /></Route>

            <Route path="/person/:id"><Person/></Route>
            
            <Route path="/search"><Search /></Route>
            <Route exact path="/"><Home /></Route>
          </Switch>
        </Route>       
      </Switch>
      </div>
  );
}



export default App;
