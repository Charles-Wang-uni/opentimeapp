
var msg = function(data) {
  var msg = data.title + "\n";
  if (data.isOpened) {
    msg += "今日营业时间：" + data.openTime.format('HH:mm') + " ~ " + data.closeTime.format('HH:mm');
    //var curMoment = moment(luxtz.time, 'HH:mm');
    //var openTime = moment(data.startTime, 'HH:mm');
    //var endTime = moment(data.endTime, 'HH:mm');
    if (data.curMoment.isAfter(data.closeTime)) {
      msg += "\n现已关门，下次要早点哦！";
    } else if (data.curMoment.isBefore(data.openTime)) {
      msg += "\n目前还未开门，再耐心等等！";
    } else {
      msg += "\n--目前正在营业--";
    }
  } else {
    msg += "--今日不营业--。";
  }
  return msg;
}

module.exports = msg;
