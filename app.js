App({
  globalData: {
    // urlHeaderA:'http://192.168.1.136:1007/phoneCard/v1/noIntercept/',
    urlHeaderA: 'https://app-group.lihetianxia.com/phoneCard/v1/noIntercept/',
    urlHeaderB: 'https://jllt.linplus.com.cn/test/',
    urlHeaderC: 'http://mob3.6lidi.com/',
    timer: null,
    h: '00',
    m: '00',
    s: '00'
  },
  countTime: function(end) {
    this.globalData.timer = setTimeout((e) => {
      //获取当前时间
      let date = new Date();
      let now = date.getTime();
      //时间差
      let leftTime = end - now;
      if (leftTime >= 0) {
        this.globalData.h = ('0' + Math.floor(leftTime / 1000 / 60 / 60)).slice(-2)
        this.globalData.m = ('0' + Math.floor(leftTime / 1000 / 60 % 60)).slice(-2)
        this.globalData.s = ('0' + Math.floor(leftTime / 1000 % 60)).slice(-2)
        this.countTime(end)
      } else {
        clearTimeout(this.globalData.timer)
      }

    }, 1000)
  }
});