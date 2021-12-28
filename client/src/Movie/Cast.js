import { set } from "date-fns/esm";
import React from "react";
import { useHistory } from "react-router-dom";
import './Movie.scss'
const noimage = '/img/noimage.jpg'
function Cast(props){
    let history = useHistory();
    const crew = [...props.movie.credits.crew.sort((a,b)=> {
        return a.department < b.department ? -1 : a.department > b.department ? 1 : 0;
    })];

    const department = crew.filter((data, index) => {
         return crew.findIndex(e=>e.department == data.department) == index; 
        });
  
    return(
        <div className='Cast'>
            <div className='title'>
                <h5>출연진</h5>
                <span>{props.movie.credits.cast.length}</span>
            </div>
            <hr></hr>
            <ul className='mg-102'>
                {props.movie.credits.cast.map((data) => {
                    return (
                        <li className='mg102'>
                            <img className='nomalsize' src={data.profile_path != null ? 'https://image.tmdb.org/t/p/w500' + data.profile_path : noimage}
                            onClick={()=>{history.push('/person/'+data.id)}}></img>
                            <div className='names'>
                                <h6>{data.name}</h6>
                                <p>{data.character}</p>
                            </div>
                        </li>
                    )
                })
                }
            </ul>


            <div className='title'>
                <h5>제작진</h5>
                <span>{props.movie.credits.crew.length}</span>
            </div>
            <hr></hr>

            {department.map((A) => {
                return (
                    <div className='crew'>
                        <h4>{A.department}</h4>
                        <ul className='mg-102'>
                            {[...props.movie.credits.crew.filter(data => data.department === A.department)].map((data) => {
                                return (
                                    <li className='mg102'>
                                        <img className='smallsize' src={data.profile_path != null ? 'https://image.tmdb.org/t/p/w500' + data.profile_path : noimage}></img>
                                        <div className='names'>
                                            <h6>{data.name}</h6>
                                            <p>{data.job}</p>
                                        </div>
                                    </li>
                                )
                            })
                            }
                        </ul>
                    </div>
                )
            })}
        </div>
    )
}
export default Cast;