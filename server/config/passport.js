require('dotenv').config();
const passport   = require('passport')
const conf       = require('../config.js');
var {connection} = require('../dbconnection');

//스토리지
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { json } = require('express');
//셋팅

//페이스북 api ID, Secret 정보 저장 (구글 개발자 웹 내 앱ID, 시크릿 입력)
passport.use(new FacebookStrategy(
    {
        clientID      : conf.FACEBOOK_CLIENT_ID,
        clientSecret  : conf.FACEBOOK_CLIENT_SECRET,
        callbackURL   : '/api/auth/facebook/callback',
        passReqToCallback   : true,
        profileFields: ['email','id', 'displayName','first_name', 'gender', 'last_name', 'picture','profileUrl']
    }, function(request, accessToken, refreshToken, profile, done) {
            console.log(profile)
            let sql = `SELECT * FROM login WHERE userID=?`
            let params = [profile.id]
            connection.query(sql, params,(err, rows, fields) => {
                if (err) return done(err);
                else if (rows.length > 0) {
                    console.log(rows[0].userID);
                    return done(null, rows[0].userID, { message: '로그인 성공' });
                }
                else {            
                    DB_RegisterID(profile.id,profile.displayName,profile.photos[0].value,profile.emails[0].value,'facebook');
                    return done(null, profile.id, { message: '로그인 성공' });
                }
            })
    }
    ));


//구글 api ID, Secret 정보 저장 (구글 개발자 웹 내 앱ID, 시크릿 입력)
passport.use(new GoogleStrategy(
{
    clientID      : conf.GOOGLE_CLIENT_ID,
    clientSecret  : conf.GOOGLE_CLIENT_SECRET,
    callbackURL   : '/api/auth/google/callback',
    passReqToCallback   : true,
}, function(request, accessToken, refreshToken, profile, done) {
        console.log(profile,profile.displayName,profile.picture,profile.email,profile.id)
        let sql = `SELECT * FROM login WHERE userID=?`
        let params = [profile.id]
        connection.query(sql, params,(err, rows, fields) => {
            if (err) return done(err);
            else if (rows.length > 0) {
                console.log(rows[0].userID);
                return done(null, rows[0].userID, { message: '로그인 성공' });
            }
            else {            
                DB_RegisterID(profile.id,profile.displayName,profile.picture,profile.email,'google');
                return done(null, profile.id, { message: '로그인 성공' });
            }
        })
       // return done(null, profile, {message:'로그인 성공'});        
}
));

passport.use(new LocalStrategy({
    usernameField: 'userID',
    passwordField: 'userPW',
    session: true,
    passReqToCallback: false,
  }, function (userID, userPW, done) {
    // console.log(입력한아이디, 입력한비번);
    let sql = 'SELECT * FROM login WHERE userID=?';
    let params =[
        userID,        
    ]
    connection.query(sql,params,(err,rows,fields)=>{
        if(err){ console.log(err); return done(err);}
        else if(rows.length > 0){     
            if(rows[0].userPW === userPW){
                console.log(rows[0].userID);
                return done(null, rows[0].userID, {message:'로그인 성공'});
            }   
            else{
                console.log("비밀번호 불일치");
                return done(null, false, {message:'비밀번호 불일치'});
            }
        }
        else{
            console.log("아이디가 없습니다.");
            return done(null, false, {message:'아이디가 없습니다.'});
        }
    })
  }));


const DB_RegisterID = (id,displayName,Picture,email,provider)=>{
    let sql = 'INSERT INTO login VALUE (?,null,?,now(),?,?,?,?)'
    let params=[
        id,
        displayName,
        Picture,
        email,
        provider,
        'user'
    ]
    connection.query(sql,params,
        (err,rows,fields)=>{
            try{
                if (err){
                    console.log('가입실패',err);  
                    return false;
                }
                else{
                    console.log('가입성공');
                    return true;
                }                
            }
            catch(error){
                console.log(error);
            }
        }
    )
};

//세션 생성
passport.serializeUser((user, done)=>{
    done(null, user);
})

//세션을 가지고 추가정보 가져오기
passport.deserializeUser((user, done)=>{
let sql = 'SELECT * FROM login WHERE userID=?';
let params =[user]
// console.log('deserializeUser :', user);
connection.query(sql,params,(err,rows,fields)=>{
    if(err) return done(err);
    else if(rows.length > 0){       
        console.log('유효 세션');
        return done(null, rows, {message:'유효 세션'});
    }
    else{
        console.log('세션 없음');
        return done(null, false, {message:'세션 없음'});
    }
})
})
module.exports = passport;