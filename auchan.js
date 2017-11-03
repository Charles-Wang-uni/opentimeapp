var express = require('express');
var http = require('https');
var luxtz = require('./lib/luxtz');
var msg = require('./lib/msg');
var moment = require('moment-timezone');
var router = express.Router();

var url = {
  host: 'int-retail-portal-api.auchan.net',
  path: '/wp-json/wp/v2/stores/kirchberg-store?lang=en'
}


function extractOpenTime(data) {
  var dayOfWeek = luxtz.day;
  var openTime = { isOpened: data.store[dayOfWeek+"_opened"] };
  if(openTime.isOpened) {
    openTime.startTime = data.store[dayOfWeek+"_start_hours"] + ":" + data.store[dayOfWeek+"_start_minutes"];
    openTime.endTime = data.store[dayOfWeek+"_end_hours"] + ":" + data.store[dayOfWeek+"_end_minutes"];
  }
  openTime.specialOpenings = [];
  data.store.special_opening_hours.forEach(function(item, index) {
    var specialDate = moment(item.date, 'DD/MM').format('M 月 D 日');
    //if Current date is a specialDate then update openTime of luxtz
    if(luxtz.date === specialDate) {
      openTime.isOpened = item.special_opening;
      if(item.special_opening) {
        openTime.startTime = item.start_hours + ":" + item.start_minutes;
        openTime.endTime = item.end_hours + ":" + item.end_minutes;
      }
    }
    openTime.specialOpenings[index] = {
      date: specialDate,
      startTime: item.start_hours + ":" + item.start_minutes,
      endTime: item.end_hours + ":" + item.end_minutes
    };
  });
  return openTime;
}

function getOpenTime(callback) {
  http.get(url, function(res) {
    res.setEncoding('utf8');
    var body = '';
    res.on('data', function(d) { body += d; });
    res.on('end', function() {
      var data = JSON.parse(body);
      callback(extractOpenTime(data));
    });
  });
}

function sendOpenTime(callback) {
  getOpenTime(function(data){
    callback(msg({title: '*******欧尚Kirchberg*******',
     isOpened: data.isOpened,
     curMoment: moment(luxtz.time, 'HH:mm'),
     openTime: moment(data.startTime, 'HH:mm'),
     closeTime: moment(data.endTime, 'HH:mm')
  }));
});
}


router.get('/', function (req, res) {
  sendOpenTime(function (msg) {
    res.send(msg);
  });
});

module.exports = router;
