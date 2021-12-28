import { useEffect, useRef, useState } from "react";
import { isElementOfType } from "react-dom/test-utils";
import { useHistory } from "react-router";
import './Board_list.scss'

function Board_List(params) {
    return (
        <div>
            <Board_top_List value={params.value} setValue={params.setValue} />
            <ListStyle state={params.state} value={params.value} type={params.type} />
            <SearchBar state={params.state} type={params.type}
                value={params.value} setValue={params.setValue} />
        </div>
    )
}

function Board_top_List(params) {
    const selectHandler = (e) => {
        params.setValue({
            ...params.value,
            limit: e.target.value,
        });
    }
    return (
        <div className='BoardList'>
            <input type="checkbox" id='hide_Notice' />
            <label for='hide_Notice'>공지사항 숨기기</label>
            <select name="fruits" class="select" onChange={selectHandler}>
                <option value="15">15개씩</option>
                <option value="20">20개씩</option>
                <option value="30">30개씩</option>
                <option value="40">40개씩</option>
                <option value="50">50개씩</option>
            </select>
        </div>
    )
}
function ListStyle(params) {
    const offset = new Date().getTimezoneOffset() * 60000;
    const st_date = new Date(Date.now() - offset).toISOString().substr(0, 10).replace(/-/gi, '.');
    let history = useHistory();
    return (
        <div className='ListStyle'>
            <table>
                <thead>
                    <tr>
                        <th scope='col'></th>
                        <th scope='col'>제목</th>
                        <th scope='col'>작성자</th>
                        <th scope='col'>작성일</th>
                        <th scope='col'>조회</th>
                    </tr>
                </thead>
                <tbody>
                    {params.state.map((data) => {
                        return (
                            <tr onClick={() => {
                                console.log('보낼데이터',params);
                                history.push({
                                    pathname: `./${params.type}/` + data.boardID,
                                    state:{params}
                                })
                            }}>
                                <td>{data.boardID}</td>
                                <td>{data.boardTitle}{data.comments>0?<span className="bbs-comments-count">[{data.comments}]</span>:null}</td>
                                <td>{data.writerID}</td>
                                <td>{st_date == data.createDate.substring(0, 10) ? data.createDate.substring(12, 17) : data.createDate}</td>
                                <td>{data.read_Count}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {params.state.length > 0 ? null : <h5 style={{ marginTop: '40px' }}>게시글이 없습니다.</h5>}
            <div className='postbtn'>
                <span onClick={() => { history.push(`./${params.type}/write`) }}>글쓰기</span>
            </div>

        </div>
    )
}

function SearchBar(params) {
    //===========페이징==============//
    let maxcount = (params.state.length > 0 ? params.state[0].maxCount : 0);
    let page = params.value.page;
    let limit = params.value.limit;
    const PageMove = (p) => {
        params.setValue({
            ...params.value,
            page: p
        })
    }

    function MaxPages() {
        let maxpage = parseInt(maxcount / limit);
        if (maxcount % limit != 0) {
            maxpage += 1;
        }
        return maxpage;
    }

    function Paging() {
        const result = [];
        let currentPage = params.value.page;
        let startPage = (currentPage - currentPage % 10) + 1; //시작페이지
        let MaxPage = MaxPages(); // 마지막페이지
        if (startPage > 10) {
            result.push(
                <div className="pre">
                    <span>이전</span>
                </div>
            )
        }
        for (startPage; startPage <= MaxPage; startPage++) {
            let i = startPage % 10; //클로져때문에 내부에 i 선언
            if (i <= 10) {
                result.push(
                    <span className={params.value.page == i ? 'selectedpage' : ''}
                        onClick={() => { PageMove(i) }}>{i}</span>
                )
            } else {
                result.push(
                    <div className="next">
                        <span>다음</span>
                    </div>
                )
                break;
            }
        }
        return result;
    }
    //=============검색=================//
    const searchTerm = useRef();
    const searchRange = useRef();
    const searchText = useRef();
    let [selected, setSelected] = useState(params.value.searchTerm);
    let [selected2, setSelected2] = useState(params.value.searchRange);
    let [text, setText] = useState(params.value.searchText);
    const textHandler = (e) => {
        setText(e.target.value);
    }
    const selectHandler = (e) => {
        setSelected(e.target.value);
    }
    const selectHandler2 = (e) => {
        setSelected2(e.target.value);
    }
    let searchEvent = () => {
        params.setValue({
            ...params.value,
            page: 1,
            searchTerm: searchTerm.current.value,
            searchRange: searchRange.current.value,
            searchText: searchText.current.value,
        })
    }

    return (
        <div className='bbs_searchbar'>
            <div className="paging">
                <div className='page'>
                    {Paging()}
                </div>
            </div>
            <hr></hr>
            <div className="list_search">
                <select value={selected} ref={searchTerm} onChange={selectHandler}>
                    <option value='전체기간'>전체기간</option>
                    <option value='1일'>1일</option>
                    <option value='1주'>1주</option>
                    <option value='1개월'>1개월</option>
                    <option value='6개월'>6개월</option>
                    <option value='1년'>1년</option>
                </select>
                <select value={selected2} ref={searchRange} onChange={selectHandler2}>
                    <option value='게시글'>게시글</option>
                    <option value='제목만'>제목만</option>
                    <option value='글작성자'>글작성자</option>
                    <option value='댓글내용'>댓글내용</option>
                    <option value='댓글작성자'>댓글작성자</option>
                </select>
                <input type="text" value={text} placeholder='검색어를 입력해주세요' onChange={textHandler} ref={searchText} />
                <button type='button' onClick={searchEvent}>검색</button>
            </div>

        </div>
    )
}

export default Board_List;