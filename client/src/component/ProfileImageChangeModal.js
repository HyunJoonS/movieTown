import axios from "axios";
import React, { useState } from "react"
import { useRef } from "react";
import { useEffect } from "react";
import './modal.scss'
const ProfileImageChange = ({modalClose,id,profileImage})=> {
    let [Image,setImage] = useState(profileImage);
    let inputRef = useRef();
useEffect(()=>{
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


useEffect(()=>{
    // console.log(Image);
},[Image])
const onCloseModal = (e) => {
    if(e.target === e.currentTarget){
        modalClose()
    }
}

const onInputChange =(e)=>{
    let reader = new FileReader();
    let file = inputRef.current.files[0];
    if(file){
        reader.readAsDataURL(file);    
        reader.onloadend =()=>{
            setImage(reader.result);
        }    
    }
}
const onInputDelete =()=>{
    inputRef.current.value='';
    setImage('/img/noimage.jpg')
    console.log(inputRef.current.files[0]);
}
const onSubmit =()=>{
    let file = inputRef.current.files[0];
    if(file){
        const formData = new FormData();
        formData.append('profileimg',file)
        axios.post('/api/user/update/profileimage',formData).then((res)=>{
            window.location.replace("./mypage");
        }).catch(err => {
            alert('실패',err)
          });
    }else{
        alert('파일 삭제입니다.');
    }
}
//https://basketdeveloper.tistory.com/55
const handlePost=()=>{
    const formData = new FormData();
    formData.append('file', this.state.selectedFile);

    return axios.post("/api/upload", formData).then(res => {
      alert('성공')
    }).catch(err => {
      alert('실패')
    })
}
    return (
        <div className="modal-bg" onClick={onCloseModal}>
            <div className="modal-wrap">
                <div className="modal-profileImage">
                    <img src={Image}></img>
                </div>                
                <h4>프로필 사진</h4>
                <p>사진을 추가하면 다른 사람이 나를 알아보기 쉬워집니다.</p>    
                <div className="button">
                    <span onClick={()=>{inputRef.current.click()}}>
                        <input type="file" name="file" accept=".gif, .jpg, .png" ref={inputRef} onChange={onInputChange}/>

                        프로필 이미지 변경
                    </span>
                    <span onClick={onInputDelete}>
                        프로필 이미지 제거
                    </span>
                    <span className="bg-darkslategrey" onClick={modalClose}>
                        닫기
                    </span>
                    {Image != profileImage ?
                        <span className='bg-midnightblue' onClick={onSubmit}>
                            변경사항 저장
                        </span>
                        : null
                    }

                </div>
            </div>
        </div>
    )
}
export default ProfileImageChange;