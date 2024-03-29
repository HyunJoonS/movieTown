var router = require('express').Router();
const {connection} = require('../dbconnection')
const datetime = require('../datatime');
const { query } = require('../dbconnection');
const e = require('connect-flash');


function 로그인체크(요청,응답,next){
    if(요청.user){
        next();
    }
    else{
        응답.send('로그인을 해주세요');
    }
}

router.delete('/board/delete/:id',(req,res)=>{
    let boardID=req.params.id;
    let sql = `DELETE FROM board WHERE boardID = ${boardID}`;
    connection.query(sql,(err,rows,filds)=>{
        try{
            if(err){
                console.log(err);
            }else{
                res.send(rows);
            }
        }catch(err){
            console.log(err);
        }
    })
})

router.get('/bbs/notice/',(req,res)=>{
    let sql = `SELECT A.boardID,C.NickName,A.boardTitle,A.boardText,A.writerID,A.boardType,A.read_Count,DATE_FORMAT(A.createDate,'%Y.%m.%d. %H:%i') AS createDate, IFNULL(comments,0) AS comments
    from board A LEFT JOIN (SELECT boardID,COUNT(*) AS comments FROM board_comment GROUP BY boardID) B ON A.boardID = B.boardID LEFT JOIN login C ON A.writerID = C.userID 
    WHERE boardType = 'notice' ORDER BY A.boardID DESC LIMIT 5`
    connection.query(sql,(err,rows,filds)=>{
        try{
            if(err){
                console.log(err);
            }else{
                res.send(rows);
            }
        }catch(err){
            console.log(err);
        }
    })
})

//글쓰기
router.post('/board/write',로그인체크,(req,res)=>{
    let sql = 'INSERT INTO board VALUE (NULL,?,?,NOW(),NOW(),?,?,0)'    
    let params =[
        req.body.title,
        req.body.text,
        req.user[0].userID,
        req.body.bbsType
    ]
    connection.query(sql,params,(err,rows,fields)=>{
        try{
            if(err){
                console.log(err);
            }else{
                res.send('등록완료');
            }
        }catch(err){
            console.log(err);
        }
    })
})

//글 수정하기
router.post('/board/updqte',로그인체크,(req,res)=>{
    let sql = `UPDATE board SET boardTitle=?, boardText=?, boardType=? WHERE boardID=?`
    let params =[
        req.body.title,
        req.body.text,
        req.body.bbsType,
        req.body.bbsID
    ]
    connection.query(sql,params,(err,rows,fields)=>{
        try{
            if(err){
                console.log(err);
            }else{
                res.send('수정완료');
            }
        }catch(err){
            console.log(err);
        }
    })
})

//게시판 목록 글 불러오기
router.post('/board/list/:id',(req,res)=>{

    let page = req.body.page
    let sql = `SELECT boardID,boardTitle,boardText,writerID,boardType,read_Count,DATE_FORMAT(createDate,'%Y.%m.%d. %H:%i') AS createDate FROM board WHERE boardType = ? ORDER BY boardID desc`    
    let params =[
        req.params.id
    ]
    connection.query(sql,params,(err,rows,fields)=>{
        try{
            if(err){
                console.log(err);
            }else{
                res.send(rows);
                // console.log(rows);
            }
        }catch(err){
            console.log(err);
        }
    })
})

