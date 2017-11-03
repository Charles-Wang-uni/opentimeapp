var moment = require('moment-timezone');

var timezone = moment().tz('Europe/Luxembourg');

luxtz = {
  date: timezone.format('M 月 D 日'),
  day: timezone.format('dddd').toLowerCase(),
  time: timezone.format('HH:mm')
};

module.exports = luxtz;
