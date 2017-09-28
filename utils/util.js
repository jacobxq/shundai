var util = {
  formatTime: function (date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  },
  formatNumber: function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  // 获取日期
  getDate: function (num = 90) {
    var arr = [];
    var today = new Date();
    for (var i = 0; i < num; i++) {
      var date = this.getDateStr(today,i);
      var dateID = this.getDateStr(today,i, true);
      arr.push({
        id: dateID,
        name: date
      });
    }
    arr[0].name = '今天' + arr[0].name
    arr[1].name = '明天' + arr[1].name
    arr[2].name = '后天' + arr[2].name
    return arr;
  },
  // 获取前天、昨天、今天、明天、后天、大后天的日期
  getDateStr: function (day, count, bool) {
    var dd = new Date(day);
    dd.setDate(dd.getDate() + count); // 获取count天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    
    if (bool) {
      y = y > 9 ? y : '0' + y
      m = m > 9 ? m : '0' + m
      d = d > 9 ? d : '0' + d
      return y + '-' + m + '-' + d;
    } else {
      return y + '年' + m + '月' + d + '日';
    }
  },
  // 获取时间
  getTime: function () {
    var arr = [];
    for (var i = 0; i < 24; i++) {
      var j = ''
      j = i > 9 ? i : '0' + i      
      arr.push({
        id: j,
        name: j + ':00'
      });
    }
    return arr;
  }
};


module.exports = util
