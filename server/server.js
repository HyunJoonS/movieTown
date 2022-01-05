//패키지
const express    = require('express');
const multer     = require('multer');
const request    = require('request')
const path       = require('path');
const cors       = require('cors')
const flash      = require('connect-flash');
var session      = require('express-session')
const {sessionStore, connection}   = require('./dbconnection')
const NickName   = require('./RandomNickname')
const passport   = require('passport');

//moment timezone
const datetime = require('./datatime')


const app = express();
app.use(cors());
const server = require("http").createServer(app);
const io = require('socket.io')(server)
server.listen(5000,()=>{
  console.log('listen 5000')
})



//미들웨어 사용
app.use(express.urlencoded({extended: false})) 
app.use(express.json());
app.use('/image',express.static('./public/uploads')); // 정적 파일 위치 설정
app.use(flash());

var sessionMiddleware = session({
  // store : sessionStore,
  secret: 'changeit', //세션 생성시 필요한 비밀번호 아무거나 작성해도됨
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
})
//passport setting
app.use(sessionMiddleware)
app.use(passport.initialize());
app.use(passport.session());

//라우터
app.use('/api', require('./routes/tmdbapi') );
app.use('/api', require('./routes/review') );
app.use('/api', require('./routes/board') );
app.use('/api', require('./routes/user') );


// multer 설정
const upload = multer({
storage: multer.diskStorage({
    // 저장할 장소
    destination(req, file, cb) {
    cb(null, 'public/uploads');
    },
    // 저장할 이미지의 파일명
    filename(req, file, cb) {
    const ext = path.extname(file.originalname); // 파일의 확장자
    console.log('file.originalname', file.originalname);
    // 파일명이 절대 겹치지 않도록 해줘야한다.
    // 파일이름 + 현재시간밀리초 + 파일확장자명
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
}),
// limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
});


// 하나의 이미지 파일만 가져온다.
app.post('/img', upload.single('img'), (req, res) => {
    // 해당 라우터가 정상적으로 작동하면 public/uploads에 이미지가 업로드된다.
    // 업로드된 이미지의 URL 경로를 프론트엔드로 반환한다.
    console.log('전달받은 파일', req.file);
    console.log('저장된 파일의 이름', req.file.filename);

    // 파일이 저장된 경로를 클라이언트에게 반환해준다.
    const IMG_URL = `http://localhost:5000/uploads/${req.file.filename}`;
    console.log(IMG_URL);
    res.json({ url: IMG_URL });
});


app.get("/api/debug", (req, res) => {
    console.log(req.session,req.session.id);
    res.json({
      "req.session": req.session, // 세션 데이터
      // "req.user": req.user, // 유저 데이터(뒷 부분에서 설명)
      // "req._passport": req._passport, // 패스포트 데이터(뒷 부분에서 설명)
    })
  })

  //socket.io
  const wrapper = (middleware) => (socket, next) => middleware(socket.request, {}, next);
  io.use(wrapper(sessionMiddleware,{autoSave:true}));
  io.use(wrapper(passport.initialize()))
  io.use(wrapper(passport.session()))
  io.use((socket,next)=>{
    if(socket.request.user){
      console.log('socket passport OK')    
      next();
    }
    else{
      console.log('socket passport not OK')    
      next();
      // next(new Error("thou shall not pass"));
    }
  })
  io.on('connection',(socket)=>{
    console.log("SOCKETIO connect EVENT: ", socket.id, " client connect");

    let messageObj = {
      id: '',
      nickname: '',
      profileImage: '',
      type:'chat',
      message:'',
    }

    if(socket.request.user){
      //연결이벤트
      messageObj.id= socket.request.user[0].userID
      messageObj.nickname= socket.request.user[0].NickName
      messageObj.profileImage= socket.request.user[0].ProfileImage
      messageObj.type = 'system'
      messageObj.message = `${socket.request.user[0].NickName} 님이 연결되었습니다.`
      io.emit('every', messageObj);             
      
      
      //메세지 전달
      socket.on('every',(data)=>{        
        messageObj.type = 'chat';
        messageObj.message=data;   
        socketDB_Insert(messageObj.id,data)
        socket.broadcast.emit('every',messageObj );
      })
    }
      //연결해체
      socket.on('disconnect',()=>{
        console.log("SOCKETIO disconnect EVENT: ", socket.id, " client disconnect");
      })
    })


    const socketDB_Insert = (userID, text)=>{
      let sql = 'INSERT INTO chat (`userID`,`dateTime`,`text`) VALUE (?,NOW(),?)'
      let params=[
        userID,text
      ]
      connection.query(sql,params,(err,rows,fields)=>{
        try{
          if(err){
            console.log(err)
          }
        }catch(err){
          console.log(err);
        }
      })
    }

    
    app.get('/api/chat',(req,res)=>{
      let sql = 'SELECT A.* , B.ProfileImage,B.NickName FROM chat A LEFT JOIN login B ON A.userID = B.userID'
      connection.query(sql,(err,rows,fields)=>{
        try{
          if(err){
            console.log(err)
          }
          else{
            console.log(rows)
            res.send(rows);
          }
        }catch(err){
          console.log(err)
        }
      })
    })