import React from "react"
import { useEffect } from "react";
import './modal.scss'
const Imagepopup = ({modalClose,modalImage})=> {
useEffect(()=>{
    console.log(modalImage);
    document.body.style.cssText = `
    position: fixed; 
    top: -${window.scrollY}px;
    overflow-y: scroll;
    width: 100%;`;
  return () => {
    const scrollY = document.body.style.top;
    document.body.style.cssText = '';
    window.scrollTo({
        top: parseInt(scrollY || '0', 10) * -1,
        left:0,
        behavior: 'instant'
      });
  };
},[])
const onCloseModal = (e) => {
    if(e.target === e.currentTarget){
        modalClose()
    }
}
    return (
        <div className="modal-bg" onClick={onCloseModal}>
            <div className="modal-wrap">
                <img className="fullsize" src={modalImage}></img>               
            </div>
        </div>
    )
}
export default Imagepopup;