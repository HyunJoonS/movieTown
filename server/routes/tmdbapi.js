var router = require('express').Router();
const request = require('request')

const TMDB_API_Key = 'f7ae756dc0995d6bb41b186d8912a119';
const NAVER_CLIENT_ID = 'tJonrAzZb7_ojoWfWQBa'
const NAVER_CLIENT_SECRET = '_dgE8mr70g'

//TMDB 검색
router.get('/search/:id',async(요청,응답)=>{
    let title = 요청.params.id;
    let array= await Promise.all([
        search(title,'movie'),
        search(title,'tv'),
        search(title,'person')
    ])
    응답.status(200).send(array);
})

function search(title,type){
    return new Promise((resolve, reject) => {        
        const option = {
            uri: 'https://api.themoviedb.org/3/search/'+type,
            qs: {
                api_key: TMDB_API_Key,
                language: 'ko-KR',
                query: title,
                page: 1,
                include_adult: false
            }
        }
        request.get(option, function (err, res, body) {          
            let json = JSON.parse(body) //json으로 파싱
            resolve(json);     
            reject(err);
        })
    })
}




//개봉예정
router.get('/upcoming',(요청,응답)=>{
    const option = {
        uri: 'https://api.themoviedb.org/3/movie/upcoming',
        qs:  {
            api_key : TMDB_API_Key,
            language : 'ko-KR',
            page : 1,
            region : 'KR'
        }
    }   
    request.get(option, function (err, res, body) {
        let json = JSON.parse(body) //json으로 파싱
        응답.send(json);
    })     
})

//높은평점
router.get('/toprated',(요청,응답)=>{
    const option = {
        uri: 'https://api.themoviedb.org/3/movie/top_rated',
        qs:  {
            api_key : TMDB_API_Key,
            language : 'ko-KR',
            page : 1,
            region : 'KR'
        }
    }   
    request.get(option, function (err, res, body) {
        if(err){
            console.log(err);
            응답.send([]);
        }else{
            let json = JSON.parse(body) //json으로 파싱        
            응답.send(json);
        }
      
    })     
})

//현재상영중
router.get('/nowplaying',(요청,응답)=>{
    const option = {
        uri: 'https://api.themoviedb.org/3/movie/now_playing',
        qs:  {
            api_key : TMDB_API_Key,
            language : 'ko-KR',
            page : 1,
            region : 'KR'
        }
    }   
    request.get(option, function (err, res, body) {
        let json = JSON.parse(body) //json으로 파싱
        응답.send(json);
    })     
})



//인기목록 가져오기
router.get('/popular',(요청,응답)=>{
    const option = {
        uri: 'https://api.themoviedb.org/3/movie/popular',
        qs:  {
            api_key : TMDB_API_Key,
            language : 'ko-KR',
            page : 1,
            region : 'KR'
        }
    }   
    request.get(option, function (err, res, body) {
        let json = JSON.parse(body) //json으로 파싱
        응답.send(json);
    })     
})//+'/videos'


// 영화,TV 상세정보 가져오기 
//https://api.themoviedb.org/3/tv/88329?api_key=f7ae756dc0995d6bb41b186d8912a119&language=ko-KR&append_to_response=videos,watch/providers,credits,release_dates
router.get('/detail/:movieOrTV/:id',(요청,응답)=>{
    console.log('실행')
    const option = {
        uri: `https://api.themoviedb.org/3/${요청.params.movieOrTV}/${요청.params.id}`,
        qs:  {            
            api_key : TMDB_API_Key,
            language : 'ko-KR',
            append_to_response : 'videos,watch/providers,credits,release_dates',
        }
    }   
    request.get(option, function (err, res, body) {    
        let json = JSON.parse(body) //json으로 파싱
        if(json.success == false){
            console.log('204');
            응답.status(204).send(null);
        }
        else{
            // console.log(json);
            응답.status(200).send(json);
        }
        
    })        
})

// 사람들 상세정보 가져오기 
//https://api.themoviedb.org/3/tv/88329?api_key=f7ae756dc0995d6bb41b186d8912a119&language=ko-KR&append_to_response=videos,watch/providers,credits,release_dates
router.get('/person/:id',(요청,응답)=>{
    const option = {
        uri: `https://api.themoviedb.org/3/person/${요청.params.id}`,
        qs:  {            
            api_key : TMDB_API_Key,
            language : 'ko-KR',
            append_to_response : 'combined_credits,credits,images,translations',
        }
    }   
    request.get(option, function (err, res, body) {    
        let json = JSON.parse(body) //json으로 파싱
        if(json.success == false){
            console.log('204');
            응답.status(204).send(null);
        }
        else{
            // console.log(json);
            응답.status(200).send(json);
        }
        
    })        
})

//http://localhost:3000/tv/88329
//이미지
router.get('/images/:movieOrTV/:id',(요청,응답)=>{        
    const option = {
        uri: `https://api.themoviedb.org/3/${요청.params.movieOrTV}/${요청.params.id}/images`,
        qs:  {            
            api_key : TMDB_API_Key,    
            include_image_language : 'null'
        }
    }   
    request.get(option, function (err, res, body) {
        let json = JSON.parse(body) //json으로 파싱
        //console.log(json)
        응답.send(json);
    })        
})





//TV인기
router.get('/tv/popular',(요청,응답)=>{
    const option = {
        uri: 'https://api.themoviedb.org/3/tv/popular',
        qs:  {
            api_key : TMDB_API_Key,
            language : 'ko-KR',
            page : 1,
            region : 'KR'
        }
    }   
    request.get(option, function (err, res, body) {
        let json = JSON.parse(body) //json으로 파싱
        응답.send(json);
    })     
})

//TV오늘방영
router.get('/tv/airing-today',(요청,응답)=>{
    const option = {
        uri: 'https://api.themoviedb.org/3/tv/airing_today',
        qs:  {
            api_key : TMDB_API_Key,
            language : 'ko-KR',
            page : 1,
        }
    }   
    request.get(option, function (err, res, body) {
        let json = JSON.parse(body) //json으로 파싱
        응답.send(json);
    })     
})

//TV오늘방영
router.get('/tv/on-the-air',(요청,응답)=>{
    const option = {
        uri: 'https://api.themoviedb.org/3/tv/on_the_air',
        qs:  {
            api_key : TMDB_API_Key,
            language : 'ko-KR',
            page : 1,
        }
    }   
    request.get(option, function (err, res, body) {
        let json = JSON.parse(body) //json으로 파싱
        응답.send(json);
    })     
})

//TV오늘방영
router.get('/tv/toprated',(요청,응답)=>{
    const option = {
        uri: 'https://api.themoviedb.org/3/tv/top_rated',
        qs:  {
            api_key : TMDB_API_Key,
            language : 'ko-KR',
            page : 1,
        }
    }   
    request.get(option, function (err, res, body) {
        let json = JSON.parse(body) //json으로 파싱
        응답.send(json);
    })     
})

module.exports = router;