//게시판 목록 글 불러오기
router.get('/board/list/:id',(req,res)=>{
    console.log("요청들어옴");

    // let boardType=req.params.id;
    let boardType=req.params.id;
    let page = req.query.page;
    let limit = req.query.limit; //몇개
    let offset = (page-1)*limit; //몇번째부터 
    let 기간='';       
    let 검색범위='';
    let 검색어=req.query.searchText;
    console.log(검색어);
    switch(req.query.searchTerm){
        case '전체기간': 
            기간='';
            break;
        case '1일':
            기간='AND createDate >= DATE_ADD(NOW(),INTERVAL -1 DAY) '
            break;
        case '1주':
            기간 = 'AND createDate >= DATE_ADD(NOW(),INTERVAL -1 WEEK) '
            break;
        case '1개월':
            기간 = 'AND createDate >= DATE_ADD(NOW(),INTERVAL -1 MONTH) '
            break;
        case '6개월':
            기간 = 'AND createDate >= DATE_ADD(NOW(),INTERVAL -6 MONTH) '
            break;
        case '1년':
            기간 = 'AND createDate >= DATE_ADD(NOW(),INTERVAL -1 YEAR) '
            break;
    }    

    //검색 범위
    switch(req.query.searchRange){
        case '게시글': 
            검색어!=''?
            검색범위=`AND boardTitle LIKE '%${검색어}%' or boardText LIKE '%${검색어}%'`
            :검색범위=''
            break;
        case '제목만':
            검색어!=''?
            검색범위=`AND boardTitle LIKE '%${검색어}%'`
            :검색범위=''
            break;
        case '글작성자':
            검색어!=''?
            검색범위 = `AND NickName LIKE '${검색어}'`
            :검색범위=''
            break;
        case '댓글내용':
            검색어!=''?
            검색범위 = `AND boardTitle LIKE '%${검색어}%'`
            :검색범위=''
            break;
        case '댓글작성자':
            검색어!=''?
            검색범위 = `AND boardTitle LIKE '%${검색어}%'`
            :검색범위=''
            break;
    }
    let where= `boardType='${boardType}' ${기간} ${검색범위}`
    let sql = `SELECT A.boardID,C.NickName,A.boardTitle,A.boardText,A.writerID,A.boardType,A.read_Count,DATE_FORMAT(A.createDate,'%Y.%m.%d. %H:%i') AS createDate, (SELECT COUNT(*) FROM board WHERE ${where}) AS maxCount, IFNULL(comments,0) AS comments
    from board A LEFT JOIN (SELECT boardID,COUNT(*) AS comments FROM board_comment GROUP BY boardID) B ON A.boardID = B.boardID LEFT JOIN login C ON A.writerID = C.userID 
    WHERE ${where} ORDER BY A.boardID DESC LIMIT ${limit} OFFSET ${offset};
    `
    let params =[
        parseInt(limit),
        parseInt(offset)
    ]
    connection.query(sql,params,(err,rows,fields)=>{
        try{
            if(err){
                console.log(err);
            }else{
                res.send(rows);
            }
        }catch(err){
            console.log(err);
        }
    })
})

//게시물 상세보기
router.get('/board/:id',(req,res)=>{
    let sql = 'SELECT * FROM board WHERE boardID = ?'    
    let params =[
        req.params.id
    ]
    connection.query(sql,params,(err,rows,fields)=>{
        try{
            if(err){
                console.log(err);
            }else{
                res.send(rows);
            }
        }catch(err){
            console.log(err);
        }
    })
})

//이전, 다음 게시물 목록 가져오기
router.get('/board/limit/:id',(req,res)=>{
    let sql = 
    `(SELECT boardID,B.NickName,B.profileImage,boardTitle,boardText,writerID,boardType,read_Count,DATE_FORMAT(createDate,'%Y.%m.%d. %H:%i') AS createDate FROM board A LEFT JOIN login B ON A.writerID = B.userID WHERE boardID<=${req.params.id} AND boardType=(SELECT boardType FROM board WHERE boardID=${req.params.id}) order BY boardID desc LIMIT 3) UNION
    (SELECT boardID,B.NickName,B.profileImage,boardTitle,boardText,writerID,boardType,read_Count,DATE_FORMAT(createDate,'%Y.%m.%d. %H:%i') AS createDate FROM board A LEFT JOIN login B ON A.writerID = B.userID WHERE boardID>=${req.params.id} AND boardType=(SELECT boardType FROM board WHERE boardID=${req.params.id}) order by boardID ASC  LIMIT 3) ORDER BY boardID DESC`

    connection.query(sql,(err,rows,fields)=>{
        try{
            if(err){
                console.log(err);
            }else{
                res.send(rows);
            }
        }catch(err){
            console.log(err);
        }
    })
})



