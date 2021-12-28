import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from "react-router-dom";
import './compoments.scss';

function Searchbar() {
    const button = <FontAwesomeIcon icon={faSearch} size="lg" />
    let [영화, set영화] = useState('');

    let history = useHistory();
    function 영화검색() {
        history.push('/search?query=' + 영화);
    }
    return (
        <div className="search-wrapper">
            <div class="box_search">
                <input type="text" class="input_search" name="q" title="검색어 입력" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="영화, 인물 검색"
                    onChange={(e) => { set영화(e.target.value) }}
                    onKeyUp={(e) => { if (e.key == 'Enter') 영화검색() }} />
                <button type="button" class="btn_search" data-tiara-layer="search" data-tiara-copy="내부검색" onClick={() => { 영화검색() }}>
                    {button}
                </button>
            </div>
        </div>
    )
  }
  export default Searchbar;