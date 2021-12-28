import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import {Provider} from 'react-redux';
import {combineReducers, createStore} from 'redux';
import axios from 'axios';

let moviePouplar = null;
let userInfo = [];


let getAxios = async () => {
  const result = await axios.get('api/popular')
  return result.data;
}

let getLogin = async () => {
  const result = await axios.get('/api/login')
  return result.data;
}


function reducer_movie(state = moviePouplar, action){
  if(action.type ==='reload'){
    return getAxios();
  }
  else{
    return state;
  }
}
function reducer_user(state = userInfo, action) {
  if(action.type === 'login'){
    console.log('받음 payload : ', action.payload)
    return action.payload;      
  }
  if(action.type ==='logout'){
    let copy = {...state}
    window.sessionStorage.removeItem('loginID');
    copy.id = null;
    copy.login = false;
    return copy;
  }
  else{
    return state;
  }
}


let store = createStore(combineReducers({reducer_user,reducer_movie}));

ReactDOM.render(

  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
          <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