//#댓글 달기
router.post('/board/comments',로그인체크,(req,res)=>{
    
    let myid = `(SELECT * FROM (SELECT MAX(id)+1 FROM board_comment) AS TEMP)`; //댓글index
    let bbsID = req.body.boardID; //게시물번호
    let text = req.body.text;
    let userID = req.user[0].userID;
    let parent = req.body.parent;
    let groupID = `(SELECT * FROM (SELECT groupID FROM board_comment WHERE id=${parent}) AS groupID)`;
    let depth = `(SELECT * FROM (SELECT depth+1 depth FROM board_comment WHERE id=${parent}) AS depth)`;
    let seq = `(SELECT * FROM (SELECT MAX(seq)+1 FROM board_comment WHERE groupID=(SELECT groupID FROM board_comment WHERE id=${parent} LIMIT 1)) AS seq)`
    console.log(req.body.text,text)
   let values;

    switch (req.body.action) {
        case '댓글':
            values=`(${bbsID}, '${userID}', '${text}', NOW(), ${myid}, ${myid}, 0, 0)`            
            break;
        case '대댓글':
            values=`(${bbsID}, '${userID}', '${text}', NOW(), ${groupID}, ${parent}, ${depth}, ${seq})`   
            break;
    }      

    let sql = `INSERT INTO board_comment (boardID, userID, commentText, createDate, groupID, parent, depth, seq) VALUE 
    ${values}` 

    connection.query(sql,(err,rows,fields)=>{
        try{
            if(err){
                console.log(err);
                res.send('등록실패')
            }else{
                res.send('등록완료');
            }
        }catch(err){
            console.log(err);
            res.send('등록실패')
        }
    })
})


//#댓글 가져오기
router.get('/board/comments/:id',(req,res)=>{
    let order = 'ORDER BY h';
    switch(req.query.order){
        case '등록순':
            order = 'ORDER BY h'
            break;
        case '최신순':
            order = 'ORDER BY groupID desc, h asc'
            break;
    }
    let sql = `WITH RECURSIVE CteDept(id, boardID, userID, commentText, createDate, groupID ,parent, depth, seq, lv, h) AS
    (
        SELECT id, boardID, userID, commentText, createDate, groupID ,parent, depth, seq, 0,CAST(id AS CHAR(10)) FROM board_comment WHERE boardID=? AND depth=0
        UNION
        SELECT A.id, A.boardID, A.userID, A.commentText, A.createDate, A.groupID ,A.parent, A.depth, A.seq, B.lv+1,CONCAT(B.h,('-'),A.id) FROM board_comment A INNER JOIN CteDept B ON A.parent = B.id WHERE A.parent != A.id
    )
    SELECT id, boardID, A.userID, B.ProfileImage, ifnull(B.NickName,'이름없음') AS NickName, commentText, DATE_FORMAT(createDate,'%Y.%m.%d. %H:%i') AS createDate, groupID ,parent, depth, seq FROM CteDept A LEFT JOIN login B ON A.userID = B.userID ${order};`
    let params =[
        req.params.id,        
    ]
    connection.query(sql,params,(err,rows,fields)=>{
        try{
            if(err){
                console.log(err);
            }else{
                res.send(rows);
            }
        }catch(err){
            console.log(err);
        }
    })
})



//#조회수 증가
router.post('/board/readcount',(req,res)=>{
    let sql = 'UPDATE board SET read_count=read_count+1 WHERE boardID=?'    
    let params =[
        req.body.boardID
    ]
    connection.query(sql,params,(err,rows,fields)=>{
        try{
            if(err){
                console.log(err);
            }else{
                res.send(rows);
            }
        }catch(err){
            console.log(err);
        }
    })
})


module.exports = router;