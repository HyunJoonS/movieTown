import { useHistory } from "react-router"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import './Board_Write.scss'
import { useSelector } from "react-redux";
function Board_Write(params) {
    let history = useHistory();
    let [value,setValue]=useState('');
    let [selected,setSelected] = useState('none');
    let [title,setTitle] = useState('');
    let loginState = useSelector(a => a.reducer_user)
    
    useEffect(()=>{
      setSelected(params.type);
    },[])

    const selectHandler = (e)=>{
      setSelected(e.target.value);
    }

    const titleHandler = (e)=>{
      setTitle(e.target.value);
    }

    const onSubmit = ()=>{
      let body ={
        title : title,
        text : value,
        bbsType : selected,
       }
      if(body.text && body.title && selected != 'none'){
        axios.post('/api/board/write',body).then((res)=>{
          alert(res.data);
          history.push('/board/'+params.type)
        })
        console.log(body);
      }else{
        alert('입력 내용을 확인해주세요')
      }


    }
    const quillRef = useRef(); // 에디터 접근을 위한 ref return (

    // 이미지 처리를 하는 핸들러
    const imageHandler = () => {
        console.log('에디터에서 이미지 버튼을 클릭하면 이 핸들러가 시작됩니다!');
    
        // 1. 이미지를 저장할 input type=file DOM을 만든다.
        const input = document.createElement('input');
        // 속성 써주기
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
        // input이 클릭되면 파일 선택창이 나타난다.
    
        // input에 변화가 생긴다면 = 이미지를 선택
        input.addEventListener('change', async () => {
        console.log('온체인지');
        const file = input.files[0];
        // multer에 맞는 형식으로 데이터 만들어준다.
        const formData = new FormData();
        formData.append('img', file); // formData는 키-밸류 구조
        // 백엔드 multer라우터에 이미지를 보낸다.
        try {
            const result = await axios.post('http://localhost:5000/img', formData);
            console.log('성공 시, 백엔드가 보내주는 데이터', result.data.url);
            const IMG_URL = result.data.url;
            // 이 URL을 img 태그의 src에 넣은 요소를 현재 에디터의 커서에 넣어주면 에디터 내에서 이미지가 나타난다
            // src가 base64가 아닌 짧은 URL이기 때문에 데이터베이스에 에디터의 전체 글 내용을 저장할 수있게된다
            // 이미지는 꼭 로컬 백엔드 uploads 폴더가 아닌 다른 곳에 저장해 URL로 사용하면된다.
    
            // 이미지 태그를 에디터에 써주기 - 여러 방법이 있다.
            const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기
            // 1. 에디터 root의 innerHTML을 수정해주기
            // editor의 root는 에디터 컨텐츠들이 담겨있다. 거기에 img태그를 추가해준다.
            // 이미지를 업로드하면 -> 멀터에서 이미지 경로 URL을 받아와 -> 이미지 요소로 만들어 에디터 안에 넣어준다.
            // editor.root.innerHTML =
            //   editor.root.innerHTML + `<img src=${IMG_URL} /><br/>`; // 현재 있는 내용들 뒤에 써줘야한다.
    
            // 2. 현재 에디터 커서 위치값을 가져온다
            const range = editor.getSelection();
            // 가져온 위치에 이미지를 삽입한다
            editor.insertEmbed(range, 'image', IMG_URL);
        } catch (error) {
            console.log('실패했어요ㅠ');
        }
        });
    };

    const modules = useMemo(() => {
        return {
          toolbar: {
            container: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline','strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image'],
                [{ 'align': [] }, { 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                ['clean']
            ],
            handlers: {
              // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
              image: imageHandler,
            },
          },
        };
      }, []);

      const formats = [
        //'font',
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
        'align', 'color', 'background',        
      ]
    return(
        <div className="Board_Write">
            <div className='Write_tit'>
              <h3>글쓰기</h3>
              <span onClick={onSubmit}>등록</span>
            </div>            
            <hr className='hr'></hr>
            <div className="selectBoard" >
              <select value={selected} onChange={selectHandler} className='form'>   
                <option value='none'>===선택===</option>             
                <option value='notice' hidden>공지사항</option>   
                <option value='movie'>영화 게시판</option>
                <option value='tv'>TV 게시판</option>
                <option value='자유'>자유 게시판</option>
              </select>              
            </div>
            <div className="boardTitle">
              <input type='text' placeholder='제목을 입력해 주세요.' className='form'
              onChange={titleHandler}></input>
            </div>
             <div style={{height: "650px"}}>
                <ReactQuill 
                    ref={quillRef}
                    style={{height: "600px"}} 
                    theme="snow" 
                    modules={modules} 
                    formats={formats} 
                    value={value || ''} 
                    onChange={(content, delta, source, editor) => setValue(editor.getHTML())} />
            </div>
        </div>
    )
}
export default Board_Write;