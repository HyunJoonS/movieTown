var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul");

let datetime = ()=>{return moment().format('YYYY-MM-DD HH:mm:ss')}

module.exports = datetime;