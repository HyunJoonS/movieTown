const request = require("request");

// api 요청 변수
const api_url = "https://openapi.naver.com/v1/papago/n2mt";
const client_id = "your-client-id";
const client_secret = "your-client-secret-key";
const query = "papago open api translation success!";

// api 요청 옵션 (번역: 영어 -> 한글)
const options = {
  url: api_url,
  form: { source: "en", target: "ko", text: query },
  headers: {
    "X-Naver-Client-Id": client_id,
    "X-Naver-Client-Secret": client_secret,
  },
};

// api 요청 보내고 콜백으로 결과 받기
request.post(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(JSON.parse(body));
  } else {
    console.log("error = " + response.statusCode);
  }
});