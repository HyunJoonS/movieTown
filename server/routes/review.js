var router = require('express').Router();
//moment timezone

const {connection} = require('../dbconnection')
const datetime = require('../datatime')

function 로그인체크(요청,응답,next){
    if(요청.user){
        next();
    }
    else{
        응답.send('로그인을 해주세요');
    }
}

router.post("/movie/reviews",로그인체크,(req,res)=>{
    let sql = 'INSERT INTO movie_review VALUE (null,?,?,?,?,?,?)' 
    params=[        
        req.body.movieID,
        req.user[0].userID,
        req.body.text,
        parseInt(req.body.starpoint),
        req.body.spoiler,
        datetime()       
    ]
    connection.query(sql,params,(err,rows,fields)=>{
        try{
            if(err){
                res.send('error');
            }
            else{
                res.send('등록완료');
            }
        }
        catch(error){
            console.log(error);
        }
    })
})


router.get("/movie/review/:id/:spoiler",(req,res)=>{
    let sql = 'SELECT * FROM movie_review WHERE movieID = ? AND spoiler = ?'
    params = [
        req.params.id, // movieID
        req.params.spoiler // spoiler
    ]
    connection.query(sql,params,(err,rows,fields)=>{
        try{
            if(err){
                res.send(err);
                console.log(err);
            }
            else{
                res.send(rows);
            }
        }
        catch(error){
            console.log(error);
        }

    })
})

router.get('/movie/reviews/:id',(req,res)=>{
    let sql = 'SELECT reviewID,movieID,userID,`text`,`point`,spoiler,(SELECT TIMESTAMPDIFF(minute,`date`,NOW())) AS `date`, IFNULL(`like`,0) AS `like`,IFNULL(dislike,0) AS dislike FROM movie_review AS A'
    +' LEFT JOIN (SELECT reviewID, COUNT(*) `like` FROM movie_review_like WHERE userlike = 1 GROUP BY reviewID) AS B USING(reviewID)'
    +' LEFT JOIN (SELECT reviewID, COUNT(*) dislike FROM movie_review_like WHERE userlike = 0 GROUP BY reviewID) AS C USING(reviewID)'   
    +' WHERE movieID = ?'      
    let params = [
        req.params.id
    ]
    connection.query(sql,params,(err,rows,fields)=>{
        try{
            if(err){                
                res.send(err);
                console.log(err);
            }
            else{           
                console.log(rows);
                if(rows.length > 0){
                    let ads = 몇분전(rows);
                    res.send(ads);
                }
                else{
                    res.send(rows);
                }
                            
            }
        }catch(error){
            console.log(error);
        }
    })    
})
function 몇분전(rows){        
    let sum=0;
    for(let i=0 ; i < rows.length ; i++){
        let time = rows[i].date;
        sum += rows[i].point;   
        if(time < 60){
            rows[i].date = parseInt(time)+'분 전';
        }
        else if(time < 1440){
            time = time/60;
            rows[i].date = parseInt(time)+'시간 전';
        }
        else{
            time = time/1440;
            rows[i].date = parseInt(time)+'일 전';
        }        
    }
    let avg = (sum/rows.length).toFixed(1);
    rows[0].avg = avg;
    return(rows);
}

module.exports = router;