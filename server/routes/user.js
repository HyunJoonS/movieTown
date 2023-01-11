const router    = require('express').Router();
const e         = require('connect-flash');
const passport  = require('../config/passport');
const multer    = require('multer');
const sharp     = require('sharp');
const fs        = require('fs');
const path      = require('path');
const conf      = require('../config.js');
const NickName  = require('../RandomNickname')
const upload    = multer({ dest: path.join(__dirname, '../public/uploads')})
const {connection} = require('../dbconnection');

router.get('/fail',(req,res)=>{
    
    
    let message = req.flash().error[0];
    console.log(message);
    if(message==="Missing credentials"){
        message= "아이디 비밀번호를 확인해 주세요.";
    }
    res.send(message);
})

router.get('/logout',(req,res)=>{
    console.log('로그아웃');
    req.logout();
    req.session.save(function(){
        res.send('로그아웃 성공');
      })
})

router.get('/login',로그인체크,(req,res)=>{
    delete req.user[0].userPW;
    console.log('user',req.user);
    res.send(req.user);
})

//로그인
router.post('/login',passport.authenticate('local',{
    failureRedirect:'/api/fail',
    failureFlash : true
}),(req,res)=>{
    console.log('loginPost',req.user)
    // req.session.user = req.user;?
    res.send(req.user);
})

//profileImage
router.post('/user/update/profileimage',로그인체크,upload.single('profileimg'),(req,res)=>{
    console.log('file',req.file);
    try{
        sharp(req.file.path)	// 리사이징할 파일의 경로
            .resize({width:640}) // 원본 비율 유지
            .withMetadata() //파일 깨지지않게
            .toBuffer((err, buffer)=>{
                if(err) throw err       
                //덮어씌우기        
                fs.writeFile(req.file.path, buffer,(err)=>{	
                  if(err) throw err				                  
                })                  
            })
      }catch(err){
          console.log(err)
    }
    let profileName = `${conf.SERVER}/image/${req.file.filename}`;
    let sql = `UPDATE login SET ProfileImage = ? WHERE userID = ?`
    let params=[
        profileName,
        req.user[0].userID
    ]
    connection.query(sql,params,(err,rows,fields)=>{
        try{
            if (err){
                res.status(500).send(err+'서버 에러');
                console.log(err);
            }
            else{
                console.log('성공');
                res.send('업데이트 성공');
            }
        }
        catch(error){
            console.log(error);
        }
    })
})


//닉네임 변경
router.post('/user/update/nickname',로그인체크,(req,res)=>{    
    let sql = `UPDATE login SET NickName = ? WHERE userID = ?`
    let params=[
        req.body.nickName,
        req.body.userID
    ]
    connection.query(sql,params,(err,rows,fields)=>{
        try{
            if (err){
                res.status(500).send(err+'서버 에러');
                console.log(err);
            }
            else{
                res.send('업데이트 성공');
            }
        }
        catch(error){
            console.log(error);
        }
    })
})

// Register
router.post('/register', async(req, res) => {   
    let sql = 'INSERT INTO login (userID,userPW,NickName,createDateTime,ProfileImage)VALUE (?,?,?,now(),null)'
    let RandomNickname = NickName();
    console.log(RandomNickname);
    let params = [
        req.body.userID,
        req.body.userPW,
        RandomNickname
    ]
    let CheckID = await 중복검사(req.body.userID);   
    if(CheckID<1){
        connection.query(sql,params,
            (err,rows,fields)=>{
                try{
    
                    if (err){
                        console.log(err);
                        res.send('서버 에러');
                    }
                    else{
                        res.send('가입 성공');
                    }
                    
                }
                catch(error){
                    console.log(error);
                }
            }
        )
    }   
    else{
        res.send('이미 가입된 아이디입니다.');
    }
});

function 중복검사(userID){
    let sql = 'SELECT * FROM login WHERE userID=?';
    return new Promise((resolve, reject)=>{
        connection.query(sql,userID,(err,rows,fields)=>{
            try{
                if (err){
                    reject(err);           
                }
                else{
                    if(rows.length > 0 ){
                        resolve(rows.length);
                    }
                    else{
                        resolve(rows.length);
                    }
                }
                return 0;
            }
            catch(error){
                console.log(error);
                return 0;
            }
        })
    })      
}

function 로그인체크(요청,응답,next){
    if(요청.user){
        next();
    }
    else{
        // console.log('로그인안함');
        return 응답.status(401).send({message : '로그인을 해주세요'});
    }
}

router.get('/test',(req,res)=>{
    let nickname = NickName();
    console.log(nickname);
    res.status(200).send(nickname)
})


//구글 로그인 버튼 클릭시 구글 페이지로 이동하는 역할
router.get('/auth/google',
  passport.authenticate('google', { scope:
  	[ 'email', 'profile' ] }
),
(req,res)=>{
    console.log('loginPost',req.user)
    res.send(req.user);});

  //구글 로그인 후 자신의 웹사이트로 돌아오게될 주소 (콜백 url)
router.get( '/auth/google/callback',passport.authenticate( 'google', {successRedirect: '/',failureRedirect: '/login'}));



//페이스북 로그인 버튼 클릭시 구글 페이지로 이동하는 역할
router.get('/auth/facebook',
  passport.authenticate('facebook', { scope : ['email','public_profile']}
),
(req,res)=>{
    console.log('loginPost',req.user)
    res.send(req.user);});

  //페이스북 로그인 후 자신의 웹사이트로 돌아오게될 주소 (콜백 url)
router.get( '/auth/facebook/callback',passport.authenticate( 'facebook', {successRedirect: '/',failureRedirect: '/login'}));



module.exports = router;