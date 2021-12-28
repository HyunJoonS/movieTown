import { faStar,faThumbsUp,faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState,useEffect, useRef } from "react";
import Review_view from './Review_view.js'
import './Movie.scss'
function Review(props){
    return(
        <Review_view
            dburl={'/api/movie/reviews'}
            id={props.id}
        ></Review_view>
    )
}

export default Review;